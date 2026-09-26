# Сравнение моделей LLM под наши задачи (вайбкодинг, сентябрь 2026)

## Source Metadata

- **Дата отчёта:** 2026-09-25.
- **Тип:** synthesis/comparison (не источник, а анализ по каталогу openrouter и провайдерам).
- **Сырьё:**
  - `https://openrouter.ai/api/v1/models` (каталог openrouter, цены и контексты, проверено 2026-09-25).
  - [[wiki/sources/2026-09-24-openrouter]] — общие правила OpenRouter (free-tier, batch-режимы).
  - Локальные конфиги: `~/.pi/agent/models.json` (wormsoft), `~/.pi/agent/models-store.json` (xiaomi-token-plan, google, openrouter).
- **Дата ингеста:** 2026-09-25.
- **Аналитик:** pi-coding-agent + текущая модель `wormsoft/minimax-m3`.

## Summary

Под наш стек (вайбкодинг + Obsidian-база + Hermes-агенты + pi-coding-agent) оптимально использовать **комбинацию из трёх ролей**: одна «рабочая лошадка» на каждый день, одна дешёвая flash-модель для рутины и один «эксперт» для сложных задач. Все три есть в openrouter; под платную нагрузку используем `:batch`-вариант (50% цена, async). Бесплатные альтернативы — `wormsoft/mine/onlycode`, `xiaomi/mimo-v2.6-pro`, `google/gemma-4-31b-it` (через google-провайдер) и `:free`-модели openrouter.

## Current Understanding

### Наша ролевая модель

| Роль | Когда | Рекомендация |
| --- | --- | --- |
| **Дефолт (ежедневная работа)** | чтение, редактирование, обсуждение, плановые задачи | `openai/gpt-6-luna` или `xiaomi/mimo-v2.6-pro` (оба $0.5/1M out) |
| **Flash (рутина, классификация, поиск)** | lint-проходы, разбор raw/, форматирование, summarisation | `xiaomi/mimo-v2.6-flash` или `z-ai/glm-5.3-flash` ($0.14–0.28/1M out) |
| **Pro/Expert (глубокий код, рефактор, планирование)** | multi-step рефакторинг, спорная архитектура, спорные выводы | `anthropic/claude-fable-5.1` или `anthropic/claude-opus-5.5` ($10–20/1M out) |
| **Бесплатный заменитель дефолта** | экономия бюджета, многоитерационные правки | `wormsoft/minimax-m3` (наша текущая, $0) |
| **Coding-специализация** | автогенерация кода, рефакторинг | `moonshotai/kimi-k2.7-code`, `anthropic/claude-sonnet-5` |
| **Vision (скриншоты, OCR, UI-разбор)** | задачи с изображениями | `wormsoft/mine/vision` (бесплатно), `google/gemma-4-31b-it`, `anthropic/claude-fable-5.1` |
| **Большой контекст (≥1M токенов)** | целые репозитории, длинные логи | `deepseek/deepseek-v4-flash` (1.3M ctx), `z-ai/glm-5.3-flash` (1.3M ctx) |

### Каталог моделей по алфавиту (как прислано пользователем)

> Формат строк: `модель — контекст, $/M in, $/M out, режим, заметка`.

#### Anthropic (Claude)

- `anthropic/claude-fable-5` — 1M, $2 in / $10 out, reasoning mandatory. Стабильная «рабочая лошадка» уровня Sonnet. Поддерживает файлы, изображения.
- `anthropic/claude-fable-5.1` — 1M, $2 in / $10 out. Улучшение coding/agentic относительно Fable 5. AI-index 53.4, coding 81.6. **Лучший выбор под coding-экспертизу** среди Anthropic.
- `anthropic/claude-haiku-4.5` — 200k, $1 in / $5 out. Самый дешёвый Claude, быстрый. Подходит под «фолбэк», если нужно что-то claude-class, но дёшево.
- `anthropic/claude-opus-5` — 1M, $4 in / $20 out. AI-index 50.8, coding 78. Сильный, но проигрывает Opus 5.5.
- `anthropic/claude-opus-5.5` — 1M, $4 in / $20 out. AI-index 57.6, coding 76.9. **Flagship Anthropic**. Под глубокий код/агентные задачи, когда цена не критична.
- `anthropic/claude-sonnet-5` — 1M, $2 in / $10 out. AI-index 38.2, coding 71.5. Середняк; стоит брать, если цена важнее качества.

