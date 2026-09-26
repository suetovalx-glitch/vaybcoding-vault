# Сессия 13: Test Infrastructure — 3 VPS как Docker-машина

**Дата:** 2026-09-25
**Время:** ~05:00 (ночная сессия)
**Ассистент:** MiniMax-M3 (wormsoft)
**Канал:** pi-coding-agent CLI (chat)

## Контекст

После интеграции Orca ADE как опционального GUI-фронтенда (диалог 12) пользователь сказал «у нас есть ещё 3 VPS, я думаю использовать его как docker-машину для тестов». Цель — завести изолированную test-инфраструктуру параллельно с прод-стеком (VPS-1 Hermes + VPS-2 pi-coding-agent).

## Что обсудили

### Блок 1. Роли для 3 VPS

Пользователь сказал «3 VPS как docker-машина для тестов». Я предложил 3 роли по умолчанию:

- **VPS-test-1 (Stage-pi)** — staging-копия pi-coding-agent (2 vCPU / 4 ГБ / 40 ГБ / ~300–600 ₽/мес).
- **VPS-test-2 (Stage-Hermes)** — staging-копия Hermes Agent (1 vCPU / 2 ГБ / 20 ГБ / ~150–350 ₽/мес).
- **VPS-test-3 (Stage-Infra)** — docker-compose стенды (Node-RED, Mosquitto, Traefik, ollama) + бенчмарки моделей (2 vCPU / 4 ГБ / 60 ГБ / ~400–600 ₽/мес).

### Блок 2. Изоляция от прода

- **Отдельные SSH-ключи:** `~/.ssh/test-{1,2,3}-ed25519` (не шарим с прод-ключами `hermes-ed25519`, `pi-agent-ed25519`).
- **Отдельная docker-сеть:** `dual-agent-test` (прод использует `dual-agent-prod`).
- **Отдельная vault-ветка:** `test/` или отдельный репо `obsidian-vault-test`.
- **Отдельные API-ключи:** тестовые OpenRouter/Wormsoft (или free-tier).
- **Отдельный Telegram-бот** для test-Hermes (через @BotFather).
- **Cloudflare Tunnel:** `*.test.example.com` (прод — `*.prod.example.com`).
- **Бэкапы:** по запросу (тестовые данные не критичны).

### Блок 3. Что тестируем

| Тест | VPS |
| --- | --- |
| Обновление pi-coding-agent перед выкаткой | test-1 |
| Обновление Hermes перед выкаткой | test-2 |
| Миграция vault-репо | test-1 |
| Self-hosted LLM (ollama) — сравнение с cloud | test-3 |
| Бенчмарки моделей | test-3 |
| Docker-compose upgrade (Traefik, Node-RED) | test-3 |
| Telegram-бот фичи | test-2 |

### Блок 4. Созданные артефакты

- **`wiki/concepts/docker-test-stack.md`** — концепт test-инфраструктуры (Mermaid-диаграмма, docker-compose конфиги, таблица изоляции, план развёртывания).
- **`VPS/test-1.md`** — заметка под VPS-test-1 (Stage-pi).
- **`VPS/test-2.md`** — заметка под VPS-test-2 (Stage-Hermes).
- **`VPS/test-3.md`** — заметка под VPS-test-3 (Stage-Infra).
- **`wiki/concepts/dual-agent-stack.md`** — обновлён: добавлен слой test-инфраструктуры.
- **`wiki/index.md`** — обновлён: добавлен `docker-test-stack` в Concepts.
- **`wiki/overview.md`** — обновлён: новый раздел 4.5 «Тестовая инфраструктура».
- **`wiki/log.md`** — обновлён: запись о test-infrastructure.

### Блок 5. Что осталось

- Уточнить провайдера для test-VPS (предлагаю hshp.host DE-E0/DE-E1/MSK-1, дёшево).
- Получить IP/логин/порт для каждого test-VPS.
- Создать `obsidian-vault-test` репо (или ветку `test/`).
- Получить тестовые API-ключи OpenRouter.
- Сгенерировать SSH-ключи `~/.ssh/test-{1,2,3}-ed25519`.
- Задеплоить через `docker compose up -d`.

## Принятые решения

