# OpenRouter — тарифы и free-tier 2026 (веб-источник)

## Source Metadata

- **Дата источника:** 2026-09-24.
- **Сырьё в raw:** `raw/online/2026-09-24-openrouter.md`.
- **Источники:**
  - https://openrouter.ai/openrouter/free
  - https://openrouter.ai/pricing
  - https://pricepertoken.com/endpoints/openrouter/free
  - https://klymentiev.com/blog/openrouter-free-tier
  - https://costgoat.com/pricing/openrouter
- **Тип источника:** официальные страницы + независимые обзоры.
- **Дата ингеста:** 2026-09-24.
- **Язык оригинала:** английский.

## Core Claims

1. **OpenRouter — pay-per-token, без коммитов.** Добавил кредиты → платишь только за использование.
2. **Free модели:** 28+ моделей с ID, оканчивающимся на `:free`, реальная цена $0 за токен. Доступны с $0 на балансе и без credit card.
3. **Free — rate-limited, не credit-limited:** 20 req/min, 50 req/day на $0-балансе. После одноразовой покупки $10 (credits never expire) — daily cap поднимается до 1 000.
4. **Standard / Business / Enterprise тарифы** — поверх free-уровня. 500+ моделей в каталоге.
5. **Ротация free-моделей:** список меняется; в моменте были Union Alpha, Llama 4 Maverick, Llama 3.3 70B Instruct.
6. **Список моделей** доступен через `GET https://openrouter.ai/api/v1/models`, free-модели отличаются суффиксом `:free`.

## Key Evidence / Details

### Модели (примеры на 2026-09)

- 2M token context window у flagship free-моделей.
- Поддержка image inputs, parallel tool calling.
- «Cloaked model» — для сбора обратной связи.

### Ценообразование

- Free tier — для тестирования и лёгкого использования.
- Standard / Business / Enterprise — для прод-нагрузок.
- **Не promotional credits** — только pay-as-you-go.

### Free-tier тест (Klymentiev, 11 сентября 2026)

- Account с $10+ кредитов в истории → 1 000 req/day tier.
- На тесте с max_tokens=400 реальная квота не достигнута.

## Connections

- [[wiki/entities/openrouter]] — обновлён этим source.
- [[wiki/entities/hermes-agent]] — основной потребитель.
- [[wiki/entities/amvera-cloud]] — провайдер LLM в связке с PaaS.
- [[wiki/concepts/prompt-pattern-json-out]] — квоты важны при выборе стратегии.
- [[wiki/sources/2026-09-19-hermes-agent-overview]] — упоминание HTTP 402 и max_tokens.

## Open Questions

- Как часто ротируется список free-моделей.
- Реальный лимит «после $10 депозита» для других моделей.
- Стоимость прод-нагрузки на связке Hermes + 6 сабагентов.

## Change Impact on Wiki

- [[wiki/entities/openrouter]] обновлён: добавлены free-tier лимиты, отсутствие promotional credits, ротация моделей.
- [[wiki/overview]] — OpenRouter упоминается как инфраструктурная сущность.
- [[wiki/index]] — link на source.
- [[wiki/log]] — запись о ингесте.