#### DeepSeek

- `deepseek-ai/deepseek-v4-flash` — 1M, $0.03 in / $0.32 out. Самый дешёвый «большой» вариант. 13B active MoE — отлично под summarisation, lint, классификацию.
- `deepseek-ai/deepseek-v4-flash:fast` — облегчённая маршрутизация на ту же модель, но с приоритетом скорости. Дороже flash в 2–3 раза, дешевле pro.
- `deepseek-ai/deepseek-v4-pro` — 1M, $0.25 in / $2.88 out. 49B active MoE, 1.6T total. AI-index 38.4, coding 74.9. **Лучшее соотношение цена/качество для длинных рассуждений**.
- `deepseek-ai/deepseek-v4-pro:fast` — ускоренная версия pro по более высокой цене.
- `deepseek/deepseek-v4.1-flash` / `:fast` — старые версии V4-flash (0423), дешевле, менее качественные; оставлены для совместимости.

#### Google / Gemma

- `google/gemma4:31b` — 262k, $0 in / $0 out (через google-провайдер). Открытая модель, multimodal, reasoning. **Бесплатная локальная альтернатива**. Поддерживает `reasoning.thinkingLevelMap` `{off→MINIMAL, high→HIGH}`.

#### Kimi (Moonshot AI)

- `kimi/kimi-k2.6` — 262k, MoE multimodal. Хорош в UI/UX-driven coding и multi-agent orchestration.
- `kimi/kimi-k2.7-code` — 262k, coding-специализация K2-семейства. Под end-to-end разработку.
- `kimi/kimi-k3` — 1M, $0.88 in / $10.5 out, 2.8T параметров, multimodal. AI-index 43.6, coding 76.2. Конкурент Claude Opus по coding, дешевле.

#### MiniMax / Wormsoft (наши «бесплатные» кастомы)

- `minimaxai/minimax-m3` — 1M, **$0 in / $0 out** через wormsoft. Multimodal (text+image+video). AI-index 25.2 — слабоват, но цена нулевая. **Текущая модель**.
- `wormsoft/mine/onlycode` — 1M, $0, text-only. Кастом под код, без изображений.
- `wormsoft/mine/extra` — 1M, $0, multimodal. Резерв.
- `wormsoft/mine/vision` — 1M, $0, multimodal. Под vision-задачи без бюджета.

#### Muse / Meta

- `muse/muse-spark-1.3` — 1M, multimodal reasoning. AI-index ~40, coding ~75. Сильный в multi-agent workflows, трекит состояние через длинные сессии.

#### NVIDIA

- `nvidia/nemotron-3-ultra` — в openrouter-каталоге не подтверждено; если доступен через отдельный NVIDIA NIM endpoint, обычно reasoning + длинный контекст. Перед использованием проверить наличие в openrouter (`GET /api/v1/models`).

#### OpenAI (GPT-5.6/6 семейства через openrouter)

- `openai/gpt-5.6-luna` — алиас семейства GPT-6 Luna; фактически идентичен `openai/gpt-6-luna`. 1.05M, $0.1 in / $0.5 out. **Дешёвый и быстрый OpenAI**, подходит как дефолт.
- `openai/gpt-5.6-sol` — алиас на `openai/gpt-6-sol`. 1.05M, $2 in / $10 out. Coding/agentic.
- `openai/gpt-5.6-terra` — алиас на `openai/gpt-5.6-terra`. 1.05M, ~$2 in / $12 out. Coding index ~75.
- `openai/gpt-6-astra` — 1.05M, $5 in / $25 out, mandatory reasoning. AI-index 52.7, coding 76.9. **Flagship OpenAI**. Для самых сложных задач, когда нужны coding + agentic одновременно.
- `openai/gpt-6-luna` — 1.05M, $0.1 in / $0.5 out. AI-index 37.3. Быстрый и дешёвый; под массовую рутину.
- `openai/gpt-6-sol` — 1.05M, $2 in / $10 out. AI-index 47.5. Уверенный середняк.
- `openai/gpt-oss:20b` — открытая 20B модель; точная цена/контекст — смотреть в openrouter по факту.
- `openai/gpt-oss:120b` — открытая 120B; обычно $0.05–0.2 in / $0.2–0.6 out.

