# Git Workflow for IMTR School Management System

This document outlines the git workflow and commit conventions for the IMTR School Management System project.

## Quick Start

### 1. Check Current Status
```bash
./git-commit.sh status
```

### 2. Commit All Features (Recommended)
```bash
./git-commit.sh commit-all
```

### 3. Push Changes
```bash
./git-commit.sh push
```

## Available Scripts

### Main Git Commit Script (`git-commit.sh`)

The main script provides a comprehensive workflow for managing commits:

```bash
# Show menu
./git-commit.sh

# Check git status
./git-commit.sh status

# Show staged changes
./git-commit.sh staged

# Commit all features (recommended)
./git-commit.sh commit-all

# Show commit history
./git-commit.sh history

# Push changes
./git-commit.sh push
```

### Feature-Specific Commit Script (`commit-feature.sh`)

For committing individual features:

```bash
# Usage
./commit-feature.sh <feature_name> <description> <type>

# Examples
./commit-feature.sh "user authentication" "implement JWT login system" feat
./commit-feature.sh "database models" "add student and course models" feat
./commit-feature.sh "tailwind config" "fix unknown utility class errors" fix
```

## Commit Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: user authentication - implement JWT login system` |
| `fix` | Bug fix | `fix: tailwind config - resolve unknown utility class errors` |
| `docs` | Documentation | `docs: README - add setup instructions` |
| `style` | Code style changes | `style: formatting - apply prettier rules` |
| `refactor` | Code refactoring | `refactor: auth middleware - improve error handling` |
| `test` | Adding tests | `test: auth - add unit tests for login` |
| `chore` | Maintenance tasks | `chore: dependencies - update package versions` |

## Feature Commit Order

The `commit-all` command commits features in a logical order:

1. **Backend Core Infrastructure** - Server setup, database, middleware
2. **Frontend Core Infrastructure** - Next.js, Tailwind, React Query
3. **Authentication System** - JWT, RBAC, login/register
4. **Database Models** - Sequelize models and relationships
5. **API Endpoints** - RESTful API routes and controllers
6. **Frontend Components** - React components and pages
7. **Configuration** - Environment configs, Docker, docs
8. **Testing** - Test framework and initial tests
9. **Styling** - UI/UX improvements and theming
10. **Bug Fixes** - Fixes and improvements

## Git Ignore

The `.gitignore` file excludes:
- `node_modules/` - Dependencies
- `.next/`, `dist/`, `build/` - Build outputs
- `.env*` - Environment variables
- `*.log` - Log files
- `.DS_Store`, `Thumbs.db` - OS files
- `*.sqlite`, `*.db` - Database files
- `coverage/` - Test coverage

## Best Practices

### 1. Always Check Status First
```bash
./git-commit.sh status
```

### 2. Use Descriptive Commit Messages
- Start with type: `feat:`, `fix:`, `docs:`, etc.
- Include feature name and description
- Be specific about what changed

### 3. Commit Related Changes Together
- Don't mix unrelated features in one commit
- Use the feature-specific script for individual commits

### 4. Test Before Committing
- Ensure all tests pass
- Check for linting errors
- Verify functionality works

### 5. Use Conventional Commits
- Follow the conventional commit format
- Use the provided scripts for consistency

## Example Workflow

```bash
# 1. Check what needs to be committed
./git-commit.sh status

# 2. Review staged changes
./git-commit.sh staged

# 3. Commit all features (recommended for initial setup)
./git-commit.sh commit-all

# 4. Check commit history
./git-commit.sh history

# 5. Push to remote
./git-commit.sh push
```

## Troubleshooting

### No Changes to Commit
If you see "No changes to commit":
1. Check if files are staged: `git status`
2. Add files: `git add .`
3. Try again: `./git-commit.sh commit-all`

### Merge Conflicts
1. Resolve conflicts in your editor
2. Stage resolved files: `git add .`
3. Continue with commit: `./git-commit.sh commit-all`

### Push Errors
1. Check remote repository access
2. Ensure you have push permissions
3. Try: `git push origin main`

## Project Structure

```
IMTR School Management System/
├── .gitignore                 # Git ignore rules
├── git-commit.sh             # Main commit script
├── commit-feature.sh         # Feature-specific commit script
├── GIT_WORKFLOW.md           # This documentation
├── backend/                  # Backend API
│   ├── src/
│   ├── package.json
│   └── ...
├── frontend/                 # Frontend React app
│   ├── app/
│   ├── package.json
│   └── ...
├── docs/                     # Documentation
├── nginx/                    # Nginx configuration
└── docker-compose.yml        # Docker setup
```

## Support

For questions about the git workflow:
1. Check this documentation
2. Review the script comments
3. Check git status and staged changes
4. Use the interactive menu: `./git-commit.sh`
