# Hermes Agent

## Summary

Hermes Agent — open-source AI-агент от **Nous Research**, ориентированный на **persistent memory**, **skills** и работу через **MCP**. На сентябрь 2026 — 240 404+ stars на GitHub, 49 219+ forks, 760+ контрибьюторов, ~85 merged PR в день. Считается одним из наиболее «кумулятивных» агентов 2026 года — обучается в смысле накопления опыта, без дообучения весов.

## Current Understanding

### Мозг и провайдеры

- Подключаемая LLM (GPT, Claude, Gemini, DeepSeek, GLM, Qwen, Nemotron, Muse Spark и др.) — не привязан к одному провайдеру.
- **6 новых провайдеров в v0.21:** Actual Computer, CommandCode (GOAT/Pro/Max), Meta Model API (Muse Spark), Tencent TokenPlan, Nebius Token Factory, Ramp Router.
- **Каталог моделей** пополнился: qwen3.8-max/flash, Gemini 3.7 Flash, GLM-5.3-Flash, MiniMax M3 free, Nemotron 3.5 Lightning.
- `model_overrides` — patch context windows, pricing для любой модели без ожидания релиза.

### Ключевые свойства (Pantheon Release v0.21, 2026-08-31)

- **Bot Mode** (bundled в desktop) — каждый профиль агента получает имя, аватар, место в общем roster. Discord-style group chats с @-mention, rooms с именами и картинками.
- **`hermes peer`** — bot-to-bot DM между Hermes-агентами через handle, через CLI или внутри разговора. Replies попадают в canonical Bot Chat.
- **Cron с памятью** — scheduled jobs загружают и обновляют persistent memory, `continuity=true` несёт output предыдущего run в следующий, monitor-mode jobs пропускают LLM если ничего не изменилось.
- **Live subagent orchestration** — `delegate_task` умеет list running children, steer mid-flight, stop early with partial result. 250 iterations, 10 concurrent children по умолчанию.
- **MCP Command Center** — drag-in «paste anything» import, background health checks, fleet cost/usage overlay с schema token estimates и 30-day usage per server, `hermes://` deep links для установки с explicit confirmation.
- **Agent drives desktop browser** — больше не «смотрит в окно», а navigates, clicks, reads напрямую.

### Память и навыки

- `MEMORY.md` + `USER.md` — короткие факты о среде и пользователе.
- `session_search` — полнотекстовый поиск по прошлым диалогам (FTS5) + LLM-пересказ.
- **Skills (`SKILL.md`)** — длинные пошаговые инструкции для повторяемых задач. Авто-создаются агентом, ставятся из Skills Hub, переносятся между агентами.
- Honcho dialectic user modeling.
- Skills ecosystem совместим с открытым стандартом `agentskills.io`.

### Среда выполнения

- **6 терминальных backend'ов:** local, Docker, SSH, Singularity, Modal, Daytona, Vercel Sandbox.
- **Serverless persistence** через Daytona и Modal — среда гибернирует и просыпается on demand, costing nearly nothing.
- Можно запустить на $5 VPS или GPU-кластере.

### Каналы (20+)

CLI, Telegram, Discord, Slack, WhatsApp, Signal, Matrix, Mattermost, Email, SMS, DingTalk, Feishu, WeCom, Weixin, QQ Bot, Yuanbao, BlueBubbles, Home Assistant, Microsoft Teams, Google Chat.

### Планировщик

- Cron-выражения + формулировки на естественном языке.
- Режим без LLM (скрипт + доставка результата, без расхода токенов).
- Monitor-mode jobs с hash-suppressed change detection.
- Cron output может идти в canonical Bot Chat.

### Инструменты

- 60+ built-in tools + toolset system.
- MCP-серверы с фильтрацией инструментов.
- Browser, canvas, nodes, cron, sessions, Discord/Slack actions.
- Программный Tool Calling через `execute_code` (multi-step pipelines в zero-context-cost turns).

### Безопасность

- ⚠️ Не включать `TELEGRAM_ALLOW_ALL_USERS=true` для публичного бота.
- ⚠️ Не включать `HERMES_YOLO_MODE=1` в проде.
- **Protected agent-instruction files** (AGENTS.md, skills, memory stores) — теперь всегда требуют write approval (v0.21).
- Deep redaction sweep — secret-leak gaps в terminal errors, .env reads, checkpoints, ACP logs закрыты.
- Windows destructive commands теперь trip approval system.

