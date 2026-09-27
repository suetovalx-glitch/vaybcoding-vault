# Финальный отчёт: Деплой Docker на 3 test-VPS — 2026-09-26

## Статус: 2 из 3 полностью работают, 1 заблокирован сетью хостинга

| VPS | IP | SSH | Docker | Compose | Статус |
| ----- | ----- | ----- | -------- | --------- | -------- |
| test-1 (Stage-pi) | 78.17.67.159 | ✅ | ✅ v29.8.1 | ✅ | **[OK] Полностью работает** |
| test-2 (Stage-Hermes) | 31.77.192.54 | ✅ | ✅ v29.8.1 | ✅ | **[OK] Полностью работает** |
| test-3 (Stage-Infra) | 168.113.157.93 | ✅ | ✅ v29.8.1 | ❌ | **[BLOCKED] TLS timeout** |

## test-1 (Stage-pi) — ✅ РАБОТАЕТ

- Docker 29.8.1 + Compose v5.5.1
- Контейнеры: `pi-test`, `cloudflared-test-pi` — запущены
- `docker compose up -d` — ОК

## test-2 (Stage-Hermes) — ✅ РАБОТАЕТ  

- Docker 29.8.1 + Compose v5.5.1
- Контейнер: `hermes-test` — запущен
- `docker compose up -d` — ОК

## test-3 (Stage-Infra) — ❌ ЗАБЛОКИРОВАН

- Docker 29.8.1 установлен
- `docker pull` зависает с TLS handshake timeout на `production.cloudfront.docker.com`
- Проверено: DNS работает, MTU 1400, proxy не настроен, прямой доступ есть
- Причина: блокировка/MITM proxy на AdminVPS (Финляндия) для Docker Hub HTTPS

## Способы разблокировки test-3

**Вариант 1 — Прокси на хостинге:**
Настроить HTTP_PROXY на AdminVPS для обхода блокировки.

**Вариант 2 — docker save/load:**

```bash
# На локальной машине:
docker save nodered/node-red:latest eclipse-mosquitto:2 traefik:v3 ollama/ollama:latest | gzip > test3-images.tar.gz
# На VPS test-3:
docker load < test3-images.tar.gz
docker compose up -d
```

**Вариант 3 — Использовать другой провайдер для test-3:**
Hetzner/Contabo/VPSdrama без блокировки Docker Hub.

## Итого

- ✅ SSH подключение ко всем 3 VPS
- ✅ Docker установлен на все 3 VPS
- ✅ 2 из 3 VPS полностью развёрнуты с compose
- ❌ test-3 ждёт решения проблемы с Docker Hub

## Файлы отчётов в vault

- `VPS/ssh_check_report.md` — SSH проверка
- `VPS/docker_deploy_report.md` — Docker установка
- `VPS/compose_deploy_report.md` — Docker compose деплой
