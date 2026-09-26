# Сессия 14: NetBird как mesh-VPN между VPS

**Дата:** 2026-09-25
**Время:** ~05:30 (ночная сессия)
**Ассистент:** MiniMax-M3 (wormsoft)
**Канал:** pi-coding-agent CLI (chat)

## Контекст

После заведения test-инфраструктуры (диалог 13) пользователь спросил «мы можем использовать netbird для связи». Цель — заменить или дополнить Cloudflare Tunnel mesh-VPN'ом на WireGuard.

## Что обсудили

### Блок 1. Что такое NetBird

- **NetBird** (<https://netbird.io>) — open-source **mesh-VPN на WireGuard** с управляющим control-сервером.
- **BSD-3**, self-hosted или managed (NetBird Cloud).
- Поддерживает **Linux, Windows, macOS, iOS, Android, Docker, routers**.
- Заменяет традиционные VPN через **identity-based ZTNA** (Zero Trust Network Access).
- Каждый peer получает IP из подсети 100.64/12 и строит прямые WireGuard-туннели к другим peer'ам.

### Блок 2. Self-host vs NetBird Cloud

- **Self-hosted:** свой control-сервер (минимум 1 vCPU / 2 ГБ RAM, публичный домен, TCP 80/443 + UDP 3478).
- **Managed (NetBird Cloud):** без своих серверов и домена.

### Блок 3. Три сценария интеграции

- **Сценарий A (полная замена):** NetBird вместо Cloudflare Tunnel для всей связи между VPS. `delegate_task` идёт напрямую через WireGuard mesh.
- **Сценарий B (гибрид):** Cloudflare Tunnel для публичного HTTPS-фронтенда (Telegram webhook, дашборды), NetBird для mesh-VPN между VPS. **Рекомендую.**
- **Сценарий C (NetBird только для test):** прод остаётся на Cloudflare Tunnel, test-VPS подключаются к отдельному NetBird mesh.

### Блок 4. Сравнение Cloudflare Tunnel vs NetBird

| Критерий | Cloudflare Tunnel | NetBird |
| --- | --- | --- |
| Протокол | HTTPS-туннель | WireGuard (ChaCha20) |
| Адресация | DNS `*.example.com` → VPS | Приватные IP 100.64/12 |
| Открытые порты | 0 | 0 |
| Latency | Через edge Cloudflare | Прямой peer-to-peer |
| Скорость настройки | Быстро | Больше движущихся частей |
| Цена | Free tier | Self-host = ещё 1 VPS (~300 ₽/мес) |

### Блок 5. Созданные артефакты

- **`wiki/entities/netbird.md`** — entity-страница по нашему шаблону (обзор, платформы, архитектура, требования, сценарии интеграции, план развёртывания, риски).
- **`wiki/concepts/dual-agent-stack.md`** — обновлён: добавлен NetBird в Evidence и Related Pages.
- **`wiki/concepts/docker-test-stack.md`** — обновлён: NetBird как вариант mesh для test-инфра.
- **`wiki/index.md`** — добавлен в Entities.
- **`wiki/overview.md`** — добавлен в Инфраструктуру.
- **`wiki/log.md`** — запись о NetBird.

### Блок 6. Что осталось

- Решить, берём NetBird или остаёмся на Cloudflare Tunnel.
- Если NetBird — заказать ещё 1 VPS для control-сервера (~300 ₽/мес).
- Поднять control-сервер через `getting-started.sh`.
- Создать setup keys для каждого peer.
- Подключить VPS-1, VPS-2, VPS-test-1/2/3, локальную машину как peer'ов.
- Настроить Access Policies.

## Принятые решения

- **NetBird** — сильная альтернатива Cloudflare Tunnel для peer-to-peer между VPS.
- **Сценарий B (гибрид) — рекомендация:** Cloudflare Tunnel для публичного HTTPS-фронтенда, NetBird для mesh-VPN между VPS.
- **Self-host NetBird** — лучше, чем NetBird Cloud (BSD-3, без vendor lock, контроль над данными).
- **Дополнительный VPS для control-сервера** — стоит ~300 ₽/мес на hshp.host MSK-1.
- **Документировано, не форсируется** — решение остаётся за пользователем.

## Созданные / изменённые артефакты

- `wiki/entities/netbird.md` — **создан**.
- `wiki/concepts/dual-agent-stack.md` — **обновлён** (NetBird в Evidence/Related/Next/Change Impact).
- `wiki/concepts/docker-test-stack.md` — **обновлён** (NetBird в Evidence/Related).
- `wiki/index.md` — **обновлён** (Entities).
- `wiki/overview.md` — **обновлён** (Инфраструктура).
- `wiki/log.md` — **обновлён** (раздел «NetBird как mesh-VPN между VPS»).
- `Сессии/2026-09-25/диалог-14-netbird-mesh-vpn.md` — **этот файл**.

## Открытые вопросы

- Брать NetBird или оставить Cloudflare Tunnel?
- Если NetBird — self-host (ещё 1 VPS) или NetBird Cloud?
- Какой сценарий: A (полная замена), B (гибрид), C (NetBird только для test)?
- Бюджет на ещё 1 VPS (~300 ₽/мес) — есть?
- Совместимость с Docker (нужен `SYS_ADMIN` capability для клиента) — проверить на hshp.host.

## Связанные wiki-страницы

- [[wiki/entities/netbird]] — новый entity.
- [[wiki/concepts/dual-agent-stack]] — основной стек.
- [[wiki/concepts/docker-test-stack]] — test-стек.
- [[wiki/entities/cloudflare-tunnel]] — текущая связь, с которой сравниваем.
- [[wiki/entities/hshp-host]] — где можно развернуть NetBird control-сервер.

## Следующие шаги

- [ ] Решить вопрос NetBird vs Cloudflare Tunnel.
- [ ] Если NetBird — заказать ещё 1 VPS для control-сервера.
- [ ] Поднять NetBird control-сервер через `getting-started.sh`.
- [ ] Создать setup keys, подключить peer'ов.
- [ ] Настроить Access Policies.
- [ ] Обновить `delegate_task` на использование NetBird IP (если выбран сценарий A или B).

## Цитаты / формулировки, которые стоит запомнить

> «NetBird = mesh-VPN на WireGuard + identity-based ZTNA. **BSD-3, self-hosted.**»

> «Cloudflare Tunnel хорош для публичного HTTPS, NetBird — для peer-to-peer. **Гибрид — лучше всего.**»

> «Self-host NetBird требует ещё 1 VPS (~300 ₽/мес) + публичный домен.»

## Технические детали

- **NetBird:** <https://netbird.io>
- **GitHub:** <https://github.com/netbirdio/netbird>
- **Лицензия:** BSD-3
- **Self-host требования:** 1 vCPU / 2 ГБ RAM, Linux VM, Docker Compose v2+, публичный домен, TCP 80/443 + UDP 3478 открыты.
- **Платформы клиента:** Linux, Windows, macOS, iOS, Android, Docker (rootless), OpenWrt routers.
- **Quickstart:** `curl -fsSL https://github.com/netbirdio/netbird/releases/latest/download/getting-started.sh | bash`
- **Требования к Docker-клиенту:** `--cap-add=SYS_ADMIN --cap-add=SYS_RESOURCE` или `--network=host`.
