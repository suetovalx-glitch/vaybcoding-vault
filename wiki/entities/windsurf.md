# Windsurf (Devin Desktop)

## Summary

Windsurf — agentic VS Code fork от Codeium, основанный в ноябре 2024. С **2 июня 2026** ребрендирован в **Devin Desktop** после покупки Cognition (создатели агента Devin). На сентябрь 2026 — 1M+ активных пользователей, $82M ARR. Главное отличие от Cursor — архитектура **plan-then-execute** у Cascade (агента) и **Memories** (постоянная память о конвенциях проекта).

## Current Understanding

### Ключевые возможности

- **Cascade** — главный агент: Chat (вопросы по коду) и Write (мульти-файловое редактирование). Ключевая фишка — паузы на каждом diff, чтобы пользователь мог отклонить конкретный edit.
- **Flow awareness** — Cascade следит за всеми действиями пользователя (файлы, терминал, clipboard) и предлагает продолжить паттерн.
- **Memories** — Cascade автономно накапливает знания о конвенциях проекта между сессиями. Можно дополнить explicit rules в `.windsurf/`.
- **Codemaps** (Cognition addition) — AI-аннотированные визуальные карты структуры кода до редактирования.
- **SWE-1.6** — собственная модель Cognition, free на всех планах, 200 tok/s free tier, 950 tok/s fast tier.
- **Pro и выше** — Claude Sonnet 4.6, GPT-5 (включая Codex-вариант), Gemini 3.1 Pro. BYO-ключа нет.
- **MCP** встроен: Figma, Slack, Stripe, PostgreSQL, Playwright, и т. д.
- **Agent Command Center** — Kanban-доска всех запущенных агентов (local + cloud), колонки Running / Waiting for Review / Done.

### История собственности (критично для оценки рисков)

- **Май 2025** — OpenAI договорился купить Windsurf за ~$3 млрд. Сделка сорвалась в июле 2025 из-за IP-прав Microsoft внутри партнёрства с OpenAI.
- **72 часа спустя** — Google заплатил ~$2,4 млрд за CEO Varun Mohan, сооснователя Douglas Chen и часть research team.
- **Cognition** (Devin) купил остаток: бренд, IP, training data, enterprise-контракты, оставшихся сотрудников. CEO Scott Wu.
- **2 июня 2026** — ребрендинг в Devin Desktop. JetBrains-плагин и Discord по-прежнему говорят «Windsurf».
- OpenAI — донор Foundation, не владелец.

### Тарифы (на 2026-06)

| План | Цена | Квоты |
| --- | --- | --- |
| Free | $0 | Light quota, unlimited Tab, SWE-1.6 free, limited frontier |
| Pro | $20/мес | Стандартная daily/weekly quota |
| Max | $200/мес | Heavy quota |
| Teams | $40/seat/мес | Shared admin, pooled quota |
| Enterprise | custom | Self-host, SAML SSO, RBAC, zero retention, FedRAMP High |

- Daily/weekly квоты с rolling refresh (с 19 марта 2026; до этого были месячные credits).
- Premium модели дают ~7–27 messages/day на Pro, ~42–170 на Max.
- Overages — по API-тарифам.
- Tab autocomplete — unlimited на всех планах.

### Enterprise story (сильнейшая сторона)

- SOC 2 Type II, FedRAMP High, HIPAA BAAs.
- Zero retention на paid seats.
- Три deployment mode: Cloud, Hybrid, fully Self-Hosted (без outbound трафика кроме trusted LLM endpoint).
- SAML SSO, RBAC, audit logs.

### Слабые стороны (по обзорам)

- Autocomplete reliability ниже Cursor (15–20% «промахов»).
- Стабильность при длинных сессиях — краши.
- Кредитная система непрозрачна (rolling quotas вместо monthly credits).
- Free tier — trial, не реальный план (хватает на 2–3 дня).
- После мартовского pricing flip G2 упал до ~1.4/5.

## Evidence

- [[wiki/sources/2026-09-24-windsurf]] — основной source (4 независимых обзора 2026 года).
- [[wiki/entities/cursor]] — главный конкурент; обзоры сравнивают их систематически.
- [[wiki/entities/vscode]] — оба fork от VS Code.
- [[wiki/concepts/agent-memory-skills]] — Windsurf Memories — конкретная реализация концепта.
- [[wiki/concepts/mcp-basics]] — встроен.
- [[wiki/entities/openclaw]] — есть shared рынок (многие пользователи мигрируют на Hermes/OpenClaw с Windsurf).

## Related Pages

- [[wiki/overview]] — раздел «AI IDE и редакторы».
- [[wiki/entities/devin]] (если появится) — Cognition планирует слияние Windsurf с агентом Devin.
- [[wiki/entities/codeium]] (историческое) — оригинальное имя компании.

## Contradictions / Uncertainty

- Удержит ли Cognition темп релизов после смены владельца — открытый вопрос.
- Насколько реально self-host для enterprise — нужны кейсы.
- Будет ли Devin Desktop = Windsurf или это слияние с агентом Devin в один продукт.

## Next Questions

- Реальные метрики удержания Cascade-сессий в долгую.
- Совместимость skills/memory при миграции на Devin Desktop.
- Насколько Memories «портятся» со временем (нужны ли prune-инструменты).
