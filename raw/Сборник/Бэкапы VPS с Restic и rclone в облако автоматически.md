## 1\. Зачем нужны бэкапы и почему нельзя доверять провайдеру

Большинство VPS-провайдеров в базовом тарифе не делают резервных копий ваших данных. Снапшоты диска — это платная опция, и они хранятся в том же дата-центре. Если дата-центр пострадает, снапшот исчезнет вместе с диском. Это не гипотетика: пожар в OVH в 2021 году уничтожил тысячи серверов без возможности восстановления у клиентов, которые не делали внешних бэкапов.

Откуда берутся потери данных

Ошибка оператораrm -rf не туда, DROP TABLE не той БД — классика. Происходит у всех.

Отказ дискаSSD и HDD умирают. RAID спасает от одного диска, но не от пожара или затопления.

Взлом или вирусШифровальщики уничтожают данные. Важно иметь offline-копию, которую они не затронут.

Ошибка приложенияБаг в миграции БД мог затереть данные час назад — нужна возможность откатиться.

Форс-мажор провайдераБанкротство, пожар, ошибка при техработах — сервер может пропасть с данными.

Правило 3-2-1

3 копии данных — 2 на разных носителях — 1 за пределами основного места хранения. Restic + rclone в облако автоматически выполняет это правило: данные на диске VPS, снимок Restic локально, зашифрованная копия в облаке другого провайдера.

## 2\. Как работают Restic и rclone вместе

**Restic** — инструмент для резервного копирования с открытым кодом. Он разбивает данные на блоки, дедуплицирует их, шифрует и сохраняет в *репозиторий* — специально организованную структуру файлов. Restic не умеет сам загружать данные в Google Drive или Яндекс.Диск — для этого нужен транспортный слой.

**rclone** — универсальный инструмент для работы с облачными хранилищами. Он поддерживает 70+ провайдеров: S3, Backblaze B2, Google Drive, Яндекс.Диск, SFTP, WebDAV и многие другие. rclone настраивается как *remote* (удалённое хранилище) и выступает транспортом для Restic.

Связка работает так: Restic сохраняет репозиторий не в локальную папку, а через rclone-бэкенд прямо в облако. Команда выглядит как `restic -r rclone:имя-remote:бакет/папка backup /путь`. Restic шифрует данные, rclone передаёт их в хранилище.

Restic

- ✓Дедупликация на уровне блоков (~512 КБ)
- ✓AES-256 шифрование (обязательное)
- ✓Инкрементальные снимки
- ✓Верификация целостности данных
- ✓Параллельная загрузка блоков

rclone

- ✓70+ облачных провайдеров
- ✓Автоповторы при сбоях сети
- ✓Параллельная передача частей
- ✓Ограничение пропускной способности
- ✓Работает как бэкенд Restic

## 3\. Установка Restic и rclone

Оба инструмента — статические бинарные файлы без зависимостей. Restic можно установить из репозитория Ubuntu, но там может быть устаревшая версия. rclone удобнее всего ставить официальным скриптом.

### Установка Restic

Способ 1: из apt (Ubuntu 22.04+)

```
apt install -y restic
restic version
```

Если в apt устаревшая версия — скачать последнюю напрямую с GitHub:

Способ 2: последняя версия с GitHub Releases

```
# Определить последнюю версию
RESTIC_VERSION=$(curl -s https://api.github.com/repos/restic/restic/releases/latest \
  | grep '"tag_name"' | sed 's/.*"v\([^"]*\)".*/\1/')

# Скачать и установить
wget -q "https://github.com/restic/restic/releases/latest/download/restic_${RESTIC_VERSION}_linux_amd64.bz2"
bunzip2 "restic_${RESTIC_VERSION}_linux_amd64.bz2"
install -m 755 "restic_${RESTIC_VERSION}_linux_amd64" /usr/local/bin/restic
rm "restic_${RESTIC_VERSION}_linux_amd64"
restic version
```

Обновление Restic в будущем — одной командой:

```
restic self-update
```

### Установка rclone

```
curl https://rclone.org/install.sh | bash
rclone version
```

Ожидаемый результат

`restic version` → `restic 0.17.x compiled with go1.23`. `rclone version` → `rclone v1.68+`.

## 4\. Настройка облачного хранилища

