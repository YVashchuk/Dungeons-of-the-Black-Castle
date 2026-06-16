# 🚀 QUICKSTART — Загрузка проекта на GitHub

## Что вам нужно

1. **Git установлен** — проверьте: `git --version`
   - Нет? Скачайте: https://git-scm.com/download/win
2. **Авторизация на GitHub** — один из вариантов:
   - ✅ **GitHub CLI** (проще всего): https://cli.github.com — затем `gh auth login`
   - ⚙️ **Personal Access Token**: https://github.com/settings/tokens (scopes: `repo`)
   - 🔑 **SSH ключ**: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

## Первая загрузка (один раз)

### Шаг 1: Распакуйте ZIP в папку
Например: `C:\Projects\dungeons-of-black-castle\`

### Шаг 2: Откройте Git Bash в этой папке
- В проводнике Windows: правой кнопкой → **Git Bash Here**
- ИЛИ: откройте Git Bash и `cd /c/Projects/dungeons-of-black-castle/`

### Шаг 3: Запустите скрипт
```bash
bash scripts/init_and_push.sh
```

Скрипт сам:
- Инициализирует git
- Добавит remote origin (ваш приватный репозиторий)
- Создаст первый коммит
- Запушит на GitHub

### Альтернатива для Windows без Git Bash:
Двойной клик по `scripts/init_and_push.bat`

---

## Обновления (каждый раз когда Claude выдаёт новую версию)

### 1. Скачайте новые файлы от Claude
Положите их в соответствующие папки:
- Основной HTML игры → `dist/`
- Обновлённые исходники → `src/`
- Обновлённые промпты/доки → `docs/`

### 2. Запустите update скрипт
```bash
bash scripts/update_and_push.sh "что изменилось"
```

Например:
```bash
bash scripts/update_and_push.sh "Fix map rendering and combat end bug"
```

---

## Если возникла ошибка

### "Permission denied (publickey)"
Не настроен SSH. Решение: используйте HTTPS + Personal Access Token.
Repo URL в `scripts/init_and_push.sh` уже настроен на HTTPS.

### "failed to push some refs"
На GitHub уже что-то закоммичено (например, README). Решение:
```bash
git pull origin main --rebase
git push origin main
```

### "Authentication failed"
- Запустите: `gh auth login` (если есть GitHub CLI)
- ИЛИ: создайте Personal Access Token на https://github.com/settings/tokens
  При запросе пароля введите токен вместо пароля

### "fatal: not a git repository"
Вы не в той папке. `cd` в папку с этим README и повторите.

---

## Структура проекта

```
📁 dungeons-of-black-castle/
├── 📄 README.md
├── 📄 LICENSE  
├── 📄 .gitignore
├── 📄 build.sh               # Пересобрать dist/ из src/
├── 📁 dist/                  # 🎮 Игровой HTML (готов к запуску)
├── 📁 src/                   # Исходники (собираются в dist/)
├── 📁 docs/                  # Документация, промпты, аудит
├── 📁 assets/                # Исходные ресурсы
└── 📁 scripts/               # Скрипты пуша
```

---

## Как поделиться игрой через GitHub

Приватный репо → GitHub Pages не работает для приватных.

**Варианты:**
1. Скачать `dist/podzemelye-chyornogo-zamka-remake.html` и отправить файлом
2. Сделать репо публичным — тогда работает raw URL:
   ```
   https://raw.githubusercontent.com/YVashchuk/Dungeons-of-the-Black-Castle/main/dist/podzemelye-chyornogo-zamka-remake.html
   ```
3. Использовать GitHub Pages (нужен публичный репо):
   ```
   https://yvashchuk.github.io/Dungeons-of-the-Black-Castle/dist/podzemelye-chyornogo-zamka-remake.html
   ```

---

**Удачи!** 🏰⚔️
