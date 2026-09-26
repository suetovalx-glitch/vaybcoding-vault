# OpenClaw

## Summary

OpenClaw — open-source персональный AI-ассистент от независимой **OpenClaw Foundation (501(c)(3))**, запускается локально и подключается к 20+ мессенджерам через единый **Gateway**. Нет hosted-сервиса, нет токена, нет платного tier. Foundation финансируется Amazon, Lobster Computer Company, Offline Holdings, OpenAI, Red Hat, University of Michigan. На сентябрь 2026 — 388 600+ stars на GitHub, 760+ контрибьюторов.

## Current Understanding

### Архитектура

```
Chat apps + plugins → Gateway → { Pi agent, CLI, Web Control UI, macOS app, iOS/Android nodes }
```

- **Gateway** — единая точка: сессии, инструменты, события, каналы. Control UI, CLI, TUI подключаются к Gateway.
- **Companion apps** — macOS menu bar, iOS/Android nodes (Canvas, камера, screen capture, voice), Windows, Linux.

### Каналы (20+)

WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, IRC, Microsoft Teams, Matrix, Feishu, LINE, Mattermost, Nextcloud Talk, Nostr, Synology Chat, Tlon, Twitch, Zalo, WeChat, QQ, WebChat.

### Модели

Claude, Codex, локальные модели. Подмена через плагин без изменения остального кода. **OpenAI-донор, не владелец.**

### Установка

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

Runtime: **Node 24** (рекомендуется) или Node 22.14+.

### Безопасность по умолчанию

- **DM-pairing** для неизвестных отправителей в Telegram/WhatsApp/Signal/iMessage/Microsoft Teams/Discord/Google Chat/Slack: неизвестный отправитель получает код подтверждения, бот не обрабатывает сообщение до approve.
- Approve: `openclaw pairing approve <code>`.
- Публичные DM требуют явного `dmPolicy="open"` + `"*"` в allowlist.
- **Sandbox** для non-main сессий: `agents.defaults.sandbox.mode: "non-main"`. Backend по умолчанию — **Docker**, альтернативы — SSH и OpenShell.
- **YOLO-аналог отсутствует**: всё подтверждается по умолчанию.
- `openclaw doctor` — диагностика DM-политик.

### Workspace и Skills

- `~/.openclaw/workspace` — root workspace.
- Injected prompt files: `AGENTS.md`, `SOUL.md`, `TOOLS.md`.
- Skills: `~/.openclaw/workspace/skills/<name>/SKILL.md`.
- **MCP** поддерживается.
- Каталог расширений — **ClawHub**.

### Slash-команды (operator quick refs)

`/status`, `/new`, `/reset`, `/compact`, `/think <level>`, `/verbose on|off`, `/trace on|off`, `/usage off|tokens|full`, `/restart`, `/activation mention|always`.

### Минимальный конфиг

```json5
{
  agent: {
    model: "<provider>/<model-id>",
  },
}
```

### История названий

Warelay → Clawdbot → Moltbot → **OpenClaw**.

## Кейс пользователя (из Telegram-материалов)

- Роман Сухов в кейсе «Полгода я платил...» описал переход с OpenClaw на Hermes.
- 4 причины перехода: автообновление памяти, авто-создание скиллов, канбан в браузере, работа на подписке ChatGPT вместо API.
- Этот кейс — **основной сюжет**, по которому в нашей базе появился OpenClaw, и одновременно **причина**, по которой появился [[wiki/entities/hermes-agent]].

## Evidence

- [[wiki/sources/2026-09-24-openclaw]] — основной source (GitHub README + docs + VISION).
- [[wiki/entities/hermes-agent]] — есть `hermes claw migrate` для прямой миграции с OpenClaw.
- [[wiki/entities/pi-agent]] — упомянут в OpenClaw docs как один из интегрируемых движков.
- [[wiki/concepts/agent-memory-skills]] — Skills + AGENTS.md/SOUL.md/TOOLS.md — вариант концепта.
- [[wiki/concepts/mcp-basics]] — MCP поддерживается.
- [[wiki/sources/2026-09-19-hermes-agent-overview]] — где OpenClaw упомянут как «предыдущее поколение».

## Related Pages

- [[wiki/overview]] — раздел «Агенты».
- [[wiki/concepts/llm-wiki-template]] — OpenClaw — пример self-hosted агента, попадающего под паттерн «persisting wiki».

## Contradictions / Uncertainty

- Насколько серьёзно OpenClaw Foundation как governance — зависит от того, как доноры (включая OpenAI) влияют на roadmap.
- Реальная зрелость ClawHub в 2026 — каталог/рейтинг/комьюнити.
- Совместимость skills между OpenClaw и Hermes (`hermes claw migrate` уже есть — это прямой мост).

## Next Questions

- Прямая миграция skills/memory через `hermes claw migrate` — насколько без потерь?
- Реальные кейсы «гибридной» работы: один бот в OpenClaw, другой в Hermes, общаются через `hermes peer` или DM.
- Готовность Foundation к расколу / форку, если governance станет проблемой.
