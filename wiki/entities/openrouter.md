# OpenRouter

## Summary

OpenRouter — мульти-провайдерский LLM-шлюз. Один API-ключ даёт доступ к 500+ моделям. Pay-per-token, без коммитов, без месячных fee. Есть free-tier (28+ моделей с `:free`), Standard, Business, Enterprise. Удобен для агентских стеков, потому что не привязывает к одному поставщику и позволяет переключать модели «на лету».

## Current Understanding

### Тарифы (на 2026-09)

- **Pay-per-token**, без коммитов. Добавил кредиты → платишь только за использование.
- **Free модели:** 28+ моделей с ID, оканчивающимся на `:free`, реальная цена $0 за токен. Доступны с $0 на балансе и без credit card.
- **Free — rate-limited, не credit-limited:** 20 req/min, 50 req/day на $0-балансе. После одноразовой покупки $10 (credits never expire) — daily cap поднимается до 1 000.
- **Standard / Business / Enterprise** тарифы — поверх free-уровня.

### Free-модели

- 2M token context window у flagship free-моделей.
- Поддержка image inputs, parallel tool calling.
- «Cloaked model» — для сбора обратной связи.
- Список моделей через `GET https://openrouter.ai/api/v1/models`, free — суффикс `:free`.
- Ротация: список меняется, в моменте были Union Alpha, Llama 4 Maverick, Llama 3.3 70B Instruct.

### Особенности

- **Не promotional credits** — только pay-as-you-go.
- BYO-ключ не нужен — все модели через OpenRouter.
- API совместим с OpenAI, легко интегрируется.
- Credits never expire.

### Практические выводы для Hermes

- Hermes использует OpenRouter как один из основных провайдеров.
- HTTP 402 в Hermes — типичный симптом: модель разрешает большой max_tokens, но бесплатный route не покрывает. Решения: уменьшить лимит вывода, выбрать другую модель, попробовать free-маршрут.
- Для прод-нагрузки лучше купить минимум $10 кредитов (daily cap 1 000).

## Evidence

- [[wiki/sources/2026-09-24-openrouter]] — официальные страницы + независимые обзоры.
- [[wiki/entities/hermes-agent]] — основной потребитель.
- [[wiki/concepts/prompt-pattern-json-out]] — квоты важны при выборе стратегии.
- [[wiki/sources/2026-09-19-hermes-agent-overview]] — упоминание HTTP 402 / max_tokens.

## Related Pages

- [[wiki/entities/hermes-agent]]
- [[wiki/entities/amvera-cloud]]
- [[wiki/concepts/prompt-pattern-json-out]]
- [[wiki/overview]] — раздел «Инфраструктура».

## Contradictions / Uncertainty

- Как часто ротируется список free-моделей.
- Реальный лимит «после $10 депозита» для других моделей (упоминается только для `:free`).
- Юридический/комплаенс-аспект: при работе с личными данными пользователя через OpenRouter нужно понимать, куда уходят промпты.

## Next Questions

- Стоимость прод-нагрузки Hermes + 6 сабагентов (по кейсу пользователя).
- Качество русского языка у разных моделей через OpenRouter (нужен бенчмарк).
- BYO-ключ для приватности — есть ли такая опция.
