# Model Context Protocol (MCP)

## Summary

MCP (Model Context Protocol) — открытый протокол для подключения к LLM-агенту внешних инструментов, данных и сервисов **без хардкода инструментов в код агента**. По духу это «USB-C для AI»: один раз реализовал MCP-сервер — и его могут использовать все совместимые агенты.

## Current Understanding

### Зачем нужен MCP

- Без MCP каждый агент должен иметь свой адаптер под каждую внешнюю систему (Postgres, GitHub, Notion, S3, кастомный API).
- С MCP агент умеет «общаться по контракту» с любым MCP-сервером.
- Добавить новый инструмент = подключить новый MCP-сервер, **не меняя код агента**.

### Где уже применяется

- В [[wiki/entities/hermes-agent|Hermes Agent]] — поддержка MCP встроена. Сейчас это **MCP Command Center** (в v0.21): drag-in «paste anything» import, background health checks, fleet cost/usage overlay с schema token estimates и 30-day usage per server, `hermes://` deep links для установки с explicit confirmation. Управление 20+ MCP-серверами превращается в dashboard.
- В [[wiki/entities/windsurf|Windsurf]] — встроен, поддерживает Figma, Slack, Stripe, PostgreSQL, Playwright и др.
- В [[wiki/entities/cursor|Cursor]] — 30+ MCP-плагинов (Atlassian, Datadog, GitLab, Glean, Hugging Face, monday.com, PlanetScale).
- В [[wiki/entities/openclaw|OpenClaw]] — поддержка через `MCP` протокол, каталог ClawHub.
- В [[wiki/entities/amvera-cloud|Amvera]] — есть собственный MCP-сервер для интеграции с AI-агентами.
- В LLM Wiki-шаблоне — vault может выступать как MCP-сервер для Claude Code, чтобы LLM мог программно читать и писать wiki-страницы.

### Что обычно подключают через MCP

- Документация (корпоративная wiki, Notion, Confluence).
- Базы данных (Postgres, SQLite).
- Git-репозитории.
- Файловые системы.
- Облачные платформы (Amvera, AWS, Yandex Cloud).
- Браузер (через Playwright MCP).
- Внутренние API компании.
- Productivity tools (Jira, Linear, Slack, GitHub, PagerDuty, Datadog).

### Плюсы

- **Стандартизация:** один MCP-сервер = переиспользуется разными агентами.
- **Безопасность:** контроль доступа на уровне MCP-сервера, а не на уровне кода агента.
- **Расширяемость:** легко добавлять новые интеграции.
- **Tool filtering** — агенты могут фильтровать инструменты конкретного MCP-сервера (важно при большом каталоге).

### Ограничения и риски

- Агент через MCP получает реальные права — нельзя давать прод-ключи «на автомате».
- Безопасность MCP-сервера = безопасность всей связки.
- Большой набор MCP-серверов → быстро съедается контекст (важна фильтрация).
- Supply-chain: компрометация upstream-сервера = компрометация агента (в Hermes уже был кейс с Blender MCP).

## Evidence

- [[wiki/sources/2026-09-19-hermes-agent-overview]] — основной источник (раздел про MCP).
- [[wiki/sources/2026-09-24-hermes-v0.21]] — MCP Command Center.
- [[wiki/sources/2026-09-23-llm-wiki-pi-agent]] — упоминание MCP-сервера для Claude Code в LLM Wiki шаблоне.
- [[wiki/sources/2026-09-24-cursor]] — MCP-экосистема в Cursor 2.0.
- [[wiki/sources/2026-09-24-windsurf]] — MCP в Windsurf Cascade.
- [[wiki/entities/amvera-cloud]] — пример MCP-сервера в проде.

## Related Pages

- [[wiki/concepts/agent-memory-skills]] — MCP часто используется вместе с навыками и памятью.
- [[wiki/concepts/llm-wiki-template]] — в этом шаблоне MCP — одно из «улучшений».
- [[wiki/entities/hermes-agent]] — практическая реализация с MCP Command Center.
- [[wiki/entities/cursor]] — крупнейшая MCP-экосистема (30+ плагинов).
- [[wiki/entities/windsurf]] — практическая реализация с Cascade.

## Contradictions / Uncertainty

- Реальный список «production-ready» MCP-серверов в 2026 году у меня пока неполный. Стоит собирать по мере появления новых источников.
- В Hermes уже был кейс компрометации upstream MCP (Blender) → нужен Tier-1 security scanning на plugin installs.

## Next Questions

- Какие MCP-серверы реально нужны в этом vault (например, MCP-сервер для самой базы, чтобы внешние агенты могли читать wiki).
- Как правильно изолировать разные MCP-серверы по правам доступа.
- Стоит ли выделять MCP-«командный центр» как отдельную concept-страницу.
