# Сессия 10: Шортлист моделей + Dual-Agent Stack

**Дата:** 2026-09-25
**Время:** ~02:00 (ночная сессия)
**Ассистент:** MiniMax-M3 (wormsoft)
**Канал:** pi-coding-agent CLI (chat)

## Контекст

После фиксации итога дня (диалог 09) пользователь продолжил работать в той же сессии. Попросил (а) посмотреть список моделей и решить, какие лучше использовать для наших задач, и составить отчёт в Obsidian; (б) обсудить, может ли pi-coding-agent работать вместе с Hermes Agent; (в) спроектировать развёртывание на двух отдельных VPS (Hermes + pi) с распределением ролей.

## Что обсудили

### Блок 1. Список моделей и шортлист

- Пользователь прислал список из ~40 моделей openrouter-семейства: Anthropic (Fable/Haiku/Opus/Sonnet), DeepSeek V4 (Flash/Pro), Google Gemma 4 31B, Kimi (K2.6/K2.7-code/K3), MiniMax-M3, Muse Spark 1.3, NVIDIA Nemotron 3 Ultra, OpenAI GPT-5.6/6 (Luna/Sol/Terra/Astra), OpenAI gpt-oss, Qwen (qwen3-embedding, qwen3.6, qwen3.8), Xiaomi MiMo v2.6 (Flash/Pro), Z.ai GLM-5.3.
- Запрошен openrouter-каталог через `fetch_content` к `https://openrouter.ai/api/v1/models`, проверены цены/контексты/AI-index.
- Ключевые находки: `qwen/qwen3.6:*` и `qwen/qwen3-embedding:8b` в openrouter-каталоге не подтверждены (есть только `qwen3.8-*`); `nvidia/nemotron-3-ultra` тоже не в openrouter; `gpt-5.6-*` — алиасы на GPT-6 семейство.
- Создан `wiki/comparisons/2026-09-25-model-shortlist.md` — развёрнутый отчёт по всем моделям с ценами и рекомендациями по ролям.
- Создан `wiki/queries/2026-09-25-model-shortlist.md` — короткий durable-ответ: «не одна модель, а три роли + один fallback».
- Обновлены `wiki/index.md` (разделы Comparisons/Queries) и `wiki/overview.md` (новый раздел 5 «Шортлист моделей»).

### Блок 2. Связка с Hermes Agent

- Запрошены: может ли pi-coding-agent работать вместе с Hermes.
- Подтверждено: **да, уже почти работает** — оба используют один openrouter, оба подключаются к MCP-серверам, у обоих есть skills-механизмы.
- Перечислены 6 точек соприкосновения: общий LLM-провайдер, MCP-протокол, skills (SKILL.md / agentskills.io), память (MEMORY.md ↔ Сессии/), subagents (delegate_task ↔ pi-subagents), каналы (20+ у Hermes ↔ TUI/CLI у нас).
- Описаны 5 конкретных сценариев «pi + hermes» с распределением, кто что делает.

### Блок 3. Dual-Agent Stack на двух VPS

- Пользователь уточнил: «на отдельных VPS, нужно решить роли и взаимодействие».
- Уточнены 5 ключевых вопросов (выбор на дефолтах: Amvera, Telegram как канал, OpenRouter как общий провайдер, Cloudflare Tunnel как связь).
- Создан `wiki/concepts/dual-agent-stack.md` — полный концепт:
  - Mermaid-диаграмма архитектуры (User → VPS-1 Hermes → VPS-2 pi + Cloudflare Tunnel + git remote).
  - Network topology: 0 открытых портов у VPS-2.
  - RACI-таблица ролей (Hermes = Telegram/cron/parsing; pi = браузер/wiki/code; Obsidian = approve).
  - Требования к VPS: Hermes 1–2 vCPU / 1–2 ГБ RAM, pi 2–4 vCPU / 4–8 ГБ RAM.
  - Готовые конфиги: `docker-compose.yml`, `pi-agent.service`, `cloudflared/config.yml`, `~/.pi/agent/models.json`.
  - JSON-RPC протокол `delegate_task` с методами `delegate_task/status/stop/steer/read_file/git_log`.
  - Memory & Skills sync: `~/.hermes/MEMORY.md` ↔ vault-repo ↔ `~/.pi/agent/`, last-writer-wins.
  - Безопасность: таблица рисков + bash-скрипт hardening VPS-2.
  - План развёртывания из 10 шагов.
  - Распределение моделей между VPS.
  - Smoke-test через `curl` и `hermes peer delegate`.

## Принятые решения

