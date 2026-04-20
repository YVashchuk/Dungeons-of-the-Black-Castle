#!/bin/bash
# Simple GitHub CLI version — fastest if you have `gh` installed
# Prerequisites: https://cli.github.com then `gh auth login`

set -e

cd "$(dirname "$0")/.."

if ! command -v gh &> /dev/null; then
  echo "❌ GitHub CLI не установлен."
  echo "   Скачайте: https://cli.github.com"
  echo "   Альтернатива: bash scripts/init_and_push.sh"
  exit 1
fi

# Check auth
if ! gh auth status &> /dev/null; then
  echo "⚠ Не авторизованы. Запускаю gh auth login..."
  gh auth login
fi

# Init git if needed
if [ ! -d ".git" ]; then
  git init
  git branch -M main
fi

# Set remote
REPO_URL="https://github.com/YVashchuk/Dungeons-of-the-Black-Castle.git"
if ! git remote | grep -q "^origin$"; then
  git remote add origin "$REPO_URL"
fi

# Commit and push
git add .
git commit -m "${1:-Initial commit}" || echo "Nothing to commit"
git push -u origin main

echo "✅ Done! https://github.com/YVashchuk/Dungeons-of-the-Black-Castle"
