# Project CLAUDE.md (операционный контракт vault)

## Source Metadata

- **Дата источника:** 2026-09-19.
- **Путь в raw:** `raw/Telegram/documents/CLAUDE - 20260919014812258.md`.
- **Тип источника:** конфигурационный файл / операционная инструкция для LLM-агента vault.
- **Дата ингеста:** 2026-09-24.
- **Язык оригинала:** английский (но это технический контракт, дословно оставляем английские термины и формулировки команд, сопровождая русским пояснением).

## Core Claims

1. **Этот `CLAUDE.md` — канонический операционный контракт** для всей базы знаний. Он определяет, как LLM-агент (в т. ч. текущий maintenance-coworker) должен поддерживать vault.
2. **Миссия:** хранить высококачественную персональную базу знаний, где `raw/` неизменяем, `wiki/` поддерживается LLM, `index.md` — каталог, `log.md` — append-only журнал операций.
3. **Жёсткие правила (Non-Negotiable Rules):**
   - Никогда не модифицировать файлы в `raw/`.
   - Всегда обновлять `index.md` и `log.md` после любых ingest/query/lint-операций.
   - Предпочитать редактирование существующих страниц созданию дублей.
   - Использовать Obsidian-style wiki-ссылки `[[page-name]]`.
   - Записывать противоречия и superseded-claims явно (не перезаписывать историю молча).
   - Сохранять атрибутируемость: цитаты → `wiki/sources/*`.
   - Не оставлять orphan-страниц: минимум одна входящая и одна исходящая ссылка.
   - Писать кратко, структурированно и diff-friendly.
4. **Конвенция папок** (принята в этом vault):
   - `raw/sources/` — иммутабельные markdown/text/pdf-исходники.
   - `raw/assets/` — иммутабельные локальные изображения/файлы.
   - `wiki/overview.md` — верхнеуровневая сводка.
   - `wiki/sources/` — по одному саммари на каждый ингест-источник.
   - `wiki/entities/` — люди, организации, проекты, инструменты.
   - `wiki/concepts/` — темы, идеи, методы, фреймворки.
   - `wiki/timelines/` — хронологии.
   - `wiki/comparisons/` — сравнения бок-о-бок.
   - `wiki/queries/` — durable-ответы на вопросы.
   - `wiki/lint-reports/` — отчёты проверок.
5. **Правила нейминга:** kebab-case, префикс для source-summary — `YYYY-MM-DD-title.md`.
6. **Обязательные шаблоны страниц:** source-summary, entity/concept, query-output.
7. **Три стандартных workflow:**
   - **Workflow A (ingest):** прочитать raw → извлечь claims/facts/entities/concepts → создать source-summary → обновить entity/concept → обновить overview → обновить index → дописать в log → отчитаться.
   - **Workflow B (query):** прочитать index → выбрать релевантные страницы → синтезировать ответ с цитатами → при durable-ценности сохранить в `wiki/queries/` → при новом синтезе обновить entity/concept → обновить index/log.
   - **Workflow C (lint):** проверка противоречий, устаревших утверждений, orphan-страниц, недостающих связей, частых концептов без dedicated-страниц → записать отчёт в `wiki/lint-reports/YYYY-MM-DD-lint.md`.
8. **Политика цитирования:** предпочитать цитаты из `wiki/sources/*`; если цитируем raw напрямую — обязательно отразить в source-summary. Неуверенные утверждения помечать `Status: tentative`.
9. **Политика обновлений:** никаких silent large rewrites; устаревший материал переносить в «Superseded» вместо удаления.
10. **Сессионный чеклист:** при старте сессии читать `AGENT.md`, `index.md`, последнюю секцию `log.md`.

## Key Evidence / Details

- Этот файл фактически **совпадает по духу** с LLM Wiki-шаблоном Карпати (см. [[wiki/sources/2026-09-23-llm-wiki-pi-agent]], [[wiki/sources/2026-09-23-llm-wiki-vscode]], [[wiki/sources/2026-09-23-llm-wiki-docker]]), но адаптирован под конкретный vault и более формализован.
- Поддерживаемые natural-language-интенты: `ingest <path>`, `query: <вопрос>`, `lint wiki`, `show recent changes`, `suggest next sources`.

## Connections

- [[wiki/concepts/llm-wiki-template|LLM Wiki шаблон]] — общий предок.
- [[wiki/concepts/vault-raw-wiki-pipeline]] — практическая реализация в этом vault.
- [[wiki/index]] — главный каталог, обновляется по правилам CLAUDE.md.
- [[wiki/log]] — журнал, обновляется по правилам CLAUDE.md.

## Open Questions

- Должен ли я в этом vault поддерживать ещё и `AGENT.md` (упомянут в сессионном чеклисте)? Пока нет — при необходимости создам.
- Нужна ли папка `raw/sources/` и `raw/assets/` как подпапки, или оставлять плоскую структуру `raw/` (как сейчас в реальности)? Сейчас сырьё лежит в `raw/Clippings/`, `raw/Сборник/`, `raw/Telegram/` и т. д. — не трогаем, но при следующей структурной чистке можем упорядочить.

## Change Impact on Wiki

- Создан [[wiki/index]], [[wiki/log]], [[wiki/overview]] по этой схеме.
- Созданы [[wiki/sources/*]] в формате `YYYY-MM-DD-title.md`.
- Созданы [[wiki/concepts/*]] и [[wiki/entities/*]].
- Создана [[wiki/lint-reports/2026-09-24-initial-revision]] (запланировано).
- Этот source-summary служит «корнем операционной истины» — на него ссылаются overview, log и concept raw→wiki.
