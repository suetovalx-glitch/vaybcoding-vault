# Test Infrastructure: 3 VPS как Docker-машина для тестов

## Source Metadata

- **Дата:** 2026-09-25.
- **Тип:** synthesis/concept (концепт тестовой инфраструктуры).
- **Сырьё:**
  - [[wiki/concepts/dual-agent-stack]] — прод-стек (Hermes + pi на 2 VPS).
  - [[wiki/entities/hshp-host]] — пример провайдера VPS.
  - `raw/Без названия.md`, `raw/Без названия 1.md` — старые задумки про `vps-docker` и Node-RED/Mosquitto.
  - `VPS/AdminVPS.md` — шаблон VPS-заметки.
- **Аналитик:** pi-coding-agent + текущая модель `wormsoft/minimax-m3`.

## Summary

Дополнительно к прод-стеку (Hermes VPS-1 + pi-coding-agent VPS-2) заводим **3 отдельных VPS** как **изолированную тестовую инфраструктуру** на Docker. Каждый VPS имеет свою роль: (1) staging pi-coding-agent, (2) staging Hermes, (3) docker-compose-стенды + бенчмарки моделей. **Полная изоляция от прода**: отдельные SSH-ключи, отдельная docker-сеть, отдельная ветка vault-репо (или отдельный тестовый репо), отдельные API-ключи провайдеров (или подключение через OpenRouter `HTTP-Referer` заголовок).

## Тезисы

1. **VPS-test-1** = staging pi-coding-agent (Stage-pi). Точная копия прод-VPS-2 по ресурсам и софту, но с тестовыми данными и тестовым API-ключом.
2. **VPS-test-2** = staging Hermes (Stage-Hermes). Точная копия прод-VPS-1, для экспериментов с оркестратором перед выкаткой.
3. **VPS-test-3** = docker-compose-стенды (Stage-Infra). Здесь крутятся изолированные compose-проекты: Node-RED, Mosquitto, Traefik, self-hosted LLM (llama.cpp / ollama), бенчмарки моделей.
4. **Полная изоляция** от прода: отдельные SSH-ключи, отдельные docker-сети, отдельная ветка vault-репо, отдельные API-ключи.
5. **Минимальные ресурсы** на каждом VPS (2 vCPU / 2–4 ГБ RAM), чтобы не раздувать бюджет.
6. **Деплой** через `docker compose up -d` из git-репо с тестовыми конфигами.

## Архитектура

```mermaid
flowchart TB
    subgraph Prod["Прод-стек (dual-agent-stack)"]
        direction LR
        VPS1["VPS-1 Hermes<br/>AdminVPS / FI"]
        VPS2["VPS-2 pi-coding-agent<br/>hshp.host DE-E2"]
    end

    subgraph Test["Test-инфраструктура (изолировано)"]
        direction LR
        T1["VPS-test-1<br/>Stage-pi<br/>(staging pi-coding-agent)"]
        T2["VPS-test-2<br/>Stage-Hermes<br/>(staging Hermes)"]
        T3["VPS-test-3<br/>Stage-Infra<br/>(docker-compose-стенды)"]
    end

    subgraph User["Пользователь"]
        OBS["Локальный Obsidian"]
    end

    OBS -- "git push (main — прод)" --> GitProd[("git remote<br/>obsidian-vault-private")]
    OBS -- "git push (test-branch)" --> GitTest[("git remote<br/>obsidian-vault-test или отдельная ветка")]

    GitProd -- "git pull" --> VPS1
    GitProd -- "git pull" --> VPS2

    GitTest -- "git pull" --> T1
    GitTest -- "git pull" --> T2
    GitTest -- "git pull" --> T3

    T1 -. "отдельный API-key" .-> OR["OpenRouter / Wormsoft / Xiaomi"]
    T2 -. "отдельный API-key" .-> OR
    T3 -. "тестовые ключи" .-> OR

    T3 -- "docker compose" --> NR["Node-RED"]
    T3 -- "docker compose" --> MQ["Mosquitto MQTT"]
    T3 -- "docker compose" --> LL["Self-hosted LLM<br/>(llama.cpp / ollama)"]
    T3 -- "docker compose" --> BM["Бенчмарки моделей"]
```mermaid