Покажем на примере **Яндекс Object Storage** — S3-совместимое хранилище, доступное из России, от 1.69 ₽/ГБ в месяц. Для других провайдеров (Backblaze B2, AWS S3, Selectel S3) настройка аналогична, отличаются только endpoint и ключи.

### Создание бакета в Яндекс Object Storage

1. 1Войдите в консоль Яндекс Облака → **Object Storage** → **Создать бакет**.
2. 2Имя бакета: например `vps-backups-2026` (должно быть уникальным глобально).
3. 3Доступ: **Закрытый**. Класс хранилища: **Холодное** (дешевле для редко читаемых бэкапов).
4. 4Создайте сервисный аккаунт: **IAM** → **Сервисные аккаунты** → **Создать**. Роль: `storage.editor`.
5. 5Для аккаунта создайте **Статический ключ доступа**. Сохраните **Идентификатор ключа** и **Секретный ключ** — они показываются один раз.

### Настройка rclone remote

Создадим конфигурацию вручную — это быстрее интерактивного мастера `rclone config`.

```
mkdir -p /root/.config/rclone
```

```
[yandex-s3]
type = s3
provider = Other
env_auth = false
access_key_id = ИДЕНТИФИКАТОР_КЛЮЧА
secret_access_key = СЕКРЕТНЫЙ_КЛЮЧ
endpoint = storage.yandexcloud.net
region = ru-central1
```

Проверьте подключение:

```
# Список всех бакетов аккаунта
rclone lsd yandex-s3:

# Проверить конкретный бакет
rclone ls yandex-s3:vps-backups-2026
```

Конфиги для других провайдеров

Backblaze B2

```
[b2]
type = b2
account = APPLICATION_KEY_ID
key = APPLICATION_KEY
```

AWS S3

```
[aws]
type = s3
provider = AWS
access_key_id = AKIAIOSFODNN7EXAMPLE
secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
region = eu-west-1
```

Selectel S3

```
[selectel]
type = s3
provider = Other
access_key_id = КЛЮЧ_ДОСТУПА
secret_access_key = СЕКРЕТНЫЙ_КЛЮЧ
endpoint = s3.storage.selcloud.ru
region = ru-1
```

## 5\. Инициализация репозитория

Репозиторий Restic — это структура каталогов в бакете, где хранятся зашифрованные блоки данных и метаданные снимков. Инициализируется один раз. Пароль шифрует всё — без него восстановление невозможно.

Сохраним пароль в файл — это нужно для автоматических бэкапов:

Создать файл с паролем репозитория (права только для root)

```
# Сгенерировать надёжный пароль
openssl rand -base64 32 > /etc/restic-password
chmod 600 /etc/restic-password

# Посмотреть пароль — СОХРАНИТЕ ЕГО В МЕНЕДЖЕРЕ ПАРОЛЕЙ!
cat /etc/restic-password
```

Пароль — единственный ключ к данным

Если вы потеряете пароль, данные в репозитории будут навсегда недоступны. Никакого сброса пароля нет. Сохраните его в менеджере паролей (Bitwarden, KeePass) или в другом надёжном месте, независимом от VPS.

Инициализировать репозиторий Restic в Яндекс Object Storage

```
restic -r rclone:yandex-s3:vps-backups-2026/restic   --password-file /etc/restic-password   init
```

Успешный вывод: `created restic repository ... at rclone:yandex-s3:vps-backups-2026/restic`. В бакете появятся папки `config`, `data`, `index`, `keys`, `locks`, `snapshots`.

Чтобы не писать флаги каждый раз, можно задать переменные окружения:

Переменные окружения (добавить в ~/.bashrc для удобства при ручной работе)

```
export RESTIC_REPOSITORY="rclone:yandex-s3:vps-backups-2026/restic"
export RESTIC_PASSWORD_FILE="/etc/restic-password"

# Теперь можно сокращённо
restic snapshots
```

## 6\. Резервная копия файлов

Команда `restic backup` создаёт снимок (snapshot) — зашифрованную точку восстановления. При повторном запуске Restic загружает только изменённые блоки — первый бэкап самый долгий, последующие быстрые.

```
restic -r rclone:yandex-s3:vps-backups-2026/restic   --password-file /etc/restic-password   backup /home /etc /root
```

Бэкап с исключениями (кэш, временные файлы, node\_modules)

