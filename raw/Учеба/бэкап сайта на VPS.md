Ниже — практическое руководство, как сделать бэкап сайта на VPS с помощью `rsync`, с учётом твоих задач (автоматизация, работа с VPS, безопасность).

---

## Что именно бэкапить для сайта

Для типичного сайта на Linux VPS нужно 3 компонента:

1. **Файлы сайта** (HTML, PHP, медиа, конфиги CMS) — обычно `/var/www/html`, `/srv/www`, или папка в `~/site`.
2. **Конфиги веб‑сервера** — `/etc/nginx`, `/etc/apache2`, виртуальные хосты.
3. **База данных** — `rsync` для БД **не подходит**, нужен дамп (`mysqldump`, `pg_dump` и т. п.).

> Важный момент: ты раньше делал скрипты автоматизации и работал с VPS — тут логика та же: сначала делаем дамп БД, потом копируем файлы.

---

## Подготовка

### 1. Папки и права

bash

ПереноситьСвернутьКопировать

```bash
sudo mkdir -p /backups/site
sudo chown $USER:$USER /backups/site
```

### 2. SSH‑ключи (без паролей)

Ты уже интересовался генерацией SSH‑ключа на Windows — на VPS это пригодится для автоматического бэкапа на удалённый сервер:

bash

ПереноситьСвернутьКопировать

```bash
ssh-keygen -t ed25519 -f ~/.ssh/backup_key
ssh-copy-id -i ~/.ssh/backup_key.pub user@remote-backup-server
```

В `rsync` потом укажем `-e "ssh -i ~/.ssh/backup_key"`.

### 3. Файл исключений

Создай `/backups/exclude.txt` и добавь туда временные данные, чтобы не тратить место и время:

text

ПереноситьСвернутьКопировать

```text
/var/www/html/cache/
/var/www/html/tmp/
*.log
*.tmp
.git
node_modules
vendor
```

---

## Вариант 1: Локальный бэкап на том же VPS

Подходит, если есть отдельный диск/раздел или достаточно места.

**Команда:**

bash

ПереноситьСвернутьКопировать

```bash
rsync -avzh --progress --exclude-from=/backups/exclude.txt /var/www/html/ /backups/site/www/
rsync -avzh --progress /etc/nginx/ /backups/site/nginx/
```

- `-a` — архивный режим (права, даты, рекурсия).
- `-v` — подробный вывод, `-h` — читаемые размеры, `-z` — сжатие при передаче.
- `--exclude-from` — список исключений.

> Обрати внимание на слэш в конце `/var/www/html/` — он означает «содержимое папки», а не саму папку. Это важно для структуры бэкапа.

---

## Вариант 2: Бэкап на удалённый сервер (надёжнее)

Если есть отдельный сервер/VPS для бэкапов:

bash

ПереноситьСвернутьКопировать

```bash
rsync -avzh --progress \
  --exclude-from=/backups/exclude.txt \
  -e "ssh -i ~/.ssh/backup_key" \
  /var/www/html/ \
  user@backup-server:/backups/site/www/

rsync -avzh --progress \
  -e "ssh -i ~/.ssh/backup_key" \
  /etc/nginx/ \
  user@backup-server:/backups/site/nginx/
```

---

## Бэкап базы данных (обязательно)

Пример для MySQL/MariaDB:

bash

ПереноситьСвернутьКопировать

```bash
mysqldump -u root -pPASSWORD --single-transaction --all-databases > /backups/site/db/all.sql
```

Потом этот дамп тоже синхронизируй через `rsync`:

bash

ПереноситьСвернутьКопировать

```bash
rsync -avzh --progress -e "ssh -i ~/.ssh/backup_key" /backups/site/db/ user@backup-server:/backups/site/db/
```

Для PostgreSQL:

bash

ПереноситьСвернутьКопировать

```bash
pg_dumpall -U postgres > /backups/site/db/all.sql
```

---

## Автоматизация через скрипт (под твои задачи)

Учитывая, что ты писал скрипты для проверки метрик и синхронизации, вот готовый шаблон:

bash

ПереноситьСвернутьКопировать

