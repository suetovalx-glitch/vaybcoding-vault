# Docker

## Summary

Docker — стандарт де-факто для упаковки приложений в контейнеры. В вайбкодинге и AI-агентских стеках Docker используется повсеместно: агенты ([[wiki/entities/hermes-agent|Hermes]], [[wiki/entities/pi-agent|Pi Agent]]) поставляются как образы, инфраструктура ([[wiki/entities/amvera-cloud|Amvera]]) работает поверх Docker, [[wiki/concepts/mcp-basics|MCP-серверы]] часто упакованы в контейнеры.

## Current Understanding

- Версия 29.8.0 актуальна на сентябрь 2026.
- Архитектура: client / daemon / registry.
- Dockerfile, BuildKit, docker run, volumes, networks, secrets, configs, Compose, daemon.json, Engine REST API.
- Основной способ деплоя в [[wiki/entities/amvera-cloud|Amvera]] — через `amvera.yml` + Docker-образ.
- Без Docker не работает ни один современный self-hosted agent-стек.

## Evidence

- [[wiki/sources/2026-09-23-llm-wiki-docker]] — основной источник.
- [[wiki/entities/amvera-cloud]] — практика деплоя.
- [[wiki/entities/hermes-agent]] — поставляется как Docker-образ.

## Related Pages

- [[wiki/entities/amvera-cloud]] — PaaS поверх Docker.
- [[wiki/entities/hermes-agent]] — официальный образ `nousresearch/hermes-agent:latest`.
- [[wiki/concepts/mcp-basics]] — MCP-серверы часто докеризуются.

## Contradictions / Uncertainty

- Насколько BuildKit покрывает все потребности 2026, или уже есть более удобные альтернативы (Earthly, Dagger, Nix) — нужно отдельное сравнение.

## Next Questions

- Стоит ли выделять «Docker для AI-агентов» как отдельную concept-страницу (типичные Dockerfile-паттерны для агентских образов).
- Multi-arch сборки для GPU-нагрузок.
