# Cloudflare Tunnel

## Summary

Cloudflare Tunnel (ранее Argo Tunnel) — сервис Cloudflare, который пробрасывает локальный сервис в интернет через защищённый туннель без открытия входящих портов и без покупки домена. Для AI-агентских стеков используется как способ вывести self-hosted дашборд (Hermes, n8n, Gitea и т. п.) в публичный URL за минуты.

## Current Understanding

- Бесплатный тариф.
- Не нужен публичный IP, не нужно пробрасывать порты на роутере.
- Не нужен собственный домен на старте.
- Выживает после ребута сервера (постоянный URL).
- В кейсе «Хватит лезть в терминал» — 5 минут настройки, доступ к дашборду Hermes с ноутбука/телефона/планшета по одному URL.
- В материалах рассматривается как **замена SSH-туннелю** для self-hosted дашбордов.

## Evidence

- [[wiki/sources/2026-09-18-ai-vps-control]] — основной источник (Telegram-кейс).
- [[wiki/entities/hermes-agent]] — дашборд Hermes, который выводится наружу.

## Related Pages

- [[wiki/entities/hermes-agent]] — основной «пассажир» в наших материалах.
- [[wiki/sources/2026-09-18-ai-vps-control]] — практика применения.

## Contradictions / Uncertainty

- Конкретные ограничения бесплатного тарифа в 2026 (количество туннелей, трафик) — нужна актуальная справка Cloudflare.

## Next Questions

- Какой минимальный набор настроек нужен для прод-нагрузки (Basic Auth, rate limits, Access policies).
- Сравнение с alternatives (Tailscale Funnel, ngrok, localhost.run).
