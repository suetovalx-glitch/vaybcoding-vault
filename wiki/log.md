# log

Append-only журнал операций по базе знаний. Хронологический порядок, без переписывания истории.

## 2026-09-24

### Первая полная ревизия (`lint` + `ingest`)

- Просканированы `raw/` и `raw/Clippings/`.
- Обнаружены новые и забытые материалы: LLM Wiki ×3 (Pi Agent, VS Code, Docker), статья про Hermes Agent, инструкция по установке Hermes, Telegram-черновики (CLAUDE.md, начальный промт для pi, стратегия AI-VPS, Hermes Desktop SSH-туннель).
- Создана инфраструктура `wiki/` по схеме из `CLAUDE.md`: `index.md`, `log.md`, `overview.md`, `sources/`, `concepts/`, `entities/`, `queries/`, `lint-reports/`, `comparisons/`, `timelines/`.
- Созданы source-summary: LLM Wiki ×3, Hermes overview, project CLAUDE.md, prompts-for-pi, ai-vps-control.
- Созданы concept-notes: LLM Wiki шаблон, agent-memory-skills, MCP, prompt-pattern-json-out, raw→wiki pipeline.
- Созданы entity-cards: Hermes Agent, Amvera Cloud, OpenRouter, VS Code, Docker, Pi Agent, OpenClaw, Cloudflare Tunnel.
- Помечены как архив-only (без wiki-интеграции в этом сеансе): SQL-шпаргалка, Docker-шпаргалка, MinIO/S3-материалы, OpenAPI/Swagger, шаблоны VPS, meshworks, материалы про роутер Cudy, AlisaAI/Templaters, YC CLI.
- Идентифицированы дубли: `raw/Без названия.md` и `raw/Бещенная задума.md` — частично пересекаются с `raw/Бешенная задумка.md` и заметкой про Hermes Desktop SSH, но содержат уникальные куски; оставлены как есть в `raw/`, в wiki унесены только ценные уникальные тезисы.
- Подтверждено: внешние ссылки на Notion (`raw/Telegram/Промт установки «Второго мозга»`) недоступны — нужен локальный экспорт, иначе wiki-страницу по ним не построить.

### Открытые вопросы

- Куда разместить `wiki/overview.md` и стоит ли он в корне `wiki/` или на верхнем уровне проекта (как требует CLAUDE.md — `wiki/overview.md`)? Решено: в `wiki/`.
- Переносить ли `raw/Telegram/documents/CLAUDE.md` в `raw/sources/` как канонический источник? Решено: да, через source-summary в `wiki/sources/`, при этом оригинал оставляем на месте (правило CLAUDE.md — `raw/` неизменяем).
- Нужно ли отдельное `wiki/_about.md` обновлять под новую структуру? Решено: да, обновим после создания основного массива страниц.

### Дополнение базы из веб-источников (по команде «Дополни базу сам»)

- Просканированы `raw/online/` (создана как новая зона для веб-источников).
- Источники: GitHub openclaw/openclaw, GitHub NousResearch/hermes-agent (v0.21.0), независимые обзоры Cursor и Windsurf, OpenRouter pricing/free, Amvera Cloud docs и независимый обзор.
- Создано 6 source-summary в `wiki/sources/`: openclaw, cursor, windsurf, hermes-v0.21, openrouter, amvera-cloud.
- Stub-страница `wiki/entities/openclaw` переписана в полноценную entity-страницу.
- Созданы новые entity: `wiki/entities/cursor`, `wiki/entities/windsurf`.
- Обновлены entity: hermes-agent (Bot Mode, MCP Command Center, cron memory, 6 новых провайдеров, serverless persistence), amvera-cloud (тарифы, регионы, проксирование, LLM API), openrouter (free-tier лимиты, ротация моделей, отсутствие promotional credits).
- Обновлены concept: agent-memory-skills (cron memory, FTS5, Honcho, Bot Mode), mcp-basics (MCP Command Center).
- Обновлён `wiki/index.md` — добавлены ссылки на новые source-страницы.
- Обновлён `wiki/overview.md` — добавлены Cursor, Windsurf, OpenClaw в карту «AI IDE» и «Агенты».
- Создан новый lint-отчёт `wiki/lint-reports/2026-09-24-web-supplement.md`.

### Открытые вопросы (дополнение)

- Нужно ли заводить отдельные wiki-страницы под Cursor Rules, .cursorrules, .windsurf/, OpenClaw SOUL.md/TOOLS.md — это частные форматы, по ним пока достаточно упомянуть в entity-страницах.

