# LLM Wiki — Docker

## Source Metadata

- **Дата источника:** 2026-09-05 (29.8.0).
- **Путь в raw:** `raw/Clippings/LLM Wiki — Docker.md`.
- **Тип источника:** клиппинг LLM Wiki по теме «Docker».
- **Дата ингеста:** 2026-09-24.
- **Язык оригинала:** английский (переведён в wiki-саммари на русский, термины оставлены).

## Core Claims

1. **Docker — базовый слой упаковки для AI-агентов и сервисов.** Без Docker не работает ни один современный self-hosted agent-стек (включая Hermes).
2. **BuildKit** — основной движок сборки: многоэтапные сборки, кэш, секреты, мульти-архитектура.
3. **Docker Compose** — стандарт описания multi-container систем (используется в том числе для развёртывания Hermes и Pi Agent).
4. **Volumes, networks, secrets, configs** — базовые единицы для stateful-агентов и интеграций.
5. **Docker Engine REST API** — точка интеграции для оркестраторов и MCP-серверов.

## Key Evidence / Details

- Архитектура: client/daemon/registry, контейнеры vs виртуальные машины, образы и реестры.
- Dockerfile: все инструкции, конвенции, лучшие практики.
- docker run, флаги, сетевые драйверы, публикация портов.
- Хранилище: тома, bind-mounts, tmpfs.
- daemon.json, конфигурация dockerd, безопасность.

## Connections

- [[wiki/entities/docker]] — entity-страница по Docker.
- [[wiki/entities/hermes-agent|Hermes Agent]] — поставляется как Docker-образ.
- [[wiki/entities/amvera-cloud|Amvera Cloud]] — PaaS поверх Docker.
- [[wiki/concepts/llm-wiki-template|LLM Wiki шаблон]] — сестринский документ.

## Open Questions

- Актуальность BuildKit в 2026 — есть ли уже полноценная замена (Earthly, Dagger, Nix) — нужен отдельный обзор.
- Multi-arch сборки для AI-нагрузок (GPU на arm64) — стоит выделить отдельно.

## Change Impact on Wiki

- Создан [[wiki/entities/docker]].
- Обновлён [[wiki/overview]] — Docker упомянут в разделе «Инфраструктура».
- Обновлён [[wiki/index]] — добавлена ссылка.
