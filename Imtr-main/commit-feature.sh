#!/bin/bash

# Feature-specific commit script
# Usage: ./commit-feature.sh <feature_name> <description> <type>

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

FEATURE_NAME="$1"
DESCRIPTION="$2"
COMMIT_TYPE="$3"

if [ -z "$FEATURE_NAME" ] || [ -z "$DESCRIPTION" ] || [ -z "$COMMIT_TYPE" ]; then
    echo -e "${RED}Usage: ./commit-feature.sh <feature_name> <description> <type>${NC}"
    echo ""
    echo "Types:"
    echo "  feat     - New feature"
    echo "  fix      - Bug fix"
    echo "  docs     - Documentation"
    echo "  style    - Code style changes"
    echo "  refactor - Code refactoring"
    echo "  test     - Adding tests"
    echo "  chore    - Maintenance tasks"
    echo ""
    echo "Examples:"
    echo "  ./commit-feature.sh 'user authentication' 'implement JWT login system' feat"
    echo "  ./commit-feature.sh 'database models' 'add student and course models' feat"
    echo "  ./commit-feature.sh 'tailwind config' 'fix unknown utility class errors' fix"
    exit 1
fi

echo -e "${BLUE}Committing feature: $FEATURE_NAME${NC}"
echo -e "${BLUE}Description: $DESCRIPTION${NC}"
echo -e "${BLUE}Type: $COMMIT_TYPE${NC}"
echo ""

# Check git status
echo "Checking git status..."
git status --porcelain

echo ""
echo "Staged changes:"
git diff --cached --name-only

echo ""
read -p "Proceed with commit? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    COMMIT_MESSAGE="${COMMIT_TYPE}: ${FEATURE_NAME} - ${DESCRIPTION}"
    git commit -m "$COMMIT_MESSAGE"
    echo -e "${GREEN}Feature committed successfully!${NC}"
    echo -e "${GREEN}Commit message: $COMMIT_MESSAGE${NC}"
else
    echo "Commit cancelled."
fi
