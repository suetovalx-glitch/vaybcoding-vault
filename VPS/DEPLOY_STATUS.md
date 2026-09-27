# Деплой 3 test-VPS — Статус на 2026-09-26

## Общий статус: 2/3 полностью работают

| VPS | IP | SSH | Docker | Compose | Статус |
| ----- | ----- | ----- | -------- | --------- | -------- |
| test-1 (Stage-pi) | 78.17.67.159 | ✅ | ✅ v29.8.1 | ✅ | **[OK]** |
| test-2 (Stage-Hermes) | 31.77.192.54 | ✅ | ✅ v29.8.1 | ✅ | **[OK]** |
| test-3 (Stage-Infra) | 168.113.157.93 | ✅ | ✅ v29.8.1 | ❌ | **[BLOCKED]** |

## test-1 (Stage-pi) — ✅ РАБОТАЕТ

- Docker 29.8.1 + Compose v5.5.1 установлен через `get.docker.com`
- `docker compose up -d` — ОК
- Контейнеры: `pi-test`, `cloudflared-test-pi` — запущены
- `docker compose ps` подтверждает работу

## test-2 (Stage-Hermes) — ✅ РАБОТАЕТ

- Docker 29.8.1 + Compose v5.5.1 установлен
- `docker compose up -d` — ОК
- Контейнер `hermes-test` — запущен

## test-3 (Stage-Infra) — ❌ ЗАБЛОКИРОВАН

- Docker установлен, но `docker pull` зависает с TLS handshake timeout
- Проблема: AdminVPS (Финляндия) блокирует/медиаторит HTTPS к Docker Hub registry
- Все образы (nodered, mosquitto, traefik, ollama) не скачиваются

## Причина блокировки test-3

- Провайдер AdminVPS (Финляндия) использует MITM-прокси для HTTPS трафика
- `production.cloudfront.docker.com` — TLS handshake timeout
- DNS работает, MTU 1400, прямой curl к registry работает
- Docker daemon не может установить TLS-соединение при pull

## Что нужно для завершения

1. Разблокировать Docker Hub на AdminVPS (НЕ РЕКОМЕНДУЕТСЯ)
2. Использовать другой провайдер для test-3
3. Загрузить образы через `docker save/load` с локальной машины

## Рекомендация

Пока ждём новый VPS для test-3 (или используем альтернативный провайдер).
Образы для test-1/2 уже работают, деплой можно считать завершённым.

## Следующий шаг

Ожидаем новый VPS для test-3 и повторяем деплой.
