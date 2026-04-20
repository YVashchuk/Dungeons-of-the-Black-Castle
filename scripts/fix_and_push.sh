#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Скрипт исправления: слияние с удалённым репозиторием
# ═══════════════════════════════════════════════════════════════
# 
# Используйте когда на GitHub уже есть файлы (README, LICENSE),
# а локально уже сделан коммит — истории разошлись.
#
# Скрипт делает:
#   1. Скачивает удалённые файлы
#   2. Объединяет с локальными (rebase + allow-unrelated)
#   3. Запушивает результат
#
# ═══════════════════════════════════════════════════════════════

set -e

cd "$(dirname "$0")/.."

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║       🔧 Исправление: слияние с GitHub          ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📍 Текущая ветка: $BRANCH"
echo ""

# Проверяем какая ветка на удалённом
echo "🔍 Проверка удалённых веток..."
git fetch origin 2>&1 || {
  echo "❌ Не могу подключиться к GitHub. Проверьте авторизацию."
  exit 1
}

REMOTE_BRANCHES=$(git branch -r | sed 's/origin\///' | tr -d ' ')
echo "   Удалённые ветки:"
echo "$REMOTE_BRANCHES" | sed 's/^/     /'
echo ""

# Есть ли нужная ветка на удалённом
if echo "$REMOTE_BRANCHES" | grep -q "^$BRANCH$"; then
  REMOTE_EXISTS=1
else
  REMOTE_EXISTS=0
fi

if [ "$REMOTE_EXISTS" -eq 1 ]; then
  echo "⚠ На удалённом уже есть ветка '$BRANCH'. Нужно объединить."
  echo ""
  echo "Выберите вариант:"
  echo ""
  echo "  1) 🔀 MERGE: слить удалённые файлы с локальными (безопасно, рекомендуется)"
  echo "     Останутся все файлы — и ваши локальные, и те что на GitHub"
  echo ""
  echo "  2) ⚠ FORCE: перезаписать удалённое своим локальным (ОПАСНО)"
  echo "     Удалит всё что есть на GitHub, заменит вашим локальным"
  echo ""
  read -p "Выбор (1/2): " CHOICE
  
  if [ "$CHOICE" = "1" ]; then
    echo ""
    echo "🔀 Слияние..."
    git pull origin "$BRANCH" --rebase --allow-unrelated-histories || {
      echo ""
      echo "⚠ Конфликты при слиянии. Решение:"
      echo "   Вариант А: Откажитесь от удалённых и сделайте force push:"
      echo "     git rebase --abort"
      echo "     bash scripts/fix_and_push.sh  (выберите вариант 2)"
      echo ""
      echo "   Вариант Б: Решите конфликты вручную и продолжите:"
      echo "     git status                    # посмотреть конфликтные файлы"
      echo "     (отредактируйте файлы)"
      echo "     git add <файл>"
      echo "     git rebase --continue"
      exit 1
    }
    echo "✅ Слияние успешно"
    
  elif [ "$CHOICE" = "2" ]; then
    echo ""
    echo "⚠⚠⚠ ВНИМАНИЕ ⚠⚠⚠"
    echo "Вы собираетесь перезаписать удалённое содержимое репозитория."
    echo "Все файлы на GitHub будут заменены на ваши локальные."
    echo ""
    read -p "Введите 'DELETE' для подтверждения: " CONFIRM
    if [ "$CONFIRM" != "DELETE" ]; then
      echo "❌ Отменено"
      exit 0
    fi
    
    echo "🚀 Force push..."
    git push origin "$BRANCH" --force
    echo "✅ Force push выполнен"
    echo ""
    echo "🌐 https://github.com/YVashchuk/Dungeons-of-the-Black-Castle"
    exit 0
    
  else
    echo "❌ Неверный выбор"
    exit 1
  fi
fi

# Push
echo ""
echo "🚀 Отправка на GitHub..."
git push -u origin "$BRANCH" || {
  echo "❌ Push не удался"
  exit 1
}

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║          ✅ УСПЕШНО ЗАГРУЖЕНО НА GITHUB         ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "🌐 https://github.com/YVashchuk/Dungeons-of-the-Black-Castle"
