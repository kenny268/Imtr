const request = require('supertest');
const app = require('../src/app');
const { User, Profile } = require('../src/models');
const { hashPassword } = require('../src/utils/crypto');

describe('Authentication', () => {
  let testUser;
  let testProfile;

  beforeEach(async () => {
    // Create test user
    testUser = await global.testUtils.createTestUser({
      email: 'test@example.com',
      role: 'STUDENT'
    });
    
    testProfile = await global.testUtils.createTestProfile(testUser.id);
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('email', 'test@example.com');
      expect(response.body.data).toHaveProperty('role', 'STUDENT');
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should fail with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid email or password');
    });

    it('should fail with non-existent user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should require email and password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          role: 'STUDENT',
          profile: {
            firstName: 'New',
            lastName: 'User',
            phone: '+254700000001',
            gender: 'female'
          }
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('email', 'newuser@example.com');
    });

    it('should fail with duplicate email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          role: 'STUDENT',
          profile: {
            firstName: 'Duplicate',
            lastName: 'User'
          }
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });

    it('should require all mandatory fields', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'incomplete@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should get user profile with valid token', async () => {
      const token = global.testUtils.generateTestToken(testUser);
      
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Cookie', `accessToken=${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', testUser.id);
      expect(response.body.data).toHaveProperty('email', testUser.email);
    });

    it('should fail without token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Cookie', 'accessToken=invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/forgot-password', () => {
    it('should send password reset email for existing user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({
          email: 'test@example.com'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should not reveal if user exists', async () => {
      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({
          email: 'nonexistent@example.com'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