### Распределение ролей по VPS

| VPS | Роль | Ресурсы (минимум) | Docker-сервисы |
| --- | --- | --- | --- |
| **VPS-test-1** (Stage-pi) | Staging копия pi-coding-agent | 2 vCPU / 4 ГБ / 40 ГБ | `pi-coding-agent` (systemd в контейнере), `cloudflared` |
| **VPS-test-2** (Stage-Hermes) | Staging копия Hermes | 1 vCPU / 2 ГБ / 20 ГБ | `nousresearch/hermes-agent`, `cloudflared` |
| **VPS-test-3** (Stage-Infra) | docker-compose стенды | 2 vCPU / 4 ГБ / 60 ГБ | `node-red`, `mosquitto`, `traefik`, `llama.cpp`, `benchmarks` |

### Что НЕ делаем

- **Не шарим SSH-ключи с прод.** У каждого test-VPS свой ключ.
- **Не шарим vault-репо напрямую.** Либо отдельный репо (`obsidian-vault-test`), либо отдельная ветка `test/`, в которую пушим тестовые конфиги.
- **Не используем те же API-ключи провайдеров, что в проде.** Либо отдельные ключи в личном кабинете OpenRouter (бесплатные), либо тестовые заголовки `HTTP-Referer` для маршрутизации.
- **Не открываем порты в мир.** Только через Cloudflare Tunnel (или localhost-only для Stage-Infra).

## Конфигурация

### VPS-test-1 (Stage-pi)

`/opt/pi-test/docker-compose.yml`:

```yaml
services:
  pi-coding-agent:
    image: node:22-bookworm-slim
    container_name: pi-test
    restart: unless-stopped
    working_dir: /app
    volumes:
      - /opt/pi-test:/app
      - /opt/vault-test:/opt/vault:ro
      - /tmp/.X11-unix:/tmp/.X11-unix
    environment:
      NODE_ENV: production
      OPENROUTER_API_KEY: ${TEST_OPENROUTER_API_KEY}
      VAULT_PATH: /opt/vault
      PI_AGENT_TOKEN: ${PI_AGENT_TEST_TOKEN}
    command: sh -c "npm ci && node dist/rpc.js"
    networks: [test-net]

  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflared-test-pi
    restart: unless-stopped
    command: tunnel --no-autoupdate run
    environment:
      TUNNEL_TOKEN: ${CLOUDFLARE_TUNNEL_TOKEN_PI_TEST}
    networks: [test-net]

networks:
  test-net:
    driver: bridge
    name: dual-agent-test
```yaml

### VPS-test-2 (Stage-Hermes)

`/opt/hermes-test/docker-compose.yml`:

```yaml
services:
  hermes:
    image: nousresearch/hermes-agent:latest
    container_name: hermes-test
    restart: unless-stopped
    volumes:
      - /opt/data/hermes-test:/root/.hermes
      - /opt/vault-test:/opt/vault:ro
    environment:
      TELEGRAM_BOT_TOKEN: ${TELEGRAM_BOT_TOKEN_TEST}
      TELEGRAM_ALLOWED_USERS: ${TELEGRAM_ALLOWED_USERS_TEST}
      OPENROUTER_API_KEY: ${TEST_OPENROUTER_API_KEY}
    command: sh -c "cd /opt/vault && git pull --rebase && hermes gateway start"
    networks: [test-net]
```yaml

### VPS-test-3 (Stage-Infra)

`/opt/infra-test/docker-compose.yml`:

