# Деплой docker-compose на test-VPS — Отчёт

**Дата:** 2026-09-26

| VPS | IP | Статус | Детали |
| ----- | ----- | -------- | -------- |
| test-1 (Stage-pi) | 78.17.67.159 | [OK] OK | NAME                  IMAGE                           COMMAND                  SERVICE           CREATED         STATUS                                    PORTS
cloudflared-test-pi   cloudflare/cloudf... |
| test-2 (Stage-Hermes) | 31.77.192.54 | [OK] OK | NAME          IMAGE                              COMMAND                  SERVICE   CREATED         STATUS                  PORTS
hermes-test   nousresearch/hermes-agent:latest   "/opt/hermes/docker/…... |
| test-3 (Stage-Infra) | 168.113.157.93 | [FAIL] FAIL | Image nodered/node-red:latest Pulling
 Image ollama/ollama:latest Pulling
 Image traefik:v3 Pulling
 Image eclipse-mosquitto:2 Pulling
failed to copy: httpReadSeeker: failed open: failed to do req... |

## Детали

### test-1 (Stage-pi) (78.17.67.159)

Статус: OK

```
NAME                  IMAGE                           COMMAND                  SERVICE           CREATED         STATUS                                    PORTS
cloudflared-test-pi   cloudflare/cloudflared:latest   "cloudflared --no-au…"   cloudflared       3 seconds ago   Restarting (255) Less than a second ago   
pi-test               node:22-bookworm-slim           "docker-entrypoint.s…"   pi-coding-agent   3 seconds ago   Up Less than a second
```

### test-2 (Stage-Hermes) (31.77.192.54)

Статус: OK

```
NAME          IMAGE                              COMMAND                  SERVICE   CREATED         STATUS                  PORTS
hermes-test   nousresearch/hermes-agent:latest   "/opt/hermes/docker/…"   hermes    3 seconds ago   Up Less than a second
```

### test-3 (Stage-Infra) (168.113.157.93)

Статус: FAIL

```
Image nodered/node-red:latest Pulling 
 Image ollama/ollama:latest Pulling 
 Image traefik:v3 Pulling 
 Image eclipse-mosquitto:2 Pulling 
failed to copy: httpReadSeeker: failed open: failed to do request: Get "https://production.cloudfront.docker.com/registry-v2/docker/registry/v2/blobs/sha256/8c/8c4aa03990b1b9b542d42c0d4daabe03381d3e06c0279f82936eeee81cf2c905/data?Expires=1790506611&Signature=KkeIuiQ~r94bVrVcYfUe0YTJzZJFu49KRleLmt1AgefnQK3K3asI4fdqrcVbmJmmLpFqQs4FKfrS-EUquqYEWIenLgCBpm8OlxGBzGOcI~j2oTwHvJbgYG17~Y8f3RVSb1WoJzvHLXJC1VG1dA5Qf13Oknx2swMzOjM59rvKgrT4kevmEONgNS6GxyWhsPkG4zBgDd6E17JBqcf5O6gAgo2WRGiOFJ5smyITD0fe3whdhiNqV3CmRu7NaqkvYkxqGF1sednPAYtpechg5gviz5hhoO6IiakUTOeZFdPmCMN6K~kqnu8DIrFLbLv23QrfIDTwH~FlR~E98tiYvBSOiA__&Key-Pair-Id=K2C9XPB6FLAKUF": net/http: TLS handshake timeout
```