### Шортлист моделей (2026-09-25)

- Создан файл `wiki/comparisons/2026-09-25-model-shortlist.md` — сравнение ~40 моделей из списка пользователя с ценами, контекстом, AI-index и рекомендациями под наши роли (дефолт, flash, coding-эксперт, flagship, vision, long-context).
- Создан файл `wiki/queries/2026-09-25-model-shortlist.md` — durable-ответ на исходный вопрос «какие модели использовать для вайбкодинга».
- Обновлены `wiki/index.md` (разделы Comparisons/Queries) и `wiki/overview.md` (новый раздел 5 «Шортлист моделей»).
- Источник цен и индексов — `https://openrouter.ai/api/v1/models`, проверено 2026-09-25.
- Замечание: `qwen/qwen3.6:27b`, `qwen/qwen3.6:35b-a3b`, `qwen/qwen3-embedding:8b`, `nvidia/nemotron-3-ultra` — в openrouter-каталоге на эту дату не подтверждены; рекомендованы замены из серии `qwen3.8-*` и проверка наличия nemotron через NVIDIA NIM.
- Текущая активная модель — `wormsoft/minimax-m3` ($0). Рекомендация для смены дефолта — `xiaomi/mimo-v2.6-pro` (тоже $0 через xiaomi-token-plan-cn) или `openai/gpt-6-luna` ($0.5/M out).

### Dual-Agent Stack: Hermes + pi на двух VPS (2026-09-25)

- Создан `wiki/concepts/dual-agent-stack.md` — полный концепт развёртывания: архитектурная Mermaid-диаграмма, RACI-таблица ролей, требования к VPS-1 (Hermes, оркестратор) и VPS-2 (pi-coding-agent, исполнитель), готовые `docker-compose.yml`/`systemd unit`/`cloudflared` конфиги, JSON-RPC протокол `delegate_task`, синхронизация памяти и скиллов, план развёртывания из 10 шагов.
- Ключевые решения: (а) VPS-2 приватный, без открытых портов, доступ только через Tunnel + service-token; (б) только pi-coding-agent пишет в `wiki/`; (в) Cloudflare Tunnel как единая сетевая связность; (г) OpenRouter как общий LLM-провайдер.
- Обновлён `wiki/index.md` — добавлена ссылка в раздел Concepts.
- Запланированы (ещё не созданы): `VPS/hermes.md`, `VPS/pi-agent.md` — заметки под конкретные инстансы, будут заполняться после деплоя.
- Открытые вопросы вынесены в концепт-страницу: VPS-3 для бэкапов, serverless vs stateful для pi-coding-agent, fallback на локальный pi, версионирование протокола `delegate_task`.

### Провайдер VPS-2 определён: hshp.host DE-E2 (2026-09-25)

- Пользователь прислал ссылку на биллинг `https://my.hshp.host/billmgr#/vds/item/1950834/access`. Авторизоваться в чужой биллинг не могу, но собрал публичную картину по провайдеру.
- **hshp.host** — российский хостер с 2021, BILLmanager + VMManager + KVM, локации RU/DE/FI/FR.
- **Создана entity-страница** `wiki/entities/hshp-host.md` — обзор провайдера, тарифы, отзывы (2.6/5 kreohost, 1.6/5 otzovik — низкая репутация, но приемлемо для нашей задачи).
- **Создана заметка `VPS/pi-agent.md`** под конкретный инстанс: тариф DE-E2, id 1950834, локация Германия (фактически — Финляндия по отзывам), 2 vCPU / 4 ГБ / 60 ГБ / 500 Мбит/с, ~600 ₽/мес. Фронтматтер пустой — ждём IP/логин/пароль от пользователя.
- **VPS-1** (Hermes) — AdminVPS, Финляндия — уже куплен, но IP/логин/порт так и не присланы. Заметку `VPS/hermes.md` пока не заводим.
- Обновлён `wiki/concepts/dual-agent-stack.md` — добавлена ссылка на hshp.host entity и факт про DE-E2.
- Обновлены `wiki/index.md` и `wiki/overview.md` — добавлена ссылка на нового провайдера.
- **Зафиксировано главное:** VPS-2 уже куплен и оплачен, докупка VPS-1 не требуется. Блокер остаётся только в виде отсутствующих данных для входа.
- **Открытый вопрос:** репутация hshp.host низкая (10% рекомендуют). Для экспериментального деплоя — приемлемо; для прод 24/7 — рискованно.

