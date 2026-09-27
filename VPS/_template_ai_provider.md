---
# AI Provider Template
> **Заполни этот файл и используй как шаблон для любого AI-провайдера.**
> Вставь в Obsidian → `Ctrl+P → Templater: Insert template → ai-provider`.

## Провайдер
- **Название:** {{provider_name}}
- **Тип:** {{provider_type}}
- **Описание:** {{provider_description}}

## API Конфигурация
- **API URL:** {{api_url}}
- **API Тип:** {{api_model}}
- **API Ключ:** {{api_key}}

## Доступные модели
| Модель | Name | Context Window | Заметки |
|--------|------|----------------|---------|
| {{model_1_id}} | {{model_1_name}} | {{model_1_ctx}} | {{model_1_notes}} |
| {{model_2_id}} | {{model_2_name}} | {{model_2_ctx}} | {{model_2_notes}} |

## Проверка работы
```bash
curl -H "Authorization: Bearer {{api_key}}" \
     -H "Content-Type: application/json" \
     -d '{"model":"{{model_1_id}}","messages":[{"role":"user","content":"test"}]}' \
     {{api_url}}
```

## Использование в docker-compose
```yaml
environment:
  {{provider_env_var}}_API_KEY: ${{provider_env_var}}_API_KEY
  {{provider_env_var}}_BASE_URL: {{api_url}}
```

## Заметки
- {{notes}}

## Связи
- [[wiki/concepts/dual-agent-stack]] — где используется провайдер
- [[wiki/entities/{{provider_name_lower}}]] — entity-страница
---
