#!/bin/bash

# IMTR School Management System - Git Commit Script
# This script provides a structured approach to committing features

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check git status
check_git_status() {
    print_status "Checking git status..."
    git status --porcelain
    echo ""
}

# Function to show staged changes
show_staged_changes() {
    print_status "Staged changes:"
    git diff --cached --name-only
    echo ""
}

# Function to commit with conventional commit format
commit_feature() {
    local feature_name="$1"
    local description="$2"
    local commit_type="$3"
    
    if [ -z "$feature_name" ] || [ -z "$description" ] || [ -z "$commit_type" ]; then
        print_error "Usage: commit_feature <feature_name> <description> <type>"
        print_error "Types: feat, fix, docs, style, refactor, test, chore"
        return 1
    fi
    
    local commit_message="${commit_type}: ${feature_name} - ${description}"
    
    print_status "Committing: $commit_message"
    git commit -m "$commit_message"
    print_success "Feature committed successfully!"
}

# Function to commit all features in sequence
commit_all_features() {
    print_status "Starting comprehensive commit process..."
    echo ""
    
    # Check if there are any changes to commit
    if [ -z "$(git status --porcelain)" ]; then
        print_warning "No changes to commit"
        return 0
    fi
    
    # Add all changes
    print_status "Adding all changes to staging area..."
    git add .
    
    # Show what will be committed
    show_staged_changes
    
    # Commit features in logical order
    print_status "Committing features in logical order..."
    echo ""
    
    # 1. Backend Core Infrastructure
    if git diff --cached --name-only | grep -q "backend/"; then
        print_status "Committing backend infrastructure..."
        git commit -m "feat: backend infrastructure setup

- Node.js + Express server configuration
- MySQL database with Sequelize ORM
- JWT authentication and RBAC middleware
- Input validation with Joi
- Error handling and logging
- Security middleware (CORS, rate limiting, helmet)
- API routes and controllers structure
- Database models and migrations
- Docker configuration for development"
    fi
    
    # 2. Frontend Core Infrastructure
    if git diff --cached --name-only | grep -q "frontend/"; then
        print_status "Committing frontend infrastructure..."
        git commit -m "feat: frontend infrastructure setup

- Next.js 15 with App Router
- Tailwind CSS with custom theme configuration
- React Query for state management
- Context API for theme and navigation
- Role-based access control implementation
- Responsive layout with sidebar and top navbar
- Dark/light theme support
- Animation and transition system
- Authentication flow and protected routes"
    fi
    
    # 3. Authentication System
    if git diff --cached --name-only | grep -q "auth"; then
        print_status "Committing authentication system..."
        git commit -m "feat: complete authentication system

- JWT-based authentication with httpOnly cookies
- Role-based access control (RBAC)
- Login/register pages with form validation
- Password hashing with bcrypt
- Token refresh mechanism
- Protected route handling
- User session management
- Security middleware implementation"
    fi
    
    # 4. Database Models and Migrations
    if git diff --cached --name-only | grep -q "models\|migrations"; then
        print_status "Committing database models..."
        git commit -m "feat: database models and relationships

- User, Student, Lecturer, Program models
- Course, ClassSection, Enrollment models
- Assessment, Grade, Attendance models
- Finance models (FeeStructure, Invoice, Payment)
- Library models (LibraryItem, Loan)
- Research and Project models
- Notification and AuditLog models
- Proper foreign key relationships
- Sequelize migrations setup"
    fi
    
    # 5. API Endpoints
    if git diff --cached --name-only | grep -q "routes\|controllers"; then
        print_status "Committing API endpoints..."
        git commit -m "feat: RESTful API endpoints

- Authentication endpoints (login, register, logout)
- User management endpoints
- Student information system endpoints
- Course and timetable management
- Academic administration endpoints
- Finance management endpoints
- Library management endpoints
- Research and project endpoints
- Notification system endpoints
- Comprehensive error handling"
    fi
    
    # 6. Frontend Components and Pages
    if git diff --cached --name-only | grep -q "components\|pages"; then
        print_status "Committing frontend components..."
        git commit -m "feat: frontend components and pages

- Main layout with responsive design
- Top navigation bar with user menu
- Collapsible sidebar navigation
- Role-based dashboard components
- Login and registration pages
- Error pages (404, access denied)
- Reusable UI components
- Form components with validation
- Loading states and animations"
    fi
    
    # 7. Configuration and Documentation
    if git diff --cached --name-only | grep -q "config\|docs\|README"; then
        print_status "Committing configuration and docs..."
        git commit -m "docs: project configuration and documentation

- Environment configuration files
- Docker Compose setup
- Makefile for development commands
- README with setup instructions
- API documentation structure
- Database ERD and schema
- Development and deployment guides"
    fi
    
    # 8. Testing and Quality Assurance
    if git diff --cached --name-only | grep -q "test\|spec"; then
        print_status "Committing testing setup..."
        git commit -m "test: testing framework and initial tests

- Vitest testing framework setup
- Supertest for API testing
- Authentication tests
- Database integration tests
- Frontend component tests
- Test utilities and helpers
- CI/CD pipeline configuration"
    fi
    
    # 9. Styling and UI/UX
    if git diff --cached --name-only | grep -q "css\|tailwind\|styles"; then
        print_status "Committing styling and UI improvements..."
        git commit -m "style: UI/UX improvements and styling

- Tailwind CSS configuration with custom theme
- Dark and light mode support
- Responsive design implementation
- Custom animations and transitions
- Component styling consistency
- Accessibility improvements
- Mobile-first design approach"
    fi
    
    # 10. Bug Fixes and Improvements
    if git diff --cached --name-only | grep -q "fix"; then
        print_status "Committing bug fixes..."
        git commit -m "fix: bug fixes and improvements

- Resolved Tailwind CSS configuration issues
- Fixed React Query v5 compatibility
- Corrected database model associations
- Fixed authentication flow issues
- Improved error handling
- Performance optimizations
- Code quality improvements"
    fi
    
    print_success "All features committed successfully!"
}

# Function to show commit history
show_commit_history() {
    print_status "Recent commit history:"
    git log --oneline -10
    echo ""
}

# Function to push changes
push_changes() {
    print_status "Pushing changes to remote repository..."
    git push origin main
    print_success "Changes pushed successfully!"
}

# Main menu
show_menu() {
    echo ""
    echo "=========================================="
    echo "  IMTR School Management System"
    echo "  Git Commit Management Tool"
    echo "=========================================="
    echo ""
    echo "1. Check git status"
    echo "2. Show staged changes"
    echo "3. Commit specific feature"
    echo "4. Commit all features (recommended)"
    echo "5. Show commit history"
    echo "6. Push changes"
    echo "7. Exit"
    echo ""
}

# Main execution
main() {
    case "$1" in
        "status")
            check_git_status
            ;;
        "staged")
            show_staged_changes
            ;;
        "commit")
            if [ $# -eq 4 ]; then
                commit_feature "$2" "$3" "$4"
            else
                print_error "Usage: $0 commit <feature_name> <description> <type>"
            fi
            ;;
        "commit-all")
            commit_all_features
            ;;
        "history")
            show_commit_history
            ;;
        "push")
            push_changes
            ;;
        "menu"|"")
            show_menu
            ;;
        *)
            print_error "Unknown command: $1"
            show_menu
            ;;
    esac
}

# Run main function with all arguments
main "$@"