### Системные требования

- Минимум: 1 ГБ RAM, 1 ядро.
- Комфорт: 2–4 ГБ RAM, 2 ядра.
- Браузерная автоматизация (Chromium): ≥ 2 ГБ дополнительно.

### Развёртывание (на примере Amvera)

- Через `amvera.yml` + официальный образ `nousresearch/hermes-agent:latest`.
- Переменные окружения: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ALLOWED_USERS`, `OPENROUTER_API_KEY` (или `OPENAI_API_KEY`), опционально `SERPAPI_KEY`.
- `persistenceMount: /opt/data` — обязательно, иначе навыки и память теряются при пересборке.
- Стартовые команды: `/sethome`, `/model <модель>`.

### Миграция с OpenClaw

`hermes claw migrate` — автоимпорт из `~/.openclaw`:

- SOUL.md, Memories (MEMORY.md, USER.md).
- Skills → `~/.hermes/skills/openclaw-imports/`.
- Command allowlist, Messaging settings, API keys (Telegram, OpenRouter, OpenAI, Anthropic, ElevenLabs), TTS assets, AGENTS.md.

Флаги: `--dry-run`, `--preset user-data`, `--overwrite`.

### Частые проблемы

- Бот запустился, но не отвечает → проверить `TELEGRAM_BOT_TOKEN` и `TELEGRAM_ALLOWED_USERS`; не запускать два инстанса с одним Telegram-токеном.
- HTTP 402 / max_tokens — бесплатные маршруты OpenRouter не покрывают лимит. Решение: уменьшить лимит вывода, выбрать другую модель.
- `No inference provider configured` → выполнить `/model`.
- После пересборки пропали навыки/память → проверить `persistenceMount: /opt/data`.

### Research-ready

- Batch trajectory generation.
- Trajectory compression для обучения следующего поколения tool-calling моделей.
- **Atropos** для RL.
- Lab за [[wiki/concepts/llm-wiki-template|мысль]]: Nous Research — создатели моделей Hermes, Nomos, Psyche.

## Evidence

- [[wiki/sources/2026-09-19-hermes-agent-overview]] — обзорная статья (Habr, июль 2026).
- [[wiki/sources/2026-09-24-hermes-v0.21]] — release notes v0.21.0 (Pantheon Release, 2026-08-31).
- [[wiki/concepts/agent-memory-skills]] — концепт памяти и навыков, реализованный в Hermes.
- [[wiki/concepts/mcp-basics]] — MCP, в т. ч. MCP Command Center.
- [[wiki/sources/2026-09-18-ai-vps-control]] — практический кейс развёртывания.
- [[wiki/entities/amvera-cloud]] — пример платформы деплоя.
- [[wiki/entities/openrouter]] — пример LLM-провайдера.
- [[wiki/entities/cloudflare-tunnel]] — безопасный доступ к дашборду.
- [[wiki/entities/openclaw]] — предыдущий стек автора кейса; есть прямой мост миграции.
- [[wiki/entities/cursor]] — упомянут как GUI-альтернатива.
- [[wiki/entities/windsurf]] — упомянут как agentic IDE-альтернатива.

## Related Pages

- [[wiki/concepts/agent-memory-skills]]
- [[wiki/concepts/mcp-basics]]
- [[wiki/sources/2026-09-18-ai-vps-control]]
- [[wiki/overview]] — главный герой раздела «Агенты».

## Contradictions / Uncertainty

- В разных кейсах автор хвалит Hermes и сравнивает с OpenClaw. Стоит собирать **собственные** наблюдения, а не полагаться на маркетинг.
- Версия Docker-образа меняется быстро — конкретные версии фиксируем в source-summary, а не в entity-странице.
- Serverless persistence (Daytona/Modal) — реальная стоимость сна пока не очевидна.

## Next Questions

- Реальный overhead по памяти при 6 параллельных сабагентах (по кейсу «Гермес у меня дорос»).
- Совместим ли Hermes с российскими LLM (YandexGPT, GigaChat).
- Насколько стабилен Bot Mode в проде.
- Что даёт `hermes peer` для cross-bot коммуникации в кейсах команды.
