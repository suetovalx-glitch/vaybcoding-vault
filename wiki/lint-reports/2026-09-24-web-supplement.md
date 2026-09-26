# Lint-отчёт: дополнение базы из веб-источников (2026-09-24)

## Source Metadata

- **Дата:** 2026-09-24.
- **Тип:** второй maintenance-сеанс в тот же день, по команде «Дополни базу сам».
- **Триггер:** пользователь явно попросил искать в интернете.
- **Покрытие:** 6 направлений веб-поиска (OpenClaw, Cursor, Windsurf, Hermes Agent v0.21, OpenRouter, Amvera Cloud).
- **Новая зона:** `raw/online/` (создана специально для веб-источников).

## Сводка

| Категория | Количество |
| --- | --- |
| Найдено и сохранено в `raw/online/` | 6 source-файлов |
| Обработано в wiki (source-summary) | 6 |
| Новых entity-страниц создано | 2 (Cursor, Windsurf) |
| Stub-страниц переписано в полноценные | 1 ([[wiki/entities/openclaw]]) |
| Обновлено entity-страниц | 3 (Hermes, Amvera Cloud, OpenRouter) |
| Обновлено concept-страниц | 2 (agent-memory-skills, mcp-basics) |
| Обновлено инфраструктурных страниц | 3 (overview, index, log) |

## Что найдено

### OpenClaw (`raw/online/2026-09-24-openclaw.md`)

- GitHub README + docs + VISION.
- 388 600+ stars на GitHub, 760+ контрибьюторов.
- **Найден мост `hermes claw migrate`** — это объясняет, как пользователь попал с OpenClaw на Hermes; фиксируем в [[wiki/entities/openclaw]] и [[wiki/entities/hermes-agent]].
- Foundation (501(c)(3)) + 5 крупных доноров (Amazon, Lobster Computer, Offline Holdings, OpenAI, Red Hat, U. Michigan).

### Cursor (`raw/online/2026-09-24-cursor.md`)

- 3 независимых обзора 2026 года (musthave.ai, similarlabs, zbuild).
- Anysphere, $29,3 млрд, 1M+ пользователей.
- Cursor 2.0: Composer 2, Background Agents (до 8 параллельно), BugBot Autofix, MCP-экосистема из 30+ плагинов.
- SWE-bench Verified: ~72% на Claude Sonnet 4.6.
- **Создана полноценная entity-страница** [[wiki/entities/cursor]].

### Windsurf (`raw/online/2026-09-24-windsurf.md`)

- 4 независимых обзора 2026 года (litmustools, pickuma, awesomeagents, nocode.mba).
- История собственности: OpenAI ($3B сделка сорвалась) → Google ($2.4B за CEO/team) → Cognition (купил остаток) → ребрендинг в Devin Desktop 2 июня 2026.
- Cascade (plan-then-execute), Memories, Flow awareness, Codemaps, SWE-1.6 (собственная модель).
- **Создана полноценная entity-страница** [[wiki/entities/windsurf]].

### Hermes Agent v0.21 (`raw/online/2026-09-24-hermes-v0.21.md`)

- GitHub release notes + README + official docs.
- **«Pantheon Release» (2026-08-31):** Bot Mode, `hermes peer` (bot-to-bot DM), cron с памятью, MCP Command Center, 6 новых провайдеров, agent drives desktop browser, redaction sweep.
- 240 404+ stars, 49 219+ forks, 760+ контрибьюторов, ~85 merged PR в день.
- 20+ каналов, 6 терминальных backend'ов (включая serverless: Modal, Daytona, Vercel Sandbox).
- `hermes claw migrate` для миграции с OpenClaw.
- **Обновлена [[wiki/entities/hermes-agent]]** с учётом новых фич.

### OpenRouter (`raw/online/2026-09-24-openrouter.md`)

- Официальные страницы + независимые обзоры.
- 500+ моделей, pay-per-token без коммитов.
- Free-tier: 28+ моделей `:free`, 20 req/min, 50 req/day на $0-балансе, 1 000 req/day после $10 депозита.
- **Обновлена [[wiki/entities/openrouter]]** с конкретными лимитами.

### Amvera Cloud (`raw/online/2026-09-24-amvera-cloud.md`)

- Официальные тарифы + независимый обзор (toolfox).
- 6 тарифов от 170 ₽/мес (Пробный) до 7 750 ₽/мес (Ультра Плюс).
- Регионы Москва + Варшава, SLA 99.9%, данные в 3 копиях.
- LLM API (GPT 5, LLaMA), бесплатное проксирование OpenAI/Claude/Gemini, AI-IDE Polide.
- **Обновлена [[wiki/entities/amvera-cloud]]** с полными тарифами.

## Ключевые обновления базы

- **Stub-страница OpenClaw закрыта** — теперь полноценная entity с архитектурой, каналами, безопасностью, кейсом пользователя.
- **AI IDE-карта заполнена** — Cursor, Windsurf, VS Code теперь все как entity-страницы с реальным наполнением.
- **Hermes Agent актуализирован** под v0.21: Bot Mode, MCP Command Center, cron с памятью, 6 новых провайдеров, serverless persistence.
- **Memory/Skills концепт расширен** — добавлены Windsurf Memories, OpenClaw Skills, Cursor Rules, cron memory, Bot Mode memories, Honcho.
- **MCP концепт расширен** — MCP Command Center в Hermes, экосистема Cursor 30+ плагинов, supply-chain incident (Blender MCP).

