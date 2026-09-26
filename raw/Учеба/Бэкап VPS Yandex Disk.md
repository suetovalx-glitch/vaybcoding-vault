Для бэкапа с VPS на Яндекс Диск лучше всего использовать связку **rclone** (для работы с облаком) + простой bash‑скрипт (для архивации и логики). Это надёжнее, чем монтировать Диск как диск, и проще в поддержке.

---

## Подготовка

1. **Установите rclone** на VPS:
    
    bash
    
    ```bash
    curl https://rclone.org/install.sh | sudo bash
    ```
    
2. **Настройте подключение к Яндекс Диску**:
    
    bash
    
    ```bash
    rclone config
    ```
    
    В мастере:
    
    - Выберите тип хранилища: `Yandex Disk`.
    - При запросе авторизации откроется браузер (если на VPS нет GUI — используйте `rclone authorize "yandex"` на машине с браузером, скопируйте токен в консоль VPS).
    - Дайте имя удалённому хранилищу, например `yandex_disk`.
3. **Проверьте подключение**:
    
    bash
    
    ```bash
    rclone lsd yandex_disk:
    ```
    
    Если видите список папок — всё готово.
    
4. **Создайте папку на Диске** для бэкапов (опционально):
    
    bash
    
    ```bash
    rclone mkdir yandex_disk:vps_backup
    ```
    

---

## Скрипт бэкапа

Создайте файл `/root/backup_to_yandex.sh`:

bash

```bash
#!/usr/bin/env bash
set -euo pipefail

# --- НАСТРОЙКИ ---
REMOTE="yandex_disk:vps_backup"          # имя remote + путь на Диске
BACKUP_DIR="/var/backup"                 # локальная папка для временных архивов
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
ARCHIVE_NAME="vps_full_${DATE}.tar.gz"
ARCHIVE_PATH="${BACKUP_DIR}/${ARCHIVE_NAME}"

# Папки, которые нужно забэкапить (можно добавить/убрать)
FOLDERS=(
  "/etc"
  "/var/www"
  "/home"
  # "/var/lib/mysql"  # если нужна база — лучше использовать mysqldump отдельно
)

# Сколько копий хранить на Диске (оставляем N последних по дате)
KEEP_COUNT=7

# --- ПОДГОТОВКА ---
mkdir -p "$BACKUP_DIR"

# --- АРХИВАЦИЯ ---
# tar cfz с исключением временных файлов и кэшей, чтобы уменьшить размер
tar --exclude='*/cache/*' \
    --exclude='*/tmp/*' \
    --exclude='*/node_modules/*' \
    --exclude='*/.git/*' \
    -czf "$ARCHIVE_PATH" "${FOLDERS[@]}"

# --- ЗАГРУЗКА НА ЯНДЕКС ДИСК ---
rclone copy "$ARCHIVE_PATH" "$REMOTE" \
  --bwlimit=8M \
  --log-file="/var/log/rclone-backup.log" \
  --log-level INFO

# --- ОЧИСТКА СТАРЫХ КОПИЙ НА ДИСКЕ ---
# Получаем список файлов, сортируем по времени (новые первыми), оставляем KEEP_COUNT
FILES=$(rclone lsf "$REMOTE" --files-only --format "tp" | sort -k1 -nr | tail -n +$((KEEP_COUNT + 1)))

while IFS= read -r line; do
  FILE_NAME=$(echo "$line" | awk '{print $2}')
  if [[ -n "$FILE_NAME" ]]; then
    rclone deletefile "$REMOTE/$FILE_NAME"
  fi
done <<< "$FILES"

# --- УБОРКА ЛОКАЛЬНО ---
rm -f "$ARCHIVE_PATH"

echo "Backup completed: $ARCHIVE_NAME"
```

Дайте права и проверьте запуск вручную:

bash

```bash
chmod +x /root/backup_to_yandex.sh
bash /root/backup_to_yandex.sh
```

Убедитесь, что архив появился на Яндекс Диске и старые копии удаляются.

---

## Автоматизация через cron

Откройте crontab:

bash

```bash
crontab -e
```

Добавьте строку для ежедневного бэкапа в 03:00:

text

```text
0 3 * * * /root/backup_to_yandex.sh >> /var/log/backup_cron.log 2>&1
```

Логи будут в `/var/log/backup_cron.log` и `/var/log/rclone-backup.log`.

---

## Важные нюансы и безопасность

- **Не храните пароли в скрипте.** Rclone хранит токены в `~/.config/rclone/rclone.conf` — этого достаточно.
- **Размер и скорость.** Параметр `--bwlimit=8M` ограничивает скорость, чтобы не забивать канал. Можно убрать или изменить.
- **Исключения.** В `tar` уже добавлены типичные исключения (`cache`, `tmp`, `node_modules`, `.git`). Добавьте свои, если нужно.
- **Базы данных.** Для БД (MySQL/PostgreSQL) лучше делать дамп отдельным шагом и класть его в архив или отдельным файлом — так проще восстанавливать.
- **Проверка восстановления.** Обязательно один раз скачайте архив с Диска, распакуйте и убедитесь, что структура корректна.

---

## Альтернатива: rsync + rclone

Если вы уже привыкли к `rsync` (вы упоминали изучение rsync), можно сначала сделать инкрементальный бэкап на локальный диск/другой сервер через `rsync`, а затем копировать готовые архивы на Яндекс Диск через `rclone copy` — это удобно для разделения этапов «создание» и «репликация в облако».

---

Учитывая, что вы ранее интересовались мониторингом метрик на VPS и автоматизацией, такой скрипт можно дополнительно оснастить отправкой статуса (OK/FAIL) в Telegram (по `TG_CHAT_ID`) или в лог-систему — скажите, если нужен вариант с уведомлениями.