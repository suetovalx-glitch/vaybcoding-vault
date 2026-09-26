# OpenRouter — сырой веб-источник

## Source Metadata

- **Дата снимка:** 2026-09-24.
- **URL-источники:**
  - https://openrouter.ai/openrouter/free
  - https://openrouter.ai/pricing
  - https://pricepertoken.com/endpoints/openrouter/free
  - https://klymentiev.com/blog/openrouter-free-tier
  - https://costgoat.com/pricing/openrouter
- **Тип:** официальные страницы + независимые обзоры.
- **Язык:** английский.
- **Назначение:** сырьё для [[wiki/sources/2026-09-24-openrouter|source-summary]].

## Ключевые тезисы (кратко)

- Pay-per-token, без коммитов, без monthly fees.
- 500+ моделей в каталоге.
- 28+ free-моделей с `:free` суффиксом.
- Free-tier: 20 req/min, 50 req/day на $0-балансе, 1 000 req/day после $10 депозита.
- Не promotional credits — только pay-as-you-go.

## Ключевые цитаты

> Pay-Per-Token, No Commitments: Add credits to your account and pay only for what you use. No monthly fees, no minimum spend. Free models available with rate limits for testing and light usage.

> OpenRouter has no promotional credits, but it offers 28+ models at literally $0 per token (IDs ending in :free), usable with a $0 balance and no credit card. Free models are rate-limited rather than credit-limited.

> The 20 req/min cap is fixed even after buying credits — a one-time $10 purchase (credits never expire) only raises the daily :free cap from 50 to 1,000 requests.

## Free-модели на 2026-09 (примеры)

- Union Alpha.
- Llama 4 Maverick.
- Llama 3.3 70B Instruct.
- 2M token context window у flagship free-моделей.
- Image inputs, parallel tool calling.

## Список моделей API

```
GET https://openrouter.ai/api/v1/models
```

Free-модели отличаются суффиксом `:free`.
