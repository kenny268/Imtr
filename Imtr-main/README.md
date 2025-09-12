# IMTR School Management System

A comprehensive school management system built for the Institute for Meteorological Training and Research (IMTR), Kenya. This system provides complete management capabilities for students, lecturers, courses, finance, library, research projects, and more.

## 🚀 Features

### Core Modules
- **Authentication & Users**: JWT-based auth with RBAC (6 roles: ADMIN, LECTURER, STUDENT, FINANCE, LIBRARIAN, IT)
- **Student Information System**: Admissions, enrollment, profiles, transcripts, ID generation, clearance
- **Courses & Timetables**: Course catalog, class sections, schedules, lecturer assignment
- **Academic Administration**: Attendance, gradebook, exam scheduling, results publishing, GPA calculation
- **Finance Management**: Invoicing, receipts, fee structures, M-Pesa integration, scholarships
- **Library System**: Catalog management, lending, returns, fines, research database integration
- **Research & Projects**: Project registry, team management, document repository
- **Notifications**: Email/SMS alerts, in-app notifications
- **Reporting & Compliance**: KMD/WMO compliance reports, performance analytics
- **System Administration**: User management, audit logs, configuration

### Technical Features
- **Security**: OWASP Top 10 compliance, CSRF protection, rate limiting, audit logging
- **Performance**: p95 API < 300ms at 1k RPS, horizontal scaling ready
- **Compliance**: Kenya Data Protection Act (2019) compliant
- **Localization**: Kenya timezone (UTC+3), KES currency, local phone formats
- **UI/UX**: Modern dark/light mode, responsive design, accessibility compliant

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: MySQL 8 with Sequelize ORM
- **Authentication**: JWT with httpOnly cookies
- **Validation**: Joi schemas
- **Security**: Helmet, CORS, bcrypt, rate limiting
- **Documentation**: OpenAPI 3 with Swagger UI
- **Logging**: Winston with structured JSON logs

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Query + Zustand
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Headless UI + custom components
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx with TLS termination
- **Process Manager**: PM2
- **Cache**: Redis
- **Object Storage**: MinIO (S3-compatible)
- **Email**: Mailhog (dev) / Nodemailer (prod)
- **CI/CD**: GitHub Actions

## 📋 Prerequisites

- Node.js 20+ 
- Docker & Docker Compose
- MySQL 8+ (if running locally)
- Redis (if running locally)

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd imtr-school-management
   ```

2. **Set up environment variables**
   ```bash
   # Backend
   cp backend/env.example backend/.env
   # Edit backend/.env with your configuration
   
   # Frontend
   cp frontend/.env.example frontend/.env.local
   # Edit frontend/.env.local with your configuration
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Run database migrations**
   ```bash
   docker-compose exec api npm run migrate
   ```

5. **Seed the database**
   ```bash
   docker-compose exec api npm run seed
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/docs
   - Mailhog: http://localhost:8025

### Manual Setup

1. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

2. **Set up database**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE imtr_school_management;
   ```

3. **Run migrations**
   ```bash
   cd backend
   npm run migrate
   npm run seed
   ```

4. **Start development servers**
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm run dev
   
   # Frontend (Terminal 2)
   cd frontend
   npm run dev
   ```

## 📁 Project Structure

```
imtr-school-management/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Sequelize models
│   │   ├── modules/        # Feature modules
│   │   ├── utils/          # Utility functions
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Server entry point
│   ├── sequelize/          # Database migrations & seeds
│   └── tests/              # Test files
├── frontend/               # Next.js React app
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities & API client
│   │   └── styles/        # CSS & Tailwind config
│   └── public/            # Static assets
├── docs/                  # Documentation
├── nginx/                 # Nginx configuration
└── docker-compose.yml     # Docker services
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=imtr_school_management
DB_USER=root
DB_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000

# M-Pesa (Sandbox)
MPESA_ENVIRONMENT=sandbox
MPESA_CONSUMER_KEY=your-consumer-key
MPESA_CONSUMER_SECRET=your-consumer-secret
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

## 📊 API Documentation

- **Swagger UI**: http://localhost:3001/docs
- **OpenAPI Spec**: http://localhost:3001/api-docs.json

### Key Endpoints

- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `GET /students` - List students
- `POST /students` - Create student
- `GET /courses` - List courses
- `POST /finance/mpesa/stk` - M-Pesa payment
- `GET /reports/students` - Student reports

## 🔐 Security

- JWT tokens in httpOnly cookies
- Password hashing with bcrypt
- Rate limiting on all endpoints
- CORS protection
- Input validation with Joi
- SQL injection prevention with Sequelize
- XSS protection with Helmet
- Audit logging for compliance

## 🌍 Localization

- **Timezone**: Africa/Nairobi (UTC+3)
- **Currency**: Kenyan Shilling (KES)
- **Date Format**: YYYY-MM-DD
- **Phone Format**: Kenya mobile numbers (+254)

## 📈 Performance

- API response time < 300ms (p95)
- Horizontal scaling ready
- Redis caching
- Database indexing
- Image optimization
- Code splitting

## 🚀 Deployment

### Production Deployment

1. **Build containers**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Deploy with PM2**
   ```bash
   pm2 start ecosystem.config.js
   ```

3. **Set up Nginx**
   ```bash
   sudo cp nginx/nginx.conf /etc/nginx/sites-available/imtr
   sudo ln -s /etc/nginx/sites-available/imtr /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Environment Setup

- **Production Database**: MySQL 8 with SSL
- **Cache**: Redis Cluster
- **Storage**: AWS S3 or MinIO
- **Email**: SendGrid or AWS SES
- **SMS**: Safaricom API or Africa's Talking
- **Monitoring**: PM2 monitoring + custom metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Development Team**: IMTR Development Team
- **Contact**: dev@imtr.ac.ke
- **Institution**: Institute for Meteorological Training and Research (IMTR), Kenya

## 📞 Support

For support and questions:
- Email: support@imtr.ac.ke
- Documentation: [docs.imtr.ac.ke](https://docs.imtr.ac.ke)
- Issues: [GitHub Issues](https://github.com/imtr/school-management/issues)

---

**Built with ❤️ for IMTR, Kenya**