```yaml
services:
  node-red:
    image: nodered/node-red:latest
    container_name: nodered-test
    restart: unless-stopped
    ports: ["127.0.0.1:1880:1880"]
    volumes:
      - /opt/infra-test/node-red/data:/data
    networks: [test-net]

  mosquitto:
    image: eclipse-mosquitto:2
    container_name: mosquitto-test
    restart: unless-stopped
    ports: ["127.0.0.1:1883:1883"]
    volumes:
      - /opt/infra-test/mosquitto/config:/mosquitto/config
      - /opt/infra-test/mosquitto/data:/mosquitto/data
    networks: [test-net]

  traefik:
    image: traefik:v3
    container_name: traefik-test
    restart: unless-stopped
    ports: ["127.0.0.1:8080:8080"]
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /opt/infra-test/traefik:/etc/traefik
    networks: [test-net]

  ollama:
    image: ollama/ollama:latest
    container_name: ollama-test
    restart: unless-stopped
    # GPU passthrough if available, otherwise CPU only
    # deploy:
    #   resources:
    #     reservations:
    #       devices:
    #         - driver: nvidia
    #           count: 1
    #           capabilities: [gpu]
    volumes:
      - /opt/infra-test/ollama:/root/.ollama
    networks: [test-net]

networks:
  test-net:
    external: true
    name: dual-agent-test
```yaml

## Изоляция от прода

| Слой | Прод | Test |
| --- | --- | --- |
| **SSH-ключи** | `~/.ssh/{hermes,pi-agent}-ed25519` | `~/.ssh/test-{1,2,3}-ed25519` |
| **Vault-репо** | `obsidian-vault-private` (main) | `obsidian-vault-test` или ветка `test/` |
| **API-ключи** | Прод-ключи OpenRouter/Wormsoft | Тестовые ключи (или free-tier) |
| **Docker-сеть** | `dual-agent-prod` | `dual-agent-test` |
| **Cloudflare Tunnel** | `*.prod.example.com` | `*.test.example.com` |
| **Telegram** | Прод-бот | Отдельный тестовый бот (`@MyTestBot`) |
| **Бэкапы** | Ежедневно на VPS-1 | По запросу (тестовые данные не критичны) |

## Безопасность

- **UFW на каждом VPS:** `default deny incoming`, `allow out 443/53`. SSH — только с локальной машины по ключу.
- **Docker socket** монтируется только в Traefik (read-only).
- **Secrets** через `docker-compose secrets` или `.env` (chmod 600).
- **Логи** через `docker compose logs -f` → journald.

## План развёртывания (5 шагов)

1. **Завести 3 VPS** через шаблон `VPS/AdminVPS.md` (`VPS/test-1.md`, `VPS/test-2.md`, `VPS/test-3.md`).
2. **Сгенерировать 3 SSH-ключа** на локальной машине, добавить в личные кабинеты.
3. **Создать vault-репо test** (или ветку `test/`) — `obsidian-vault-test`.
4. **Задеплоить** через `docker compose up -d` по конфигам выше.
5. **Smoke-test 5 сценариев**:
   - (a) `delegate_task` от Stage-Hermes к Stage-Stage-pi через Cloudflare Tunnel.
   - (b) Парсинг источника в `raw/` → создание source-summary в `wiki/`.
   - (c) Открытие сайта через `chrome-devtools` → скриншот.
   - (d) Cron-task → отчёт в тестовый Telegram.
   - (e) Self-hosted LLM через ollama на Stage-Infra → сравнение с cloud-LLM.

## Что тестируем

| Тест | Цель | VPS |
| --- | --- | --- |
| Обновление pi-coding-agent | Проверить, что новая версия не ломает прод | test-1 |
| Обновление Hermes | То же для Hermes | test-2 |
| Миграция vault-репо | Проверить новый формат хранения | test-1 |
| Self-hosted LLM | Сравнить с cloud, оценить экономию | test-3 |
| Бенчмарки моделей | Замерить качество на наших задачах | test-3 |
| Docker-compose upgrade | Проверить новые версии Traefik, Node-RED | test-3 |
| Telegram-бот фичи | Протестировать новые команды | test-2 |

