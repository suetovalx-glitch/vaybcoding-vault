# index

Главный каталог базы знаний. Здесь собираются ссылки на все wiki-страницы.

## С чего начать

- [[wiki/overview|overview]] — верхнеуровневая сводка и карта знаний.
- [[wiki/log|log]] — журнал операций (ingest, query, lint).
- [[raw/_about|raw/]] — зона сырья (неизменяемые исходники).

## Структура

- `wiki/sources/` — саммари по каждому обработанному источнику из `raw/`.
- `wiki/concepts/` — концепты, методы, фреймворки.
- `wiki/entities/` — сущности: инструменты, агенты, продукты, библиотеки.
- `wiki/queries/` — durable-ответы на вопросы, которые стоит сохранить.
- `wiki/comparisons/` — сравнительные разборы.
- `wiki/timelines/` — хронологические реконструкции.
- `wiki/lint-reports/` — отчёты о проверках базы.

## Сводный каталог

### Sources (саммари по источникам)

- [[wiki/sources/2026-09-23-llm-wiki-pi-agent|LLM Wiki — Pi Agent]]
- [[wiki/sources/2026-09-23-llm-wiki-vscode|LLM Wiki — VS Code]]
- [[wiki/sources/2026-09-23-llm-wiki-docker|LLM Wiki — Docker]]
- [[wiki/sources/2026-09-19-hermes-agent-overview|Sамообучающийся ИИ-агент Hermes]]
- [[wiki/sources/2026-09-19-project-claude-md|Project CLAUDE.md (операционный контракт vault)]]
- [[wiki/sources/2026-09-15-prompts-for-pi|Начальный промт для pi]]
- [[wiki/sources/2026-09-18-ai-vps-control|Стратегия AI-агента для управления VPS]]
- [[wiki/sources/2026-09-24-openclaw|OpenClaw — Personal AI Assistant (веб)]]
- [[wiki/sources/2026-09-24-cursor|Cursor — AI Code Editor (веб)]]
- [[wiki/sources/2026-09-24-windsurf|Windsurf / Devin Desktop (веб)]]
- [[wiki/sources/2026-09-24-hermes-v0.21|Hermes Agent v0.21.0 (Pantheon Release, веб)]]
- [[wiki/sources/2026-09-24-openrouter|OpenRouter — тарифы и free-tier 2026 (веб)]]
- [[wiki/sources/2026-09-24-amvera-cloud|Amvera Cloud — тарифы и обзор 2026 (веб)]]

### Concepts (концепты)

- [[wiki/concepts/llm-wiki-template|LLM Wiki шаблон (по Карпати)]]
- [[wiki/concepts/agent-memory-skills|Память и навыки агента]]
- [[wiki/concepts/mcp-basics|Model Context Protocol (MCP)]]
- [[wiki/concepts/prompt-pattern-json-out|Prompt pattern: строгий JSON-вывод]]
- [[wiki/concepts/vault-raw-wiki-pipeline|Пайплайн raw → wiki]]
- [[wiki/concepts/dual-agent-stack|Dual-Agent Stack: Hermes + pi на двух VPS]]
- [[wiki/concepts/docker-test-stack|Test Infrastructure: 3 VPS как Docker-машина]]
- [[wiki/concepts/architecture-block-diagram|Архитектура: Полная блочная схема (4 diagram)]]

### Architecture Blocks (блок-схемы)
- [[wiki/architecture-blocks/full-architecture|Full Architecture]] — полная архитектура: локалка + прод + test + сети + LLM
- [[wiki/architecture-blocks/delegate-task-flow|Delegate Task Flow]] — sequence diagram протокола delegate_task + JSON-RPC
- [[wiki/architecture-blocks/test-infra-deploy|Test Infra Deploy]] — flow деплоя test-infrastructure на VPS-test-3
- [[wiki/architecture-blocks/git-sync|Git Sync]] — схема git-синхронизации LOC ↔ GitHub ↔ VPS

### Entities (сущности)

- [[wiki/entities/hermes-agent|Hermes Agent]]
- [[wiki/entities/amvera-cloud|Amvera Cloud]]
- [[wiki/entities/openrouter|OpenRouter]]
- [[wiki/entities/vscode|VS Code (как AI IDE-среда)]]
- [[wiki/entities/docker|Docker]]
- [[wiki/entities/pi-agent|Pi Agent (coding agent)]]
- [[wiki/entities/openclaw|OpenClaw]]
- [[wiki/entities/cloudflare-tunnel|Cloudflare Tunnel]]
- [[wiki/entities/cursor|Cursor]]
- [[wiki/entities/windsurf|Windsurf (Devin Desktop)]]
- [[wiki/entities/hshp-host|hshp.host (VPS-провайдер)]]
- [[wiki/entities/orca-ade|Orca ADE (Agent Development Environment)]]
- [[wiki/entities/netbird|NetBird (mesh-VPN на WireGuard)]]

### Comparisons (сравнения)

- [[wiki/comparisons/2026-09-25-model-shortlist|Шортлист моделей под наши задачи (2026-09-25)]]

### Queries (ответы на вопросы)

- [[wiki/queries/2026-09-25-model-shortlist|Какие модели лучше использовать для вайбкодинга]]

### Lint reports (проверки)

- [[wiki/lint-reports/2026-09-24-initial-revision|Первая полная ревизия (baseline)]]
- [[wiki/lint-reports/2026-09-24-web-supplement|Дополнение базы из веб-источников]]

## Правила навигации

- Запросы → `wiki/queries/`.
- Концепт, который используется в нескольких местах → отдельная страница в `wiki/concepts/`.
- Инструмент/продукт/модель/компания → `wiki/entities/`.
- Саммари конкретного сырого файла → `wiki/sources/`.
- Если страница существует — редактируем её, не плодим дубли.