- **3 test-VPS с разными ролями:** Stage-pi, Stage-Hermes, Stage-Infra.
- **Полная изоляция от прода:** отдельные SSH-ключи, docker-сеть, vault-ветка, API-ключи, Telegram-бот.
- **Деплой через `docker compose up -d`** на каждом VPS.
- **Self-hosted LLM через ollama** на test-3 (CPU, без GPU — медленнее, но дёшево).
- **Минимальные ресурсы:** Stage-Hermes 1 vCPU / 2 ГБ, Stage-pi 2/4, Stage-Infra 2/4.
- **Внешний доступ** через SSH-туннели или Cloudflare Tunnel.
- **Хранилище кода:** отдельный репо `obsidian-vault-test` или ветка `test/` в основном репо (нужно решить).

## Созданные / изменённые артефакты

- `wiki/concepts/docker-test-stack.md` — **создан**.
- `VPS/test-1.md` — **создан** (фронтматтер пустой).
- `VPS/test-2.md` — **создан** (фронтматтер пустой).
- `VPS/test-3.md` — **создан** (фронтматтер пустой).
- `wiki/concepts/dual-agent-stack.md` — **обновлён** (test-инфраструктура в Evidence/Related/Next/Change Impact).
- `wiki/index.md` — **обновлён** (Concepts).
- `wiki/overview.md` — **обновлён** (раздел 4.5 «Тестовая инфраструктура»).
- `wiki/log.md` — **обновлён** (запись о test-infrastructure).
- `Сессии/2026-09-25/диалог-13-test-infrastructure-3-vps.md` — **этот файл**.

## Открытые вопросы

- **Провайдер test-VPS** — выбирать дешёвый (hshp.host DE-E0/DE-E1/MSK-1) или тот же, что в проде (для совместимости).
- **Vault-репо** — отдельный `obsidian-vault-test` или ветка `test/`?
- **Тестовый Telegram-бот** — нужен или нет? Если да — регистрировать через @BotFather.
- **Self-hosted LLM на test-3** — с GPU (стоит дорого) или без (медленно)?
- **CI/CD** — GitHub Actions для автотестов на test-VPS?
- **Бюджет** — 3 test-VPS × ~300–600 ₽ = 900–1800 ₽/мес дополнительно.

## Связанные wiki-страницы

- [[wiki/concepts/docker-test-stack]] — новый концепт.
- [[wiki/concepts/dual-agent-stack]] — прод-стек, от которого изолируемся.
- [[wiki/entities/hshp-host]] — пример провайдера для test-VPS.
- [[wiki/entities/docker]] — основы Docker.
- [[wiki/comparisons/2026-09-25-model-shortlist]] — выбор моделей для тестов.
- [[wiki/entities/cloudflare-tunnel]] — сетевой мост.

## Следующие шаги

- [ ] Уточнить провайдера для test-VPS.
- [ ] Получить IP/логин/порт для каждого test-VPS.
- [ ] Заполнить frontmatter `VPS/test-1.md`, `VPS/test-2.md`, `VPS/test-3.md`.
- [ ] Создать `obsidian-vault-test` репо (или ветку `test/`).
- [ ] Получить тестовые API-ключи OpenRouter.
- [ ] Сгенерировать SSH-ключи.
- [ ] Подключиться по SSH, провести hardening, установить Docker.
- [ ] Задеплоить через `docker compose up -d` по конфигам из `wiki/concepts/docker-test-stack`.
- [ ] Smoke-test 5 сценариев.

## Цитаты / формулировки, которые стоит запомнить

> «Test-VPS — **изолированная** инфраструктура, не дублирующая прод.»

> «Полная изоляция по 7 слоям: SSH-ключи, docker-сеть, vault-ветка, API-ключи, Telegram-бот, Tunnel, бэкапы.»

> «Stage-pi / Stage-Hermes / Stage-Infra — три разные роли, не три одинаковых VPS.»

## Технические детали

- **VPS-test-1** (Stage-pi): 2 vCPU / 4 ГБ / 40 ГБ, ~300–600 ₽/мес, Ubuntu 24.04, KVM.
- **VPS-test-2** (Stage-Hermes): 1 vCPU / 2 ГБ / 20 ГБ, ~150–350 ₽/мес.
- **VPS-test-3** (Stage-Infra): 2 vCPU / 4 ГБ / 60 ГБ, ~400–600 ₽/мес.
- **Docker-сеть:** `dual-agent-test` (external: true).
- **Провайдер рекомендация:** hshp.host (DE-E0/MSK-1 — дёшево, та же инфра, что и VPS-2).
- **SSH-ключи:** `~/.ssh/test-{1,2,3}-ed25519` — генерируются на локальной машине.
- **Vault-репо:** TBD (отдельный или ветка).
- **Telegram-бот test:** TBD (через @BotFather).