## Что осталось

- [ ] Уточнить провайдера для test-VPS (hshp.host? AdminVPS? Amvera? Aéza?).
- [ ] Получить IP/логин/порт для каждого test-VPS.
- [ ] Создать `obsidian-vault-test` репо (или ветку `test/`).
- [ ] Получить тестовые API-ключи OpenRouter.
- [ ] Сгенерировать SSH-ключи для test-VPS.
- [ ] Задеплоить через `docker compose up -d`.

## Evidence

- [[wiki/concepts/dual-agent-stack]] — прод-стек, от которого изолируемся.
- [[wiki/entities/netbird]] — mesh-VPN, альтернатива Cloudflare Tunnel для mesh между test-VPS.
- [[wiki/entities/hshp-host]] — пример провайдера (можно использовать для test-VPS).
- `raw/Без названия.md`, `raw/Без названия 1.md` — старые задумки про `vps-docker` (Node-RED, Mosquitto).
- `VPS/AdminVPS.md` — шаблон VPS-заметки.
- `VPS/ssh-command.md` — Templater SSH-команд.

## Related Pages

- [[wiki/overview]] — карта базы.
- [[wiki/concepts/dual-agent-stack]] — прод-стек.
- [[wiki/entities/hshp-host]] — пример провайдера.
- [[wiki/entities/netbird]] — mesh-VPN, альтернатива Cloudflare Tunnel для test-стека.
- [[wiki/entities/docker]] — основы Docker.
- [[wiki/entities/cloudflare-tunnel]] — сетевой мост.
- [[wiki/comparisons/2026-09-25-model-shortlist]] — выбор моделей для тестов.

## Contradictions / Uncertainty

- **Стоимость** — 3 test-VPS × ~300–600 ₽/мес = 900–1800 ₽/мес дополнительно. Нужно решить, есть ли бюджет.
- **Провайдер test-VPS** — выбирать дешёвый (hshp.host DE-E0 за 209 ₽) или тот же, что в проде (для совместимости).
- **Self-hosted LLM на Stage-Infra** — без GPU будет медленно. Если VPS-3 с GPU — стоит дорого. Может быть, лучше использовать cloud-LLM и для тестов.
- **Test vault-repo** — отдельный репо или ветка? Отдельная ветка проще, но смешивает прод и тест в одном коммите. Отдельный репо чище.
- **Telegram-бот для тестов** — отдельный бот через `@BotFather` или не поднимать Telegram на test вообще.

## Next Questions

- Какой провайдер для 3 test-VPS? (предлагаю hshp.host DE-E0/DE-E1/MSK-1, чтобы не раздувать расходы).
- Отдельный vault-repo или ветка `test/`?
- Тестовый Telegram-бот — нужен или нет?
- Self-hosted LLM на test-3 — с GPU или без?
- Делать ли CI/CD (GitHub Actions) для автотестов на test-VPS?

## Change Impact on Wiki

- Создан `wiki/concepts/docker-test-stack.md` — концепт test-инфраструктуры.
- Будет обновлён [[wiki/concepts/dual-agent-stack]] — добавлен слой test-инфраструктуры.
- Будут созданы `VPS/test-1.md`, `VPS/test-2.md`, `VPS/test-3.md` (фронтматтер пустой).
- Обновлён `wiki/index.md` (Concepts).
- Обновлён `wiki/overview.md` (раздел «Тестовая инфраструктура»).
- Запись в `wiki/log.md`.
- Запись в `Сессии/2026-09-25/диалог-13-test-infrastructure.md`.
- Обновление `Сессии/2026-09-25/_summary.md`.
- Обновление `Отчет/2026-09-25-итог-дня.md`.