```
restic -r rclone:yandex-s3:vps-backups-2026/restic   --password-file /etc/restic-password   backup /home /etc /root /var/www   --exclude='*.log'   --exclude='*.tmp'   --exclude='node_modules'   --exclude='.cache'   --exclude='/home/*/.local/share/Trash'
```

```
restic -r rclone:yandex-s3:vps-backups-2026/restic   --password-file /etc/restic-password   snapshots
```

Что обычно сохраняют

- **/etc** — конфигурация системы (nginx, ssh, cron и т.д.)
- **/home** — домашние директории пользователей
- **/root** — конфиги root:.ssh,.bashrc, скрипты
- **/var/www** — сайты и веб-приложения
- **/opt** — приложения, установленные вручную
- **/var/lib/docker/volumes** — данные Docker-контейнеров

## 7\. Резервная копия баз данных

Базы данных нельзя бэкапить как обычные файлы — во время работы файлы на диске находятся в несогласованном состоянии, и такой бэкап может оказаться нечитаемым при восстановлении. Правильный подход — дамп через штатные инструменты, передача в Restic через stdin.

### PostgreSQL

Бэкап одной базы PostgreSQL через pipe

```
sudo -u postgres pg_dump mydb |   restic -r rclone:yandex-s3:vps-backups-2026/restic   --password-file /etc/restic-password   backup --stdin --stdin-filename mydb.sql
```

```
sudo -u postgres pg_dumpall |   restic -r rclone:yandex-s3:vps-backups-2026/restic   --password-file /etc/restic-password   backup --stdin --stdin-filename all-databases.sql
```

### MySQL / MariaDB

Бэкап всех баз MySQL через pipe

```
mysqldump -u root -p'ПАРОЛЬ' --all-databases --single-transaction |   restic -r rclone:yandex-s3:vps-backups-2026/restic   --password-file /etc/restic-password   backup --stdin --stdin-filename all-mysql-databases.sql
```

\--single-transaction для MySQL

Флаг `--single-transaction` делает согласованный снимок InnoDB-таблиц без блокировки записей. Без него во время дампа могут быть вставки и обновления — дамп окажется несогласованным. Для MyISAM используйте `--lock-tables`.

### PostgreSQL в Docker-контейнере

```
docker exec postgres_container pg_dump -U postgres mydb |   restic -r rclone:yandex-s3:vps-backups-2026/restic   --password-file /etc/restic-password   backup --stdin --stdin-filename mydb.sql
```

## 8\. Политика хранения

Без политики хранения снимки накапливаются вечно, и хранилище растёт бесконечно. Команда `restic forget` удаляет старые снимки по заданным правилам. Флаг `--prune` физически удаляет блоки, на которые больше нет ссылок.

Оптимальная политика: 7 ежедневных, 4 еженедельных, 6 ежемесячных

```
restic -r rclone:yandex-s3:vps-backups-2026/restic   --password-file /etc/restic-password   forget   --keep-daily 7   --keep-weekly 4   --keep-monthly 6   --prune
```

| Флаг | Сохраняет | Зачем |
| --- | --- | --- |
| \--keep-daily 7 | По снимку за последние 7 дней | Откатиться на любой из последних 7 дней |
| \--keep-weekly 4 | По снимку за последние 4 недели | Восстановить состояние на прошлой неделе |
| \--keep-monthly 6 | По снимку за последние 6 месяцев | Откатиться на месяц назад |
| \--prune | Удалить блоки без ссылок | Физически освободить место в хранилище |

\--prune замедляет операцию

Pruning перечитывает и перепаковывает блоки в хранилище. На большом репозитории это занимает много времени. Можно вынести в отдельный еженедельный timer: ежедневно запускать `forget` без `--prune`, а `restic prune` отдельной командой раз в неделю.

## 9\. Восстановление из бэкапа

Бэкап имеет смысл, только если вы умеете из него восстанавливаться. Проверяйте это раз в месяц на тестовой директории — не ждите реальной аварии, чтобы обнаружить проблему.

### Просмотр снимков

Список всех снимков (каждый имеет уникальный ID)

```
restic -r rclone:yandex-s3:vps-backups-2026/restic   --password-file /etc/restic-password   snapshots
```

### Восстановление файлов

Восстановить последний снимок в директорию /restore

