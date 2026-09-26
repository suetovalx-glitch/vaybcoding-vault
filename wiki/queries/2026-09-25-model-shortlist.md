# Какие модели лучше использовать для вайбкодинга?

## Query Metadata

- **Дата:** 2026-09-25.
- **Тип:** durable-query (сохраняемый ответ на повторяемый вопрос).
- **Источник:** список моделей от пользователя + каталог openrouter + локальные конфиги.
- **Аналитик:** pi-coding-agent + текущая модель `wormsoft/minimax-m3`.
- **Связанные страницы:** [[wiki/comparisons/2026-09-25-model-shortlist]] — полная сводка.

## Краткий ответ

Не одна модель, а **три роли + один fallback**. Конкретно под наш стек:

| Роль | Лучшая опция | Бесплатная альтернатива |
| --- | --- | --- |
| **Дефолт (90% времени)** | `openai/gpt-6-luna` ($0.5/M out) или `xiaomi/mimo-v2.6-pro` | `wormsoft/minimax-m3` (текущая, $0), `xiaomi/mimo-v2.6-pro` через xiaomi-token-plan-cn ($0) |
| **Flash (lint, summarisation, классификация)** | `z-ai/glm-5.3-flash` (1.3M ctx, $0.14/M out) | `xiaomi/mimo-v2.6-flash`, `deepseek/deepseek-v4-flash` |
| **Coding-эксперт (рефакторинг, спорный код)** | `anthropic/claude-fable-5.1` (coding 81.6) | `moonshotai/kimi-k2.7-code`, `deepseek/deepseek-v4-pro` |
| **Flagship (только когда надо максимум)** | `anthropic/claude-opus-5.5` (AI 57.6) или `openai/gpt-6-astra` | `kimi/kimi-k3` ($10.5/M out — дешевле Opus), `wormsoft/mine/extra` |

**Прямо сейчас:** оставить `wormsoft/minimax-m3` как zero-cost дефолт. Если качества не хватает — переключиться на `xiaomi/mimo-v2.6-pro` (бесплатно через xiaomi-token-plan-cn). Coding-задачи кидать на `anthropic/claude-fable-5.1` через openrouter, в режиме `:batch` если возможно.

## Что НЕ брать

- `claude-opus-5` — проигрывает `opus-5.5` по той же цене.
- `claude-haiku-4.5` — контекст всего 200k, неудобно для длинных сессий.
- `kimi-k2.6` — вытеснен `kimi-k3` и `kimi-k2.7-code`.
- `gpt-5.6-*` — алиасы на GPT-6 семейство; используйте прямые `gpt-6-luna/sol/astra`.
- `qwen/qwen3.6:27b` и `qwen3.6:35b-a3b` — в openrouter не подтверждены; брать `qwen3.8-*` серию.
- `nvidia/nemotron-3-ultra` — отсутствует в openrouter; использовать только если есть прямой NVIDIA NIM endpoint.

## Что требует проверки

- `qwen/qwen3-embedding:8b` — не найден в openrouter-каталоге, но может быть доступен через google-провайдер. Нужен для RAG/wiki-индексации, не для генерации.
- `muse/muse-spark-1.3` — есть, но конкретные цены стоит уточнить при использовании (есть `meta/muse-spark-1.3` и `muse-spark-1.3-contributor`).
- AI-index / coding-index — взяты из метаданных openrouter. Не финальная истина; для наших задач лучше сделать собственный бенчмарк на 5–10 типичных кейсах.

## Полный отчёт

См. [[wiki/comparisons/2026-09-25-model-shortlist]] — там разобрано **все ~40 моделей** из твоего списка с ценами, контекстом, режимом работы и рекомендациями по применению.

## Конкретные следующие шаги

1. Поменять `defaultModel` в `~/.pi/agent/settings.json` на `mimo-v2.6-pro` (xiaomi-token-plan-cn) — это улучшит качество ответов без затрат.
2. При реальной coding-задаче — попробовать `anthropic/claude-fable-5.1` через openrouter, сравнить с текущим M3.
3. Завести `wiki/queries/2026-09-25-benchmark.md` — замерить 3–5 типовых задач на 3 кандидатах (mimo-v2.6-pro, gpt-6-luna, claude-fable-5.1).
4. Если качество M3 перестанет устраивать — добавить второй провайдер в settings (openrouter) и переключаться командой `/model`.
