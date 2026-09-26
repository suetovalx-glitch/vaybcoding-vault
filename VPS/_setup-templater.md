# Настройка Templater для VPS-команд

Одноразовая инструкция. После настройки возвращаться не нужно.

## Шаг 1. Указать Templater, где лежат шаблоны и скрипты

1. **Settings → Templater** (внизу списка плагинов).
2. **Template folder location** → `VPS/` (или введи `VPS` от корня vault).
3. **User script folder location** → `_scripts/` (от корня vault).
4. Закрой Settings.

Templater просканирует эти папки и подхватит:
- Шаблон: `VPS/ssh-command.md`
- User-скрипт: `_scripts/ssh-from-frontmatter.js`

## Шаг 2. Проверить, что всё подхватилось

1. Открой любую VPS-заметку с заполненным frontmatter (`ip`, `user`, `port`).
2. `Ctrl+P` → "Templater: Insert template".
3. Должен появиться пункт **`ssh-command`** (без расширения .md).
4. Выбери его — в текущую позицию курсора вставится сгенерированная SSH-команда.

Если пункта нет — проверь, что оба файла лежат в правильных папках:
- `VPS/ssh-command.md`
- `_scripts/ssh-from-frontmatter.js`

## Шаг 3. (Опционально) Горячая клавиша

1. Settings → Hotkeys → поиск `Templater: Insert template`.
2. Назначь `Alt+E` (дефолт) или любую удобную комбинацию.
3. Теперь в любой VPS-заметке `Alt+E` → выбрать `ssh-command` → вставится команда.

## Какие поля читает скрипт

| Поле в frontmatter | Обязательно | Дефолт | Что делает |
| --- | --- | --- | --- |
| `ip` | ✅ | — | Адрес или hostname |
| `user` | ❌ | `root` | SSH-пользователь |
| `port` | ❌ | `22` | Порт (если не 22, добавляется `-p PORT`) |
| `identityFile` | ❌ | — | Путь к ключу, добавляется `-i` |
| `proxyJump` | ❌ | — | Бастион, добавляется `-J` |
| `sshAlias` | ❌ | — | Алиас из `~/.ssh/config` — если задан, команда строится как `ssh <alias>` |

## Пример заметки с frontmatter

```yaml
---
ip: 188.166.12.34
user: root
port: 2222
identityFile: ~/.ssh/id_ed25519
sshAlias: my-server
os: Ubuntu 24.04
provider: AdminVPS
location: Варшава
created: 2026-09-24
---
```

С таким frontmatter скрипт сгенерирует:

```bash
ssh my-server
```

Если `sshAlias` убрать — сгенерируется:

```bash
ssh -p 2222 -i ~/.ssh/id_ed25519 root@188.166.12.34
```

## Что ещё умеет скрипт

- Если не хватает `ip` — вставит предупреждение и не сгенерирует команду.
- Если задан `identityFile` — добавит `-i PATH`.
- Если задан `proxyJump` — добавит `-J USER@BASTION`.
- Сгенерирует шаблон `scp` для копирования файлов (с тем же ключом и портом).

## Где править

- Сам скрипт: `_scripts/ssh-from-frontmatter.js` (если нужно добавить новые поля или изменить логику).
- Шаблон: `VPS/ssh-command.md` (если хочешь изменить формат вывода).
- Дефолтные пути Templater: Settings → Templater.