```
restic -r rclone:yandex-s3:vps-backups-2026/restic   --password-file /etc/restic-password   restore latest --target /restore
```

Восстановить конкретный снимок (ID можно сокращать до первых 8 символов)

```
restic -r rclone:yandex-s3:vps-backups-2026/restic   --password-file /etc/restic-password   restore a1b2c3d4 --target /restore
```

Восстановить только конкретную директорию из снимка

```
restic -r rclone:yandex-s3:vps-backups-2026/restic   --password-file /etc/restic-password   restore latest   --target /restore   --include /etc/nginx
```

### Восстановление базы данных

Извлечь дамп базы из снимка и восстановить

```
# Посмотреть содержимое снимка
restic -r rclone:yandex-s3:vps-backups-2026/restic   --password-file /etc/restic-password   ls latest

# Извлечь файл дампа
restic -r rclone:yandex-s3:vps-backups-2026/restic   --password-file /etc/restic-password   dump latest mydb.sql > /tmp/mydb.sql

# Восстановить базу PostgreSQL
sudo -u postgres psql mydb < /tmp/mydb.sql
```

### Проверка целостности

```
restic -r rclone:yandex-s3:vps-backups-2026/restic   --password-file /etc/restic-password   check
```

Полная проверка со считыванием всех данных (раз в месяц, медленно)

```
restic -r rclone:yandex-s3:vps-backups-2026/restic   --password-file /etc/restic-password   check --read-data
```

## 10\. Автоматизация через systemd timer

Бэкап, который запускается вручную — не бэкап. Автоматизируем через systemd timer: он надёжнее cron, поддерживает `Persistent=true` (запустит пропущенное задание после перезагрузки) и сохраняет логи в journald.

### Скрипт бэкапа

```
#!/bin/bash
set -euo pipefail

REPO="rclone:yandex-s3:vps-backups-2026/restic"
PASSWORD_FILE="/etc/restic-password"

# Бэкап файловой системы
restic -r "$REPO"   --password-file "$PASSWORD_FILE"   backup /home /etc /root /var/www   --exclude='*.log'   --exclude='node_modules'   --exclude='.cache'   --tag filesys

# Бэкап PostgreSQL (если установлен)
if command -v pg_dumpall &>/dev/null; then
  sudo -u postgres pg_dumpall |     restic -r "$REPO"     --password-file "$PASSWORD_FILE"     backup --stdin --stdin-filename all-postgres.sql     --tag postgres
fi

# Бэкап MySQL (если установлен и есть файл с паролем)
if command -v mysqldump &>/dev/null && [ -f /etc/restic-mysql-password ]; then
  MYSQL_PWD=$(cat /etc/restic-mysql-password)   mysqldump -u root --all-databases --single-transaction |     restic -r "$REPO"     --password-file "$PASSWORD_FILE"     backup --stdin --stdin-filename all-mysql.sql     --tag mysql
fi

# Политика хранения: 7 дней, 4 недели, 6 месяцев
restic -r "$REPO"   --password-file "$PASSWORD_FILE"   forget   --keep-daily 7   --keep-weekly 4   --keep-monthly 6   --prune
```

```
chmod +x /usr/local/bin/restic-backup.sh
```

### systemd unit и timer

```
[Unit]
Description=Restic Backup to Object Storage
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/restic-backup.sh
```

```
[Unit]
Description=Daily Restic Backup Timer
Requires=restic-backup.service

[Timer]
# Каждый день в 03:00, когда нагрузка минимальна
OnCalendar=*-*-* 03:00:00
# Если сервер был выключен — запустить при следующем старте
Persistent=true
# Случайная задержка до 30 минут (снижает пиковую нагрузку)
RandomizedDelaySec=1800

[Install]
WantedBy=timers.target
```

```
systemctl daemon-reload
systemctl enable --now restic-backup.timer

# Проверить статус
systemctl status restic-backup.timer
systemctl list-timers restic-backup.timer
```

```
systemctl start restic-backup.service

# Следить за выводом в реальном времени
journalctl -fu restic-backup.service
```

Уведомления при ошибке

Добавьте в конец скрипта проверку exit-кода и отправку уведомления в Telegram через curl при ненулевом результате. Так вы узнаете о сбое бэкапа сразу, а не когда понадобится восстановление. Логи всегда доступны через `journalctl -u restic-backup.service`.