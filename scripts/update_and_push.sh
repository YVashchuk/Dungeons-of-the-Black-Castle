#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Скрипт для последующих обновлений проекта на GitHub
# ═══════════════════════════════════════════════════════════════
#
# Использовать когда нужно запушить изменения в уже существующий репозиторий.
# Автоматически:
#   1. Пересобирает dist/ из src/
#   2. Показывает что изменилось
#   3. Предлагает ввести сообщение коммита
#   4. Коммитит и пушит
#
# Использование:
#   bash scripts/update_and_push.sh "сообщение коммита"
#   или просто: bash scripts/update_and_push.sh  (спросит сообщение)

set -e

cd "$(dirname "$0")/.."

echo "╔══════════════════════════════════════════════════╗"
echo "║    🔄 Обновление Dungeons of the Black Castle   ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# Пересобрать dist
if [ -f "build.sh" ]; then
  echo "🔨 Пересборка dist/..."
  bash build.sh
  echo ""
fi

# Показать изменения
echo "📋 Изменения:"
git status --short
echo ""

# Считаем измененные файлы
CHANGED=$(git status --short | wc -l)
if [ "$CHANGED" -eq 0 ]; then
  echo "ℹ Нет изменений для коммита"
  exit 0
fi

# Сообщение коммита
if [ -n "$1" ]; then
  MSG="$1"
else
  read -p "💬 Сообщение коммита: " MSG
  if [ -z "$MSG" ]; then
    echo "❌ Пустое сообщение. Отмена."
    exit 1
  fi
fi

# Add, commit, push
git add .
git commit -m "$MSG"

echo ""
echo "🚀 Push на GitHub..."
git push origin "$(git rev-parse --abbrev-ref HEAD)"

echo ""
echo "✅ Готово!"
echo "🌐 https://github.com/YVashchuk/Dungeons-of-the-Black-Castle"
