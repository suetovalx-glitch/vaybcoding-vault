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
tags:
  - role/test
  - stack/docker
  - role/infra
  - stack/dual-agent-test
---

# VPS-test-3: Stage-Infra (docker-compose стенды + бенчмарки)

## Подключение

> **Frontmatter пока пустой.** Заполни `ip`, `user`, `password`, затем нажми `Ctrl+P → Templater: Insert template → ssh-command`.

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

## Подготовка к деплою

### До подключения

- [ ] Сгенерировать SSH-ключ: `ssh-keygen -t ed25519 -C "test-3@dual-stack" -f ~/.ssh/test-3-ed25519`
- [ ] Добавить публичный ключ в личный кабинет провайдера.
- [ ] Записать IP/логин/порт в frontmatter.

### При первом подключении

```bash
ssh -p 22 root@<ip>

# Hardening
apt update && apt upgrade -y
useradd -m -s /bin/bash infra
mkdir -p /home/infra/.ssh
cp ~/.ssh/authorized_keys /home/infra/.ssh/
chown -R infra:infra /home/infra/.ssh
chmod 700 /home/infra/.ssh
chmod 600 /home/infra/.ssh/authorized_keys
echo "infra ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/infra

sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/PermitRootLogin yes/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
systemctl restart sshd

ufw default deny incoming
ufw allow out 443
ufw allow out 53
ufw enable

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker infra
```

### Деплой test-infra

```bash
mkdir -p /opt/infra-test/{node-red,mosquitto,traefik,ollama,benchmarks}
cd /opt/infra-test

# Создать docker-compose.yml (см. wiki/concepts/docker-test-stack#vps-test-3-stage-infra)
nano docker-compose.yml

docker network create dual-agent-test 2>/dev/null || true
docker compose up -d
docker compose ps
docker compose logs -f
```

### Доступ к сервисам

Все сервисы слушают только на `127.0.0.1`. Для внешнего доступа — Cloudflare Tunnel.

```bash
# SSH-туннель для локального доступа:
ssh -L 1880:127.0.0.1:1880 -L 1883:127.0.0.1:1883 \
       -L 8080:127.0.0.1:8080 -L 11434:127.0.0.1:11434 \
       infra@<ip>
```

После этого:

- Node-RED: <http://localhost:1880>
- Mosquitto MQTT: localhost:1883
- Traefik dashboard: <http://localhost:8080>
- Ollama API: <http://localhost:11434>

## Smoke-test после деплоя

```bash
# Ollama — скачать модель и спросить:
docker exec ollama-test ollama pull qwen3.6:27b
docker exec ollama-test ollama run qwen3.6:27b "Hello, self-hosted!"

# Mosquitto — подписаться на тестовый топик:
docker exec -it mosquitto-test mosquitto_sub -t 'test/+'

# Node-RED — открыть http://localhost:1880 через SSH-туннель, развернуть тестовый flow.
```

## Теги

`#role/test` `#stack/docker` `#role/infra` `#stack/dual-agent-test`

## Заметки

- **2026-09-25:** VPS куплен (или планируется), доступ не настроен.
- После получения доступа — заполнить frontmatter, провести hardening, развернуть через `docker compose up -d`.
- Self-hosted LLM без GPU будет медленным. Если нужен быстрый LLM — рассмотреть VPS-3 с GPU (стоит дороже).

## Связи

- [docker-test-stack](../wiki/concepts/docker-test-stack.md) — концепт test-инфраструктуры.
- [dual-agent-stack](../wiki/concepts/dual-agent-stack.md) — прод-стек, от которого изолируемся.
- [hshp-host](../wiki/entities/hshp-host.md) — пример провайдера.
- [model-shortlist](../wiki/comparisons/2026-09-25-model-shortlist.md) — выбор моделей для бенчмарков.