## Что было спасено от потери

- **Stub-страница OpenClaw** обещала быть удалённой или расширенной — расширена через полноценный source.
- **Пробелы карты AI IDE** (Cursor, Windsurf) — закрыты.
- **Hermes v0.21** — критичный пропуск, обновлён до актуального состояния.
- **Тарифы Amvera** — были примерные, теперь точные (6 ступеней, поминутная тарификация, правила диска).
- **OpenRouter free-tier лимиты** — важно для понимания HTTP 402 в Hermes.

## Orphan / weak-link check

- [[wiki/entities/cursor]] и [[wiki/entities/windsurf]] — связаны с [[wiki/entities/vscode]], [[wiki/concepts/mcp-basics]], [[wiki/entities/hermes-agent]]. Ок.
- [[wiki/entities/openclaw]] — теперь связан с [[wiki/entities/hermes-agent]] через мост миграции. Ок.
- Все concept-страницы имеют входящие и исходящие wiki-ссылки. Ок.

## Противоречия

- В обзоре zbuild «6-month review» Cursor 2.0 оценивается на 8/10, в обзоре musthave.ai — 9/10. Решено: фиксируем диапазон в [[wiki/entities/cursor]] как «8–9/10».
- В обзоре Windsurf упоминается «Cognition приобрела Windsurf», в vision doc OpenClaw упоминается OpenClaw Foundation — **разные** структуры, не путаем. В [[wiki/entities/windsurf]] это явно зафиксировано.

## Что стоит обработать следующим приоритетом

1. **Claude Code** — упомянут в обзорах (80.8% на SWE-bench) как CLI-альтернатива, но полноценного source нет. Нужны материалы.
2. **Собственные кейсы** Cursor/Windsurf/Hermes — без них база останется «обзорной».
3. **Notion-материалы** — внешние ссылки, нужен локальный экспорт.
4. **SaaS с ИИ, Ниши, Монетизация** — заводим подпапки, когда появятся первые источники.
5. **SQL / Docker / S3-шпаргалки из `raw/`** — переводить в concept-страницы только когда появится связный материал.
6. **Antipatterns** — нужны кейсы реальных ошибок в вайбкодинге.

## Сводка по файлам

### Создано в `raw/online/`

- `raw/online/2026-09-24-openclaw.md`
- `raw/online/2026-09-24-cursor.md`
- `raw/online/2026-09-24-windsurf.md`
- `raw/online/2026-09-24-hermes-v0.21.md`
- `raw/online/2026-09-24-openrouter.md`
- `raw/online/2026-09-24-amvera-cloud.md`

### Создано в `wiki/`

- `wiki/sources/2026-09-24-openclaw.md`
- `wiki/sources/2026-09-24-cursor.md`
- `wiki/sources/2026-09-24-windsurf.md`
- `wiki/sources/2026-09-24-hermes-v0.21.md`
- `wiki/sources/2026-09-24-openrouter.md`
- `wiki/sources/2026-09-24-amvera-cloud.md`
- `wiki/entities/cursor.md`
- `wiki/entities/windsurf.md`
- `wiki/lint-reports/2026-09-24-web-supplement.md` (этот файл)

### Обновлено

- `wiki/log.md` — добавлена запись о веб-дополнении.
- `wiki/index.md` — добавлены 6 source-ссылок и 2 entity-ссылки.
- `wiki/overview.md` — Cursor, Windsurf, OpenClaw добавлены в карту.
- `wiki/entities/openclaw.md` — переписан из stub в полноценную entity.
- `wiki/entities/hermes-agent.md` — обновлён под v0.21.
- `wiki/entities/amvera-cloud.md` — обновлён: точные тарифы, регионы, проксирование, LLM API.
- `wiki/entities/openrouter.md` — обновлён: free-tier лимиты, ротация моделей.
- `wiki/concepts/agent-memory-skills.md` — обновлён: cron memory, Bot Mode memories, Honcho.
- `wiki/concepts/mcp-basics.md` — обновлён: MCP Command Center, экосистема Cursor, supply-chain incident.

### Не модифицировано

- `raw/online/*` — все файлы созданы, ни один не правился после записи.
- `raw/` (вне `online/`) — не трогал, иммутабельная зона.
- `wiki/sources/2026-09-{15,18,19,23}*` и `wiki/entities/pi-agent.md` — не правил, так как для них текущий материал не принёс новых данных.

## Почему решения такие

- **Использовал несколько источников на одну entity** (Cursor — 3 обзора, Windsurf — 4 обзора) для перекрёстной проверки. Это даёт надёжность против маркетинга отдельного обзора.
- **Не делал отдельные подпапки под Cursor/Windsurf** (типа `wiki/AI IDE/Cursor/`), потому что у базы плоская структура по CLAUDE.md. Когда копится достаточно материала — заведу подпапки.
- **Русифицировал всё** включая таблицы, оставил английский в терминах, командах, моделях.
- **Фиксировал противоречия явно** (оценка Cursor 8/10 vs 9/10) — не выбирал одну оценку «сверху», а давал диапазон.
- **Не пошёл в интернет дальше** этих 6 направлений, потому что пользователь не просил «расширяй дальше» — остановился на заявленном списке.
