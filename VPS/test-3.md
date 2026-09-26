---
ip: 
user: 
password: 
port: 22
os: ubuntu-24.04
provider: 
tariff: 
vps_id: 
location: 
created: 2026-09-25
ssh_keys:
  - ~/.ssh/test-1-ed25519.pub
  - ~/.ssh/test-2-ed25519.pub
  - ~/.ssh/test-3-ed25519.pub
tags:
  - role/test
  - stack/docker
  - role/infra
  - stack/dual-agent-test
---

# VPS-test-3: Stage-Infra (docker-compose стенды + бенчмарки)

## Подключение

```bash
ssh -p {{port}} {{user}}@{{ip}}
```

### С явным указанием ключа

```bash
ssh -p {{port}} -i ~/.ssh/test-3-ed25519 {{user}}@{{ip}}
```

## Характеристики

| Параметр | Значение |
| --- | --- |
| Роль | Stage-Infra (docker-compose стенды) |
| Провайдер | (уточнить) |
| Тариф | (уточнить) |
| ID инстанса | (уточнить) |
| Локация | (уточнить) |
| ОС | Ubuntu 24.04 LTS |
| vCPU | 2 |
| RAM | 4 ГБ |
| Диск | 60 ГБ |
| Цена | ~400–600 ₽/мес |
| Панель | (URL биллинга) |
| Дата покупки | 2026-09-25 |

## Роль в архитектуре

**VPS-test-3 = docker-compose стенды + бенчмарки моделей.**

Здесь крутятся изолированные compose-проекты:

- **Node-RED** — low-code оркестратор для автоматизаций.
- **Mosquitto MQTT** — брокер сообщений.
- **Traefik** — reverse-proxy с поддержкой Docker labels.
- **Ollama** — self-hosted LLM (CPU; GPU-пасс-through если VPS-3 с GPU).
- **Benchmarks** — бенчмарки моделей на наших задачах.

Изолирован от прода: отдельный SSH-ключ (`~/.ssh/test-3-ed25519`), отдельная docker-сеть, все порты только `127.0.0.1` (через Cloudflare Tunnel, если нужен внешний доступ).

## SSH-ключи

Сгенерированы и готовы к добавлению на провайдера:

| Ключ | Fingerprint | Назначение |
| --- | --- | --- |
| test-1-ed25519 | SHA256:BBpl0JtFE6kda+GeL1DWXqawKtVwHZd3XFDlEYCCvMk | Stage-pi |
| test-2-ed25519 | SHA256:44AJ9dmSe2kG33FvVORwgvb++KIw8QWbqq3dfNcaHMg | Stage-Hermes |
| test-3-ed25519 | SHA256:ayAonzuqotDCqQoxrIC/lsLm85nNNkFZuWahETQgSH8 | Stage-Infra |

## Подготовка к деплою

### До подключения

- [x] Сгенерированы SSH-ключи: `test-1`, `test-2`, `test-3` ed25519
- [ ] Добавить публичные ключи в личный кабинет провайдера
- [ ] Записать IP/логин/порт в frontmatter

## Теги

`#role/test` `#stack/docker` `#role/infra` `#stack/dual-agent-test`

## Заметки

- **2026-09-25:** VPS куплен (или планируется), доступ не настроен.
- SSH-ключи сгенерированы локально на ноутбуке.
- После получения доступа — заполнить frontmatter, провести hardening, развернуть через `docker compose up -d`.

## Связи

- [docker-test-stack](../wiki/concepts/docker-test-stack.md) — концепт test-инфраструктуры.
- [dual-agent-stack](../wiki/concepts/dual-agent-stack.md) — прод-стек, от которого изолируемся.
- [hshp-host](../wiki/entities/hshp-host.md) — пример провайдера.
- [model-shortlist](../wiki/comparisons/2026-09-25-model-shortlist.md) — выбор моделей для бенчмарков.