#### Qwen

- `qwen/qwen3-embedding:8b` — embedding-модель, не для генерации; нужна отдельно для RAG/wiki-индексации.
- `qwen/qwen3.6:27b` — в openrouter-каталоге **не подтверждено**; вместо него доступна серия `qwen/qwen3.8-*` (Flash, Max, Max Prime, Omni Flash). Брать как ближайший аналог.
- `qwen/qwen3.6:35b-a3b` — тоже не подтверждено в openrouter; в каталоге qwen/qwen3.7/qwen3.8 series.
- `qwen/qwen3.8:27b` — `qwen/qwen3.8-flash` (1000k, multimodal reasoning) — лучший аналог для указанной размерности.

#### Xiaomi (MiMo)

- `xiaomi/mimo-v2.6-flash` — 1M, $0.14 in / $0.28 out. MoE 309B/15B active, multimodal. **Лучший flash-выбор под наши деньги**.
- `xiaomi/mimo-v2.6-pro` — 1M, $0.435 in / $0.87 out. 1T параметров, multimodal. **Бесплатно через `xiaomi-token-plan-cn` провайдер** — стоит сделать дефолтом для основной работы.

#### Z.ai (GLM)

- `zai/glm-5.3` — 1M, $0.56 in / $1.76 out. Середняк, поддерживает reasoning.
- `zai/glm-5.3-flash` — 1.3M, $0.045 in / $0.14 out. **Самый дешёвый вариант с контекстом 1.3M**, идеален для lint/summarisation больших файлов.
- `zai/glm-5.3-flash:NVFP4` — квантованный вариант (4-bit), дешевле, чуть хуже качество.
- `zai/glm-5.3:NVFP4` — квантованный полный GLM-5.3.

### Сравнение топ-кандидатов по 5 осям

| Критерий | `gpt-6-luna` | `mimo-v2.6-pro` | `claude-fable-5.1` | `deepseek-v4-pro` | `kimi-k3` | `minimax-m3` (текущий) |
| --- | --- | --- | --- | --- | --- | --- |
| Цена за 1M out | $0.5 | $0.87 (или $0) | $10 | $2.88 | $10.5 | **$0** |
| AI-index | 37 | — | 53 | 38 | 44 | 25 |
| Coding index | — | — | 81 | 75 | 76 | 56 |
| Контекст | 1.05M | 1M | 1M | 1M | 1M | 1M |
| Reasoning | configurable | configurable | mandatory | configurable | configurable | configurable |
| Vision | yes | yes (через провайдер) | yes | no | yes | yes |
| Когда брать | дефолт | бюджетный дефолт (Pro) | coding-эксперт | рассуждения, длинные цепочки | coding-эксперт дешевле Opus | zero-cost fallback |

### Бесплатные варианты (сводно)

1. **wormsoft** (наш основной):
   - `minimaxai/minimax-m3` — текущая модель.
   - `wormsoft/mine/onlycode` — для кода.
   - `wormsoft/mine/extra` — резерв.
   - `wormsoft/mine/vision` — для картинок.
2. **xiaomi-token-plan-cn** (через settings.json):
   - `mimo-v2.5`, `mimo-v2.5-pro`, `mimo-v2.6-flash`, `mimo-v2.6-pro` — все $0.
3. **google**:
   - `gemma-4-31b-it`, `gemma-4-26b-a4b-it` — $0, до 262k контекста.
4. **openrouter `:free`**:
   - список ротируется (см. [[wiki/sources/2026-09-24-openrouter]]), 20 req/min, 50 req/day; после $10 депозита — 1000/day.

### Стратегия использования (конкретные правила)

