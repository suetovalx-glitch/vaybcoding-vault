# Cursor

## Summary

Cursor — AI-first IDE от компании Anysphere, основанной в 2022 году четырьмя студентами MIT. Это форк VS Code, перестроенный «с нуля вокруг AI». На сентябрь 2026 — самая дорогая компания в AI IDE-пространстве (оценка ~$29,3 млрд). Поддерживает 1M+ активных пользователей.

## Current Understanding

### Ключевые возможности

- **Cursor Tab** — предиктивные дополнения, бьющие по целым блокам. ~72% acceptance rate, латентность 50–150 мс.
- **Composer 2 (Cmd+I)** — мульти-файловое редактирование с визуальным diff до применения. На 8 файлах — «production-ready 4/5».
- **Agent Mode** — автономное выполнение: читает кодовую базу, выбирает файлы, запускает терминал. ~$0.04 за шаг, сложная задача = $2–5.
- **Background Agents (Cursor 2.0)** — параллельные агенты в облачных VM, до 8 одновременно на git worktrees. Запускаются из Cursor, Slack, телефона.
- **BugBot Autofix** — авто-ревью + авто-фикс PR (лов null-pointer, type mismatches, security).
- **Rules, Plan Mode, Hooks** — постоянный контекст через `.cursor/rules`, режим «сначала план», расширение lifecycle агента.
- **MCP-экосистема** — 30+ плагинов (Atlassian, Datadog, GitLab, Glean, Hugging Face, monday.com, PlanetScale и т. д.).
- **Privacy Mode** — даже на free-плане, но AI-запросы всё равно идут через backend Cursor.

### Тарифы (на 2026-09)

| План | Цена | Кредиты | Особенности |
| --- | --- | --- | --- |
| Hobby | $0 | 2000 completions, 50 slow requests | Trial |
| Pro | $20/мес ($16/год) | $20 credit pool | Unlimited Tab/Auto, Background Agents |
| Pro+ | $60/мес | $60 pool | ×3 credit |
| Ultra | $200/мес | $200 pool | ×20, priority |
| Business | $40/user/мес | per-user | SSO, admin |
| Enterprise | custom | custom | Compliance |

- Auto mode — безлимитный (без списания кредитов).
- Manual model selection (Claude Sonnet 4.6, GPT-5, Gemini) — за кредиты.
- ~225 Claude Sonnet 4.6 / ~500 GPT-5 запросов на $20 pool.

### SWE-bench Verified (на 2026-02)

- Claude Code (Opus 4.6): 80.8%.
- Cursor (Claude Sonnet 4.6): ~72%.
- GitHub Copilot: 56%.
- Cursor (Auto mode): ~52%.

### Производительность и ограничения

- 2–4 ГБ RAM на средний проект.
- На 45K+ строк monorepo — зависания при индексации, лаги при AI-операциях.
- Форк VS Code отстаёт от официального VS Code на 1–2 месяца.
- Нет on-premise варианта (минус для compliance).
- Нет нативной GitLab-интеграции.

## Evidence

- [[wiki/sources/2026-09-24-cursor]] — основной source (3 независимых обзора 2026 года).
- [[wiki/entities/vscode]] — Cursor построен поверх VS Code.
- [[wiki/entities/pi-agent]] — сравнение «GUI vs CLI coding agent».
- [[wiki/entities/windsurf]] — главный конкурент.
- [[wiki/concepts/mcp-basics]] — MCP встроен.

## Related Pages

- [[wiki/overview]] — раздел «AI IDE и редакторы».
- [[wiki/concepts/prompt-pattern-json-out]] — Cursor 2.0 Plan Mode = структурированный выход.
- [[wiki/entities/amvera-cloud]] — для кейсов, когда Cursor-разработка деплоится в российский PaaS.

## Contradictions / Uncertainty

- Реальная средняя стоимость Pro для power users — обзоры сходятся на $40–80/мес, не на $20.
- Cursor 2.0 «production-ready 4/5» — метрика от Cursor, нужны независимые тесты.
- Нет on-premise, что критично для ряда enterprise-сегментов.

## Next Questions

- Когда появится on-prem / self-hosted вариант.
- Какой реальный retention rate у Background Agents в долгих сессиях.
- Насколько Cursor 2.0 Plan Mode совместим с практиками «строгий JSON-выход» из [[wiki/concepts/prompt-pattern-json-out]].