- **Не одна модель, а три роли:** дефолт (`gpt-6-luna` или `mimo-v2.6-pro`), flash (`glm-5.3-flash` / `deepseek-v4-flash`), coding-эксперт (`claude-fable-5.1` / `kimi-k2.7-code`).
- **Бесплатные zero-cost варианты:** `wormsoft/minimax-m3` (текущая), `wormsoft/mine/onlycode`, `wormsoft/mine/vision`, `google/gemma-4-31b-it`.
- **Что НЕ брать:** `claude-opus-5` (проигрывает Opus 5.5 по той же цене), `claude-haiku-4.5` (всего 200k), `kimi-k2.6` (вытеснен K3), `gpt-5.6-*` (алиасы), `qwen/qwen3.6:*` (нет в openrouter), `nvidia/nemotron-3-ultra` (нет в openrouter).
- **Dual-Agent Stack на дефолтах:** VPS-1 Hermes (Amvera Micro, ~170–500 ₽/мес), VPS-2 pi-coding-agent (Amvera Tier 2, ~600–1500 ₽/мес), Cloudflare Tunnel как единая связность, OpenRouter как общий LLM, vault-репо как source of truth.
- **pi-coding-agent — единственный writer в `wiki/`.** Hermes только кладёт сырьё в `raw/`.
- **Без открытых портов у VPS-2**, доступ только через Cloudflare Tunnel + service-token.
- **VPS-3 для бэкапов** пока отложен — решить позже (открытый вопрос).

## Созданные / изменённые артефакты

- `wiki/comparisons/2026-09-25-model-shortlist.md` — **создан**, полный отчёт по ~40 моделям с ценами и рекомендациями.
- `wiki/queries/2026-09-25-model-shortlist.md` — **создан**, короткий durable-ответ.
- `wiki/index.md` — **обновлён**: добавлены разделы Comparisons и Queries.
- `wiki/overview.md` — **обновлён**: добавлен раздел 5 «Шортлист моделей».
- `wiki/concepts/dual-agent-stack.md` — **создан**, полный концепт развёртывания на двух VPS.
- `wiki/log.md` — **обновлён**: запись о шортлисте моделей и о dual-agent-stack.
- `Сессии/2026-09-25/диалог-10-шортлист-моделей-и-dual-agent-stack.md` — **этот файл**.

## Открытые вопросы

- Подтвердить выбор провайдера VPS (Amvera или альтернатива).
- Подтвердить, что Telegram — основной канал (или добавить Discord/Slack).
- Решить, нужен ли VPS-3 для бэкапов.
- Делать ли pi-coding-agent stateful или serverless (Daytona/Modal)?
- Должен ли Hermes иметь fallback на локальный pi-coding-agent?
- Как версионировать протокол `delegate_task` — SemVer в URL или JSON-RPC `protocol_version`?
- Гонять ли бенчмарк 3 моделей (mimo-v2.6-pro, gpt-6-luna, claude-fable-5.1) на наших задачах?

## Связанные wiki-страницы

- [[wiki/comparisons/2026-09-25-model-shortlist]] — главный отчёт по моделям.
- [[wiki/queries/2026-09-25-model-shortlist]] — короткий ответ.
- [[wiki/concepts/dual-agent-stack]] — концепт развёртывания.
- [[wiki/entities/hermes-agent]] — главный герой VPS-1.
- [[wiki/entities/pi-agent]] — главный герой VPS-2.
- [[wiki/entities/amvera-cloud]] — платформа деплоя.
- [[wiki/entities/cloudflare-tunnel]] — сетевой мост.
- [[wiki/concepts/mcp-basics]] — протокол.
- [[wiki/concepts/agent-memory-skills]] — синхронизация памяти.

## Следующие шаги

- [ ] Завести `VPS/hermes.md` и `VPS/pi-agent.md` (шаблон `AdminVPS.md`).
- [ ] Подтвердить провайдера VPS и канал (Telegram/Discord).
- [ ] Набросать референсный SDK `delegate_task` на Node.
- [ ] Сделать `SKILL.md` для Hermes, чтобы он умел звать pi.
- [ ] Бенчмарк 3 моделей на 5–10 наших задачах → `wiki/queries/2026-09-25-benchmark.md`.
- [ ] Обновить `~/.pi/agent/settings.json` (defaultModel → `mimo-v2.6-pro`).

## Цитаты / формулировки, которые стоит запомнить

> «Не одна модель, а **три роли + один fallback**».

> «pi-coding-agent — **единственный writer в `wiki/`**».

> «**Открытых портов между VPS и внешним миром — 0.** Только Cloudflare-edge».

## Технические детали

- Текущая активная модель: `wormsoft/minimax-m3` (бесплатный wormsoft-провайдер, цена 0).
- OpenRouter-каталог: `https://openrouter.ai/api/v1/models` — проверено 2026-09-25.
- Frontmatter для будущих VPS-заметок (по шаблону `VPS/AdminVPS.md`):
  - VPS-1 Hermes: `ip=`, `user=`, `port=22`, `os=ubuntu-24.04`, `provider=amvera-micro`, `location=msk`.
  - VPS-2 pi: `ip=`, `user=pi`, `port=22`, `os=ubuntu-24.04`, `provider=amvera-tier2`, `location=msk`.
- JSON-RPC endpoint для `delegate_task`: `https://pi.internal.example.com` (через Cloudflare Tunnel).
- Аутентификация: `Authorization: Bearer ${PI_AGENT_TOKEN}`.