1. **Повседневные задачи** (чтение, обсуждение, мелкие правки) → `openai/gpt-6-luna` или `xiaomi/mimo-v2.6-pro`.
2. **Длинный лог/репо (>200k токенов)** → `z-ai/glm-5.3-flash` или `deepseek/deepseek-v4-flash`.
3. **Coding-рефакторинг (multi-file)** → `anthropic/claude-fable-5.1`, иначе `moonshotai/kimi-k2.7-code`, иначе `deepseek/deepseek-v4-pro`.
4. **Vision/OCR/UI** → `wormsoft/mine/vision` (zero-cost) или `anthropic/claude-fable-5.1`.
5. **Сложное стратегическое планирование, агентные циклы** → `anthropic/claude-opus-5.5` или `openai/gpt-6-astra`.
6. **Zero-cost-режим (эксперименты)** → `wormsoft/minimax-m3` (текущая), `xiaomi/mimo-v2.6-pro`, `google/gemma-4-31b-it`.
7. **Embedding для wiki/RAG** → `qwen/qwen3-embedding:8b` (если будем индексировать `wiki/`).

### Что НЕ брать и почему

- `anthropic/claude-opus-5` — проигрывает Opus 5.5 по AI-index (50.8 vs 57.6), при той же цене. Бессмысленно.
- `anthropic/claude-haiku-4.5` — только 200k контекст; для длинных сессий неудобен. Брать только если важна скорость/цена.
- `kimi/kimi-k2.6` — вытеснен `kimi-k3` и `kimi-k2.7-code`.
- `deepseek-v4.1-flash` — устаревшая версия; `deepseek-v4-flash-0731` качественнее.
- `qwen/qwen3.6:27b` / `qwen3.6:35b-a3b` — в openrouter отсутствуют (подтверждено 2026-09-25), брать `qwen3.8-*` серию.
- `gpt-5.6-*` — алиасы на GPT-6 семейства; вместо них использовать прямые `gpt-6-luna/sol/astra`.
- `openai/gpt-6-astra` — дорого ($25/M out). Только для flagship-задач.

## Evidence

- [[wiki/sources/2026-09-24-openrouter]] — free-tier, batch-режимы, ротация `:free`.
- [[wiki/sources/2026-09-24-hermes-v0.21]] — пример агентного потребления моделей.
- `https://openrouter.ai/api/v1/models` — прямые цены и индексы, проверено 2026-09-25.
- Локальные конфиги `~/.pi/agent/models.json` и `~/.pi/agent/models-store.json`.

## Related Pages

- [[wiki/index]] — каталог.
- [[wiki/overview]] — карта базы.
- [[wiki/sources/2026-09-24-openrouter]] — правила OpenRouter.
- [[wiki/concepts/llm-wiki-template]] — шаблон wiki.
- [[wiki/concepts/prompt-pattern-json-out]] — шаблоны вывода, важны при выборе модели под structured outputs.

## Contradictions / Uncertainty

- `qwen/qwen3.6:*` и `qwen/qwen3-embedding:8b` заявлены пользователем, но в openrouter-каталоге на 2026-09-25 не найдены. Возможно, это алиасы/планы, либо кастомные названия вне openrouter. Требует проверки через `GET /api/v1/models` в момент использования.
- `nvidia/nemotron-3-ultra` — нет в openrouter; доступен, скорее всего, только через NVIDIA NIM. Не используем без подтверждённого эндпоинта.
- AI-index и coding-index — взяты из метаданных openrouter (`artificial_analysis`). Это одна из метрик; для финального решения стоит провести локальный бенчмарк на наших задачах.
- Цены и контексты могут меняться; перед крупным спринтом перепроверять.

## Next Questions

- Сделать ли `xiaomi/mimo-v2.6-pro` или `openai/gpt-6-luna` дефолтом в `settings.json`? Сейчас там стоит `xiaomi/mimo-v2.5-pro`.
- Запустить локальный бенчмарк (5–10 реальных задач из `wiki/`) на 3 кандидатах (mimo-v2.6-pro, gpt-6-luna, claude-fable-5.1) и зафиксировать результат в `wiki/queries/`.
- Завести `wiki/entities/`-страницы для провайдеров с самыми используемыми моделями (openrouter, xiaomi-token-plan).
- Решить, нужна ли нам стратегия «all-free»: wormsoft + xiaomi + google — насколько она реально закрывает 80% задач.

## Change Impact on Wiki

- Новый файл `wiki/comparisons/2026-09-25-model-shortlist.md` — рекомендация по выбору модели под каждый класс задач.
- Возможное обновление `wiki/overview.md` — ссылка на этот shortlist.
- Возможное обновление `wiki/index.md` — добавить в раздел «Сравнения».
- Запись в `wiki/log.md` о создании этого документа.
