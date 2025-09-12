# IMTR School Management System - Development Makefile

.PHONY: help install dev build start stop clean logs migrate seed test lint format

# Default target
help: ## Show this help message
	@echo "IMTR School Management System - Development Commands"
	@echo "=================================================="
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Installation
install: ## Install all dependencies
	@echo "Installing backend dependencies..."
	cd backend && npm install
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

# Development
dev: ## Start development environment
	@echo "Starting development environment..."
	docker-compose up -d
	@echo "Waiting for services to be ready..."
	sleep 10
	@echo "Running database migrations..."
	make migrate
	@echo "Seeding database..."
	make seed
	@echo "Development environment is ready!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend API: http://localhost:3001"
	@echo "API Docs: http://localhost:3001/docs"
	@echo "Mailhog: http://localhost:8025"

dev-logs: ## Show development logs
	docker-compose logs -f

# Building
build: ## Build all services
	@echo "Building backend..."
	cd backend && npm run build
	@echo "Building frontend..."
	cd frontend && npm run build

# Production
start: ## Start production environment
	@echo "Starting production environment..."
	docker-compose -f docker-compose.prod.yml up -d

stop: ## Stop all services
	@echo "Stopping all services..."
	docker-compose down

# Database
migrate: ## Run database migrations
	@echo "Running database migrations..."
	docker-compose exec api npm run migrate

migrate-undo: ## Undo last migration
	@echo "Undoing last migration..."
	docker-compose exec api npm run migrate:undo

seed: ## Seed database with sample data
	@echo "Seeding database..."
	docker-compose exec api npm run seed

reset-db: ## Reset database (drop, create, migrate, seed)
	@echo "Resetting database..."
	docker-compose exec api npm run migrate:undo:all
	docker-compose exec api npm run migrate
	docker-compose exec api npm run seed

# Testing
test: ## Run all tests
	@echo "Running backend tests..."
	cd backend && npm test
	@echo "Running frontend tests..."
	cd frontend && npm test

test-backend: ## Run backend tests
	@echo "Running backend tests..."
	cd backend && npm test

test-frontend: ## Run frontend tests
	@echo "Running frontend tests..."
	cd frontend && npm test

test-e2e: ## Run end-to-end tests
	@echo "Running E2E tests..."
	cd frontend && npm run test:e2e

# Code Quality
lint: ## Run linting on all code
	@echo "Linting backend..."
	cd backend && npm run lint
	@echo "Linting frontend..."
	cd frontend && npm run lint

format: ## Format all code
	@echo "Formatting backend..."
	cd backend && npm run format
	@echo "Formatting frontend..."
	cd frontend && npm run format

# Cleanup
clean: ## Clean up containers, volumes, and images
	@echo "Cleaning up..."
	docker-compose down -v --remove-orphans
	docker system prune -f

clean-all: ## Clean up everything including images
	@echo "Cleaning up everything..."
	docker-compose down -v --remove-orphans
	docker system prune -af

# Logs
logs: ## Show logs for all services
	docker-compose logs -f

logs-api: ## Show API logs
	docker-compose logs -f api

logs-web: ## Show frontend logs
	docker-compose logs -f web

logs-db: ## Show database logs
	docker-compose logs -f db

# Database Management
db-shell: ## Open database shell
	docker-compose exec db mysql -u root -p imtr_school_management

db-backup: ## Backup database
	@echo "Creating database backup..."
	docker-compose exec db mysqldump -u root -p imtr_school_management > backup_$(shell date +%Y%m%d_%H%M%S).sql

db-restore: ## Restore database from backup (usage: make db-restore BACKUP_FILE=backup.sql)
	@echo "Restoring database from $(BACKUP_FILE)..."
	docker-compose exec -T db mysql -u root -p imtr_school_management < $(BACKUP_FILE)

# Service Management
restart: ## Restart all services
	@echo "Restarting all services..."
	docker-compose restart

restart-api: ## Restart API service
	@echo "Restarting API service..."
	docker-compose restart api

restart-web: ## Restart frontend service
	@echo "Restarting frontend service..."
	docker-compose restart web

# Health Checks
health: ## Check health of all services
	@echo "Checking service health..."
	@echo "API Health:"
	@curl -s http://localhost:3001/health | jq . || echo "API not responding"
	@echo "Frontend Health:"
	@curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "Frontend not responding"

# Development Tools
shell-api: ## Open shell in API container
	docker-compose exec api /bin/sh

shell-web: ## Open shell in frontend container
	docker-compose exec web /bin/sh

shell-db: ## Open shell in database container
	docker-compose exec db /bin/bash

# Monitoring
monitor: ## Monitor resource usage
	@echo "Monitoring resource usage..."
	docker stats

# Security
security-scan: ## Run security scan
	@echo "Running security scan..."
	cd backend && npm audit
	cd frontend && npm audit

# Documentation
docs: ## Generate documentation
	@echo "Generating API documentation..."
	@echo "API documentation available at: http://localhost:3001/docs"

# Quick Commands
quick-start: install dev ## Quick start (install + dev)
	@echo "Quick start completed!"

quick-reset: stop clean dev ## Quick reset (stop + clean + dev)
	@echo "Quick reset completed!"

# Production Deployment
deploy: ## Deploy to production
	@echo "Deploying to production..."
	@echo "This would typically involve:"
	@echo "1. Building production images"
	@echo "2. Pushing to registry"
	@echo "3. Deploying to production server"
	@echo "4. Running migrations"
	@echo "5. Health checks"

# Environment Setup
setup: ## Initial setup for new developers
	@echo "Setting up development environment..."
	@echo "1. Installing dependencies..."
	make install
	@echo "2. Starting services..."
	make dev
	@echo "3. Setup completed!"
	@echo "Access the application at: http://localhost:3000"
