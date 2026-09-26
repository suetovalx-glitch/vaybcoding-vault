# NetBird (mesh-VPN на WireGuard)

## Summary

**NetBird** (<https://netbird.io>) — open-source **mesh-VPN** на базе **WireGuard** с управляющим control-сервером. Лицензия **BSD-3**, self-hosted или managed (NetBird Cloud). Поддерживает **Linux, Windows, macOS, iOS, Android, Docker, routers**. Заменяет традиционные VPN через identity-based ZTNA с управлением peer'ами через дашборд. Для нашего dual-agent-stack — **возможная замена Cloudflare Tunnel для mesh-связи между VPS**, или работа в паре (Cloudflare для HTTPS-фронтенда, NetBird для mesh-VPN).

## Current Understanding

### Что это

- **Mesh-VPN** на WireGuard: каждый peer подключается к control-серверу, получает список других peer'ов и строит прямые зашифрованные туннели peer-to-peer.
- **Control-сервер** управляет peer'ами, ключами, политиками доступа, маршрутами.
- **WireGuard-протокол** на уровне ядра Linux (или userspace через gVisor), UDP.
- **Identity-based ZTNA** вместо классического VPN-шлюза: доступ по identity пользователя/peer'а, не по IP.
- **Zero Trust**: только авторизованные peer'ы видят друг друга.

### Поддерживаемые платформы

| Платформа | Поддержка |
| --- | --- |
| Linux | ✅ (systemd-клиент, контейнеры, rootless) |
| Windows | ✅ |
| macOS | ✅ |
| iOS | ✅ |
| Android | ✅ |
| Docker | ✅ (rootless-вариант без привилегий) |
| Routers (OpenWrt) | ✅ |

### Self-hosted vs Managed

- **Self-hosted** (BSD-3): свой control-сервер на своём VPS, без зависимости от NetBird Cloud. Нужны: 1 vCPU / 2 ГБ RAM, публичный домен, TCP 80/443 + UDP 3478.
- **Managed (NetBird Cloud)**: managed-вариант, без своих серверов и домена.

### Ключевые свойства

- **Peer-to-peer** по WireGuard — прямой туннель между peer'ами, не через сервер.
- **Relay через TURN** для NAT-traversal (если peer'ы за NAT без прямого соединения).
- **STUN/TURN** через встроенный Coturn.
- **Identity providers**: встроенный Dex (по умолчанию), Okta, Azure AD, Google Workspace, Auth0, Keycloak, Zitadel, Authentik, PocketID.
- **Access policies** (ACL) между peer'ами и группами.
- **Routes** для проброса внешних подсетей.
- **DNS** для кастомных имен внутри mesh.
- **Setup keys** для автоматического подключения peer'ов (без интерактивного логина).
- **Reverse proxy** для избирательного exposing mesh-ресурсов в интернет (через dashboard).
- **CrowdSec** для блокировки плохих IP.
- **eBPF + raw sockets** для клиента (нужны `SYS_ADMIN` и `SYS_RESOURCE` capabilities).

### Архитектура self-hosted

| Компонент | Назначение |
| --- | --- |
| `netbird-server` | Management API + gRPC + Relay + STUN в одном контейнере (объединено с v0.29) |
| `dashboard` | Web UI для управления peer'ами, политиками, ключами |
| `traefik` (опционально) | Reverse proxy с автоматическим TLS через Let's Encrypt |
| `coturn` | STUN/TURN для NAT-traversal |
| `dex` (встроен в server) | Identity provider (OAuth2/OIDC) |
| БД postgresql/mysql/sqlite | Хранение peer'ов, ключей, политик |

### Требования к control-серверу

- Linux VM с **минимум 1 vCPU и 2 ГБ RAM**.
- Публичный домен (`netbird.example.com`).
- TCP 80/443 + UDP 3478 открыты в мир.
- Docker Compose v2+.

## Что меняет для нашего dual-agent-stack

В [[wiki/concepts/dual-agent-stack]] мы использовали **Cloudflare Tunnel** для связи между VPS-1 (Hermes) и VPS-2 (pi-coding-agent). NetBird может **заменить** Cloudflare Tunnel или **работать в паре**.

### Сценарий A: NetBird вместо Cloudflare Tunnel (полная замена)

```text
VPS-1 Hermes (NetBird peer: 100.64.0.10)
    │
    │ WireGuard tunnel (NetBird mesh)
    │
VPS-2 pi-coding-agent (NetBird peer: 100.64.0.11)
```text

- **Hermes и pi-coding-agent** получают приватные IP из подсети 100.64/12.
- `delegate_task` от Hermes идёт напрямую на `http://100.64.0.11:8080` через WireGuard-туннель.
- **Плюсы:** прямой peer-to-peer (без Cloudflare-edge), быстрее, проще конфигурация ACL.
- **Минусы:** нужен свой NetBird control-сервер (ещё 1 VPS, +1 vCPU/2 ГБ RAM, ~150–300 ₽/мес).

### Сценарий B: гибрид (Cloudflare + NetBird)

- **Cloudflare Tunnel** для **публичного HTTPS-фронтенда** (Telegram webhook для Hermes, дашборды, публичные API).
- **NetBird** для **mesh-VPN между VPS** (Hermes ↔ pi, test ↔ prod при необходимости).

```text
Telegram/Discord/Cloudflare Edge → Hermes (VPS-1) → NetBird mesh → pi-coding-agent (VPS-2)
                                            └────→ test-VPS (для staging)
```text

- **Плюсы:** каждая технология используется для того, в чём она сильна.
- **Минусы:** сложнее, две системы управления.

### Сценарий C: NetBird для test-инфраструктуры (отдельный mesh)

- **Прод-стек** остаётся на Cloudflare Tunnel (как было).
- **Test-стек** ([[wiki/concepts/docker-test-stack]]) — на отдельном NetBird mesh между VPS-test-1, VPS-test-2, VPS-test-3.
- **Плюсы:** полная изоляция, test-VPS не светят в Cloudflare-edge.
- **Минусы:** ещё 1 control-сервер (или шарить с продом).

## Как интегрировать (если выбираем NetBird)

### Шаг 1. Развернуть NetBird control-сервер

На **отдельном VPS** (например, hshp.host MSK-1 за 300 ₽/мес):

```bash
ssh root@<netbird-server-ip>
apt update && apt upgrade -y
curl -fsSL https://get.docker.com | sh

# Установка NetBird через getting-started.sh
curl -fsSL https://github.com/netbirdio/netbird/releases/latest/download/getting-started.sh | bash
# Выбираем Traefik (опция 0)
# Включаем NetBird Proxy (y)
# Указываем домен: netbird.example.com
# Let's Encrypt email
```bash

После установки:

- Dashboard: `https://netbird.example.com`
- API: `https://netbird.example.com/api`
- gRPC: `https://netbird.example.com/management.ManagementService/`

### Шаг 2. Создать setup keys

В dashboard → Setup Keys → создать:

- `prod-hermes` (для VPS-1)
- `prod-pi-agent` (для VPS-2)
- `test-stage-pi` (для VPS-test-1)
- `test-stage-hermes` (для VPS-test-2)
- `test-stage-infra` (для VPS-test-3)
- `local-laptop` (для локальной машины)

### Шаг 3. Подключить peer'ов

На каждом VPS:

```bash
# Установка NetBird client
curl -fsSL https://pkg.netbird.io/install.sh | sh

# Подключение к mesh
netbird up --setup-key <SETUP_KEY>

# Проверка статуса
netbird status
```bash

После подключения peer получает IP из подсети 100.64/12 и виден в mesh.

### Шаг 4. Настроить Access Policies

В dashboard → Access Policies:

- **prod-policy**: Hermes ↔ pi-coding-agent, порт 8080 (delegate_task).
- **test-policy**: test-VPS ↔ test-VPS (полный доступ внутри test-mesh).
- **admin-policy**: локальная машина ↔ все (для отладки).

### Шаг 5. Обновить концепт dual-agent-stack

- Заменить Cloudflare Tunnel на NetBird mesh для `delegate_task`.
- Cloudflare Tunnel оставить только для публичного HTTPS-фронтенда (Telegram webhook).
- Обновить `wiki/concepts/dual-agent-stack.md` — фиксировать переход.

## Альтернативы

- **Cloudflare Tunnel** — уже используем, проще, но медленнее для peer-to-peer.
- **WireGuard вручную** — без control-сервера, без дашборда. Для 5 VPS это утомительно.
- **Tailscale** (BSD-3) — аналог NetBird, но managed-only для бесплатного тарифа. Self-host через Headscale.
- **Headscale** (BSD-3) — open-source self-hosted control для Tailscale-клиентов. Альтернатива NetBird.
- **OpenZiti** (Apache-2) — ещё один ZTNA-проект, сложнее в настройке.

## Что выбрать

| Если... | Используй |
| --- | --- |
| Хочется быстро настроить без своих серверов | Cloudflare Tunnel (текущее) |
| Нужен прямой peer-to-peer между VPS | NetBird |
| Нужна полная изоляция test-стека | NetBird для test, Cloudflare для prod |
| Хочется минимум движущихся частей | Cloudflare Tunnel |
| Есть бюджет на ещё 1 VPS для control-сервера | NetBird (BSD-3, без vendor lock) |

## План действий (если выбираем NetBird)

- [ ] Заказать ещё 1 VPS для control-сервера (hshp.host MSK-1, 300 ₽/мес).
- [ ] Поднять NetBird control-сервер через `getting-started.sh`.
- [ ] Настроить домен `netbird.example.com` + Let's Encrypt.
- [ ] Создать setup keys для каждого peer'а.
- [ ] Подключить VPS-1, VPS-2, VPS-test-1/2/3, локальную машину как peer'ов.
- [ ] Настроить Access Policies.
- [ ] Обновить `delegate_task` на использование NetBird IP вместо Cloudflare Tunnel URL.
- [ ] Обновить `wiki/concepts/dual-agent-stack.md` и `wiki/concepts/docker-test-stack.md`.

## Риски

- **Ещё 1 VPS** — увеличение бюджета и точки отказа.
- **Сложнее Cloudflare Tunnel** — больше компонентов, больше шансов на ошибку.
- **Зависимость от своего control-сервера** — если он упадёт, mesh не работает (но peer-to-peer сохранится, новые peer'ы не смогут подключиться).
- **Совместимость с Docker** — нужен `SYS_ADMIN` capability для клиента (или rootless-вариант, но он ограничен).
- **Производительность WireGuard** — обычно отличная, но при большом количестве peer'ов может быть нагрузка на relay.

## Evidence

- `https://netbird.io` — официальный сайт, описание, лицензия BSD-3.
- `https://docs.netbird.io/selfhosted/selfhosted-quickstart` — quickstart self-host.
- `https://docs.netbird.io/selfhosted/selfhosted-guide` — расширенный гайд.
- `https://docs.netbird.io/get-started/install/docker` — установка клиента через Docker.
- `https://docs.netbird.io/selfhosted/maintenance/configuration-files` — референс конфигов.
- [[wiki/concepts/dual-agent-stack]] — концепт, куда интегрируем NetBird.
- [[wiki/concepts/docker-test-stack]] — test-инфра, куда тоже интегрируем.
- [[wiki/entities/cloudflare-tunnel]] — текущая связь, с которой сравниваем.
- [[wiki/entities/hshp-host]] — где можно развернуть NetBird control-сервер.

## Related Pages

- [[wiki/overview]] — карта базы.
- [[wiki/concepts/dual-agent-stack]] — основной стек.
- [[wiki/concepts/docker-test-stack]] — test-стек.
- [[wiki/entities/cloudflare-tunnel]] — текущая связь.
- [[wiki/entities/hermes-agent]] — peer #1 в mesh.
- [[wiki/entities/pi-agent]] — peer #2 в mesh.

## Contradictions / Uncertainty

- **Self-host NetBird требует 1 VPS** — ещё одна точка отказа и расход.
- **NetBird Cloud** — managed-вариант, проще, но привязывает к NetBird.io.
- **Совместимость с Cloudflare Tunnel** — нужно проверить, что оба могут работать параллельно (или выбрать один).
- **Peer-to-peer latency** — зависит от расположения VPS-ов; relay используется только при невозможности прямого соединения.
- **Производительность Docker с `SYS_ADMIN`** — не все Docker-хостинги разрешают такие capabilities.

## Next Questions

- Выбираем NetBird или остаёмся на Cloudflare Tunnel?
- Если NetBird — self-host (нужен ещё 1 VPS) или NetBird Cloud?
- Какой сценарий: A (полная замена), B (гибрид), C (NetBird только для test)?
- Бюджет на ещё 1 VPS (~300 ₽/мес) — есть?

## Change Impact on Wiki

- Создан `wiki/entities/netbird.md` — entity-страница.
- Будет обновлён [[wiki/concepts/dual-agent-stack]] — добавлен NetBird как альтернатива Cloudflare Tunnel.
- Будет обновлён [[wiki/concepts/docker-test-stack]] — добавлен NetBird как вариант mesh для test-инфра.
- Обновлён [[wiki/index]] — добавлен в Entities.
- Обновлён [[wiki/overview]] — добавлен в раздел Инфраструктура.
- Запись в `wiki/log.md`.
- Запись в `Сессии/2026-09-25/диалог-14-netbird.md`.
- Обновление `Сессии/2026-09-25/_summary.md`.
- Обновление `Отчет/2026-09-25-итог-дня.md`.
