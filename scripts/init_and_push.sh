#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Скрипт первоначальной загрузки проекта на GitHub
# ═══════════════════════════════════════════════════════════════
#
# ИСПОЛЬЗОВАНИЕ:
#   1. Распакуйте этот архив в пустую папку
#   2. Откройте терминал (Git Bash на Windows)
#   3. cd в эту папку
#   4. bash scripts/init_and_push.sh
#
# ПРЕДПОСЫЛКИ:
#   - Установлен git (https://git-scm.com)
#   - Настроен git user.name и user.email
#   - Для приватного репо: настроен GitHub CLI (gh auth login)
#     ИЛИ SSH ключ, ИЛИ Personal Access Token
#
# ═══════════════════════════════════════════════════════════════

set -e  # Остановка при ошибке

GITHUB_REPO="https://github.com/YVashchuk/Dungeons-of-the-Black-Castle.git"
BRANCH_NAME="main"

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║  🏰 Dungeons of the Black Castle — GitHub Push  ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# Проверки
if ! command -v git &> /dev/null; then
  echo "❌ Git не установлен. Скачайте с https://git-scm.com"
  exit 1
fi

if [ -z "$(git config user.name)" ] || [ -z "$(git config user.email)" ]; then
  echo "⚠ Git user не настроен. Настраиваю сейчас..."
  read -p "Ваше имя (для коммитов): " USER_NAME
  read -p "Ваш email: " USER_EMAIL
  git config --global user.name "$USER_NAME"
  git config --global user.email "$USER_EMAIL"
  echo "✅ Git настроен: $USER_NAME <$USER_EMAIL>"
fi

# Проверка структуры
echo "📁 Проверка структуры папок..."
for dir in src dist data docs assets; do
  if [ ! -d "$dir" ]; then
    echo "❌ Папка $dir отсутствует!"
    exit 1
  fi
done
echo "✅ Структура корректна"

# Инициализация git если нужно
if [ ! -d ".git" ]; then
  echo "🔧 Инициализация git репозитория..."
  git init
  git branch -M "$BRANCH_NAME"
else
  echo "✅ Git репозиторий уже инициализирован"
fi

# Проверка remote
if ! git remote | grep -q "^origin$"; then
  echo "🔗 Добавление remote origin..."
  git remote add origin "$GITHUB_REPO"
else
  echo "🔄 Обновление remote origin..."
  git remote set-url origin "$GITHUB_REPO"
fi
echo "   Remote: $(git remote get-url origin)"

# Добавление файлов
echo ""
echo "📦 Добавление файлов..."
git add .

# Показать что добавлено
STAGED_COUNT=$(git diff --cached --name-only | wc -l)
echo "   Файлов подготовлено: $STAGED_COUNT"

# Показать статус
echo ""
echo "📋 Статус:"
git status --short

echo ""
read -p "➡ Продолжить и сделать коммит? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ]; then
  echo "❌ Отменено"
  exit 0
fi

# Коммит
COMMIT_MSG="${1:-Initial commit: complete game with map, illustrations, and canon pass}"
echo ""
echo "💾 Создание коммита..."
git commit -m "$COMMIT_MSG" || {
  echo "⚠ Нечего коммитить (или уже закоммичено)"
}

# Push
echo ""
echo "🚀 Отправка на GitHub..."
echo "   Приватный репо может запросить авторизацию:"
echo "   - GitHub CLI: выполните 'gh auth login' заранее"
echo "   - Или используйте Personal Access Token как пароль"
echo "   - Или SSH ключ"
echo ""

git push -u origin "$BRANCH_NAME" || {
  echo ""
  echo "❌ Push не удался. Возможные причины:"
  echo ""
  echo "  1️⃣ Нет авторизации. Варианты:"
  echo "     → Установите GitHub CLI: https://cli.github.com"
  echo "       Затем: gh auth login"
  echo ""
  echo "     → ИЛИ создайте Personal Access Token:"
  echo "       https://github.com/settings/tokens"
  echo "       Scopes: repo"
  echo "       Используйте токен вместо пароля при запросе"
  echo ""
  echo "  2️⃣ Remote branch отличается от локальной:"
  echo "     git pull origin $BRANCH_NAME --rebase"
  echo "     git push -u origin $BRANCH_NAME"
  echo ""
  echo "  3️⃣ Конфликт имен ветки (например, 'master' вместо 'main'):"
  echo "     Проверьте название ветки на GitHub и измените BRANCH_NAME"
  echo ""
  exit 1
}

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║          ✅ УСПЕШНО ЗАГРУЖЕНО НА GITHUB         ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "🌐 Ваш репозиторий:"
echo "   https://github.com/YVashchuk/Dungeons-of-the-Black-Castle"
echo ""
echo "🎮 Чтобы поделиться игрой — отправьте ссылку на raw-файл:"
echo "   https://raw.githubusercontent.com/YVashchuk/Dungeons-of-the-Black-Castle/main/dist/podzemelye-chyornogo-zamka-remake.html"
echo ""
