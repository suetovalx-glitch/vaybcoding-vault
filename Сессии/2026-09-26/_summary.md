# Сводка за 2026-09-26

> **Этот файл — память агента.** При начале новой сессии попроси ассистента прочитать `Сессии/2026-09-26/_summary.md` — он подгрузит контекст.

## Что было сделано

### Блоки подготовки переезда (диалог 01)

- ✅ `VPS/test-1.md`, `VPS/test-2.md`, `VPS/test-3.md` обновлены данными (IP, логин, пароль)
- ✅ SSH-ключи сгенерированы: `test-1`, `test-2`, `test-3` ed25519
- ✅ Публичные ключи записаны в frontmatter `VPS/test-3.md`
- ✅ `.gitignore` настроен, секреты исключены
- ✅ Vault инициализирован в Git (207 файлов)

### SSH проверка всех 3 VPS (диалог 02)

- ✅ test-1 (78.17.67.159): SSH подключение ОК, Ubuntu 24.04, 3.8Gi RAM
- ✅ test-2 (31.77.192.54): SSH подключение ОК, Ubuntu 24.04.4, 3.8Gi RAM
- ✅ test-3 (168.113.157.93): SSH подключение ОК, Ubuntu 24.04, 7.8Gi RAM

### Деплой Docker (диалог 03)

- ✅ Docker 29.8.1 + Compose v5.5.1 установлен на все 3 VPS
- ✅ test-1 (Stage-pi): `docker compose up -d` — ОК, контейнеры pi-test + cloudflared запущены
- ✅ test-2 (Stage-Hermes): `docker compose up -d` — ОК, контейнер hermes-test запущен
- ❌ test-3 (Stage-Infra): TLS handshake timeout при `docker pull` с Docker Hub (блокировка AdminVPS)

### Блокеры

- test-3: Docker Hub TLS timeout — AdminVPS (Финляндия) блокирует HTTPS к Docker Hub registry
- Ждём новый VPS для test-3 или решение проблемы

## Текущий статус

| VPS | IP | SSH | Docker | Compose |
| ----- | ----- | ----- | -------- | --------- |
| test-1 | 78.17.67.159 | ✅ | ✅ v29.8.1 | ✅ |
| test-2 | 31.77.192.54 | ✅ | ✅ v29.8.1 | ✅ |
| test-3 | 168.113.157.93 | ✅ | ✅ v29.8.1 | ❌ TLS timeout |

## Что нужно для новой сессии

1. Решить проблему test-3 (новый VPS или обход блокировки Docker Hub)
2. После решения — развернуть compose на test-3
3. Smoke-test всех 3 VPS
4. Обновить `VPS/test-{1,2,3}.md` с реальными данными после деплоя

## Ключевые файлы

- `VPS/DEPLOY_STATUS.md` — текущий статус деплоя
- `VPS/FINAL_DEPLOY_REPORT.md` — полный отчёт
- `VPS/ssh_check_report.md` — SSH проверка
- `VPS/docker_deploy_report.md` — Docker установка
- `VPS/compose_deploy_report.md` — Compose деплой

## Сессии 2026-09-26

- `диалог-01-переезд-na-vps-2026-09-26.md` — Блоки A–C, подготовка