```bash
#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/backups/site"
WWW_SRC="/var/www/html"
NGINX_SRC="/etc/nginx"
DB_DUMP="$BACKUP_DIR/db/all.sql"
REMOTE_USER="user"
REMOTE_HOST="backup-server"
SSH_KEY="~/.ssh/backup_key"

mkdir -p "$BACKUP_DIR"/{www,nginx,db}

# Дамп БД
echo "Dump DB..."
mysqldump -u root -pYOUR_PASSWORD --single-transaction --all-databases > "$DB_DUMP"

# Синхронизация файлов
echo "Sync WWW..."
rsync -avzh --progress --exclude-from=/backups/exclude.txt "$WWW_SRC/" "$BACKUP_DIR/www/"

echo "Sync Nginx..."
rsync -avzh --progress "$NGINX_SRC/" "$BACKUP_DIR/nginx/"

# Отправка на удалённый сервер
echo "Send to remote..."
rsync -avzh --progress -e "ssh -i $SSH_KEY" "$BACKUP_DIR/" "$REMOTE_USER@$REMOTE_HOST:/backups/site/"

echo "Backup complete."
```

Сохрани как `/usr/local/bin/backup-site.sh`, сделай исполняемым:

bash

ПереноситьСвернутьКопировать

```bash
chmod +x /usr/local/bin/backup-site.sh
```

---

## Расписание через cron

Чтобы запускать каждый день в 03:00:

bash

ПереноситьСвернутьКопировать

```bash
crontab -e
```

Добавь строку:

text

ПереноситьСвернутьКопировать

```text
0 3 * * * /usr/local/bin/backup-site.sh >> /var/log/backup.log 2>&1
```

Логи помогут диагностировать проблемы — это перекликается с твоей задачей по диагностике производительности VPS.

---

## Продвинутый вариант: инкрементные бэкапы с жёсткими ссылками

Если места мало, но нужно хранить несколько версий, используй `--link-dest`. Идея: каждый новый бэкап хранит только изменения, остальное — через жёсткие ссылки.

Пример структуры:

- `/backups/daily.0` — текущий
- `/backups/daily.1` — вчерашний
- и т. д.

Команда:

bash

ПереноситьСвернутьКопировать

```bash
rsync -avzh \
  --link-dest=/backups/daily.1 \
  --exclude-from=/backups/exclude.txt \
  /var/www/html/ \
  /backups/daily.0/
```

Перед этим нужно сделать ротацию: сдвинуть `daily.0 → daily.1`, удалить самый старый. Это можно добавить в тот же скрипт.

---

## Безопасность и проверка

- **Не храни пароли в скрипте.** Для БД лучше использовать файл учётных данных (`~/.my.cnf` с правами `600`).
- **Права на папку бэкапов:** `chmod 700 /backups` или `chmod 750` + отдельный пользователь.
- **Проверка восстановления:** раз в месяц пробуй восстановить файлы и БД на тестовом сервере/контейнере и проверить, что сайт открывается. Без теста бэкап бесполезен.

---

## Частые ошибки и как их избежать

- **Путаница со слэшем** в конце пути: `/src/` vs `/src` — меняет смысл.
- **`--delete` без `--dry-run`**: можно случайно удалить файлы на приёмнике. Сначала тестируй с `-n`.
- **Бэкап «живой» БД через rsync**: почти всегда приводит к повреждённым данным. Только дамп.
- **Хранение бэкапов на том же диске/VPS**: при поломке диска теряются и сайт, и бэкап. Лучше иметь удалённую копию.

---

## Как это связано с твоими предыдущими задачами

- Ты делал скрипты автоматизации — этот скрипт легко встроить в ту же экосистему.
- Ты работал с Obsidian и синхронизацией — логика похожая: источник → приёмник, исключения, проверка.
- Ты настраивал VPS и диагностировал производительность — здесь важно не забивать канал: используй `--bwlimit` при больших передачах.
- Ты интересовался SSH‑ключами — они нужны для безопасного и автоматического `rsync`.

---

Если скажешь, какой у тебя стек (WordPress, Laravel, чистый PHP, Node.js и т. п.) и где хочешь хранить бэкапы (локально на VPS, на другом сервере, в S3/Yandex Object Storage), я дам точный скрипт под твой случай и пример восстановления.