### Orca ADE — опциональный GUI-фронтенд (2026-09-25)

- Пользователь прислал ссылку `https://www.onorca.dev`. Проверил: это **Orca ADE (Agent Development Environment)** от **Stably, Inc.** (Y Combinator), 78.1k stars на GitHub, MIT, бесплатный. Worktree-first IDE, который запускает несколько AI-агентов параллельно в изолированных git worktrees.
- **Ключевое:** в списке поддерживаемых агентов **прямо есть** `Pi` и `Hermes Agent` — значит, оба наших агента вписываются без интеграционных костылей.
- **Создана entity-страница** `wiki/entities/orca-ade.md` — полное описание, отличия от Cursor/Windsurf, как интегрировать в dual-agent-stack.
- **Обновлён** `wiki/concepts/dual-agent-stack.md` — добавлен Orca ADE как опциональный GUI-фронтенд на локальной машине, через SSH к VPS-1 и VPS-2.
- **Обновлены** `wiki/index.md` (Entities) и `wiki/overview.md` (Инфраструктура).
- **Что меняется:** VPS-1 и VPS-2 остаются отдельными VPS-ами; Orca — это GUI-фронтенд, не замена VPS. Cloudflare Tunnel, JSON-RPC `delegate_task`, MCP — всё работает как было.
- **Следующий шаг:** установить Orca на локальной машине (Windows), проверить работу SSH к VPS, попробовать запустить Hermes и pi-coding-agent как «любой CLI agent».

### Test Infrastructure: 3 VPS как Docker-машина (2026-09-25)

- Пользователь сказал «у нас есть ещё 3 VPS, я думаю использовать его как docker-машину для тестов».
- **Создан** `wiki/concepts/docker-test-stack.md` — концепт test-инфраструктуры: 3 VPS с разными ролями (Stage-pi, Stage-Hermes, Stage-Infra), Mermaid-диаграмма, docker-compose конфиги, таблица изоляции от прода, план развёртывания.
- **Обновлён** `wiki/concepts/dual-agent-stack.md` — добавлен слой test-инфраструктуры в Evidence / Related / Next / Change Impact.
- **Обновлены** `wiki/index.md` (Concepts) и `wiki/overview.md` (новый раздел 4.5 «Тестовая инфраструктура»).
- **Что планируется:**
  - VPS-test-1 = staging pi-coding-agent (2 vCPU / 4 ГБ).
  - VPS-test-2 = staging Hermes (1 vCPU / 2 ГБ).
  - VPS-test-3 = docker-compose стенды + бенчмарки моделей (2 vCPU / 4 ГБ).
- **Изоляция от прода:** отдельные SSH-ключи, docker-сеть `dual-agent-test`, vault-ветка `test/` или отдельный `obsidian-vault-test` репо, тестовые API-ключи.
- **Что осталось:** уточнить провайдера для test-VPS, получить IP/логин/порт, создать vault-репо test, получить тестовые API-ключи.

### NetBird как mesh-VPN между VPS (2026-09-25)

- Пользователь спросил «мы можем использовать netbird для связи».
- Создана entity-страница `wiki/entities/netbird.md` — полное описание mesh-VPN на WireGuard (BSD-3, self-hosted, поддержка Linux/Windows/macOS/mobile/Docker/routers), архитектура control-сервера, требования (1 vCPU / 2 ГБ RAM, домен, TCP 80/443 + UDP 3478), сравнение с Cloudflare Tunnel, три сценария интеграции (замена / гибрид / только для test).
- Обновлены `wiki/concepts/dual-agent-stack.md` и `wiki/concepts/docker-test-stack.md` — добавлен NetBird в Evidence и Related Pages.
- Обновлены `wiki/index.md` (Entities) и `wiki/overview.md` (Инфраструктура).
- **Что предлагается:** гибрид (Cloudflare Tunnel для публичного HTTPS-фронтенда + NetBird для mesh-VPN между VPS). Это лучшее из двух миров: Cloudflare силён в HTTPS-edge, NetBird — в peer-to-peer WireGuard.
- **Что нужно для внедрения:** ещё 1 VPS для NetBird control-сервера (~300 ₽/мес), публичный домен `netbird.example.com`, Let's Encrypt.
- **Открытый вопрос:** выбираем NetBird или остаёмся на Cloudflare Tunnel? Бюджет на ещё 1 VPS — есть?
