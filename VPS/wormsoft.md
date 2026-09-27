---
name: wormsoft
type: llm-provider
description: Wormsoft AI — OpenAI-compatible LLM provider. API endpoint: https://ai.wormsoft.ru/api/gpt
api_url: https://ai.wormsoft.ru/api/gpt
api_model: openai-completions
api_key: fe17f0216378a595bbb65028f19ca39a3c985ce9ffc1b41e32a94591bad45291
models:
  - id: wormsoft/mine/pi-coding
    name: pi-coding
    context: unknown
    notes: Для pi-coding-agent
  - id: wormsoft/mine/hermes
    name: hermes
    context: unknown
    notes: Для Hermes Agent
---

# Wormsoft AI — LLM Provider

## API

- **URL:** `https://ai.wormsoft.ru/api/gpt`
- **API:** `openai-completions` (OpenAI-compatible)
- **Key:** `fe17f0216378a595bbb65028f19ca39a3c985ce9ffc1b41e32a94591bad45291`

## Models

| ID | Name | Notes |
|----|------|-------|
| `wormsoft/mine/pi-coding` | pi-coding | Для pi-coding-agent |
| `wormsoft/mine/hermes` | hermes | Для Hermes Agent |

## Проверка

```bash
curl -H "Authorization: Bearer fe17f0216378a595bbb65028f19ca39a3c985ce9ffc1b41e32a94591bad45291" \
     -H "Content-Type: application/json" \
     -d '{"model":"wormsoft/mine/pi-coding","messages":[{"role":"user","content":"test"}]}' \
     https://ai.wormsoft.ru/api/gpt
```

## Использование

- OpenRouter совместим с этим провайдером через baseUrl
- Можно использовать как замену OpenRouter в docker-compose .env

## Связи

- [[wiki/concepts/dual-agent-stack]] — где используются модели
- [[VPS/test-1]] — Stage-pi использует этот провайдер
- [[VPS/test-2]] — Stage-Hermes использует этот провайдер
