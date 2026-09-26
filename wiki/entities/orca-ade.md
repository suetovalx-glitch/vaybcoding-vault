# Orca ADE (Agent Development Environment)

## Summary

**Orca** (<https://www.onorca.dev>) — **Agent Development Environment (ADE)** от компании **Stably, Inc.**, бэкенд от **Y Combinator**, 78.1k stars на GitHub. Free, open-source (MIT), кросс-платформенный (macOS/Windows/Linux + iOS/Android companion). **Worktree-first IDE**, который запускает несколько AI-агентов параллельно в изолированных git worktrees — Claude Code, Codex, OpenCode, Grok, Gemini, Cursor CLI, **Pi**, **Hermes Agent**, Kimi, Qwen Code и др. (BYOA — bring your own agent/subscription). Для нашего [[wiki/concepts/dual-agent-stack]] — это **опциональный GUI-фронтенд** для всего стека, не замена Hermes.

## Current Understanding

### Что это

- **Agent-first IDE / ADE** (Agent Development Environment) — рабочее окружение, в котором живут AI-агенты, а не человек с текстовым редактором.
- **Worktree-first:** каждый агент работает в своём изолированном git worktree → несколько агентов параллельно без конфликтов.
- **Bring Your Own Agent / Subscription:** можно использовать уже купленные подписки на Claude Code / Codex / Cursor CLI / Gemini и др. Не привязан к одному провайдеру.
- **Ghostty-класс терминал** с infinite horizontal/vertical/nested splits — можно смотреть логи сервера, пока AI кодит рядом, всё в одном окне.
- **Встроенные:** diff review, embedded browser, SSH remote development.
- **Кросс-платформенный:** macOS (ARM64/Intel), Windows, Linux + iOS/Android companion.
- **Лицензия:** MIT, **бесплатный**.

### Кто делает

- **Компания:** Stably, Inc. (<https://stably.ai>).
- **Бэкенд:** **Y Combinator**.
- **GitHub:** <https://github.com/stablyai/orca> — **78.1k stars** на момент фиксации (2026-09-25).
- **Discord:** <https://discord.gg/fzjDKHxv8Q>.
- **X (Twitter):** <https://x.com/orca_build>.

### Поддерживаемые агенты (выдержка из onorca.dev)

> Claude Code · Codex · OpenCode · Grok · Gemini · Cursor · GitHub Copilot · OpenCode · Amp · OpenClaude · Antigravity · **Pi** · oh-my-pi · **Hermes Agent** · Goose · Auggie · Charm · Cline · Codebuff · Command Code · Continue · Droid · Kilocode · Kimi · Kiro · Mistral Vibe · Qwen Code · Rovo Dev · any other CLI agent.

### Что решает Orca

- **Multi-agent orchestration** — несколько агентов в одном окне, каждый в своём worktree.
- **Контекст-инжиниринг** — worktree = изоляция, git как source of truth, легко откатить.
- **Удобный diff-review** — изменения AI видны сразу, можно approve/reject.
- **Параллельный запуск** — Claude Code делает auth, Codex — API, OpenCode — фронт. Не мешают друг другу.
- **SSH remote** — можно запускать агентов на удалённом VPS прямо из GUI.
- **PDF diff preview, hidden-file quick-open, configurable worktree cards, markdown preview search, image rendering** — из последних релизов.

### Отличия от Cursor / Windsurf

- **Не текстовый редактор с AI-плагином**, а **IDE-обёртка вокруг агентов**.
- **Worktree-native** — у Cursor worktree support, но не first-class.
- **BYOA** — не нужно покупать подписку Orca, используешь свои.
- **MIT + open-source** — нет вендорлока, можно форкнуть.
- **Y Combinator** — серьёзный фандбейз, активная разработка.

## Что меняет для нашего dual-agent-stack

В [[wiki/concepts/dual-agent-stack]] мы планировали:

- VPS-1: Hermes (Telegram-бот, cron, оркестратор).
- VPS-2: pi-coding-agent (TUI/CLI/RPC, исполнитель).
- Связь: Cloudflare Tunnel, JSON-RPC `delegate_task`.

**С Orca добавляется опциональный слой GUI на локальной машине:**

```text
Локальная машина (Windows/Mac/Linux)
  └─ Orca ADE (бесплатный)
       ├─ Worktree #1: Hermes (agent) → SSH-в-VPS-1
       ├─ Worktree #2: pi-coding-agent (agent) → SSH-в-VPS-2
       └─ Worktree #3: свой код/проект (Claude Code / Codex / Cursor CLI)
```

**Что это даёт:**

1. **GUI-интерфейс** для обоих VPS-агентов без своего фронтенда.
2. **Worktree isolation** — Hermes и pi работают в разных worktrees, не ломают main.
3. **Diff-review** всех изменений AI до merge.
4. **Параллельный запуск** нескольких агентов.
5. **SSH-в-VPS** встроен — не нужен отдельный терминал.
6. **Browser-automation** встроенный.
7. **Mobile companion** для iOS/Android — мониторинг на ходу.

## Как интегрировать (вариант A — рекомендую)

### Установка Orca на локальной машине

1. Скачать: <https://www.onorca.dev/download> (macOS / Windows / Linux).
2. Установить.
3. Создать SSH-ключ для VPS: `ssh-keygen -t ed25519 -C "orca@dual-stack" -f ~/.ssh/orca-ed25519`.
4. Добавить публичный ключ в `~/.ssh/authorized_keys` на VPS-1 и VPS-2.

### Настройка worktrees

1. Подключить VPS-1 и VPS-2 как remote hosts в Orca (встроенный SSH).
2. Создать worktree `hermes-vps1` (на VPS-1) и `pi-vps2` (на VPS-2).
3. В каждом worktree — выбрать агента: Hermes или pi-coding-agent.
4. BYOA: подключить свои подписки (openrouter API key, wormsoft API key, xiaomi-token-plan API key).

### Запуск

1. Открыть worktree `hermes-vps1` → запускается Hermes Agent.
2. Открыть worktree `pi-vps2` → запускается pi-coding-agent.
3. Дополнительно — worktree для своего кода, например, vault/`wiki/`-редактирования через Claude Code / Cursor CLI.

### Что НЕ меняется

- **VPS-1 (Hermes) и VPS-2 (pi-coding-agent) остаются на отдельных VPS.** Orca — это GUI-фронтенд, не замена VPS.
- **Cloudflare Tunnel, JSON-RPC `delegate_task`, MCP-серверы** — всё работает как было.
- **Hermes всё ещё принимает сообщения из Telegram** (Orca — это дополнительный канал, не основной).

## Альтернативы

- **Cursor** — проприетарный, дороже ($20/мес), хороший, но не worktree-first.
- **Windsurf** — проприетарный, тоже дорогой, plan-then-execute.
- **VS Code + Claude Code extension** — не worktree-first.
- **Conductor** — позиционируется как альтернатива, но Orca в маркетинге прямо упоминает «Conductor alternative».
- **Терминал + tmux + git worktree руками** — работает, но GUI сильно удобнее.

## Что стоит попробовать

- [ ] Скачать Orca на локальную машину, установить.
- [ ] Создать SSH-ключ `~/.ssh/orca-ed25519`, добавить на оба VPS.
- [ ] Подключить VPS-1 и VPS-2 как remote hosts в Orca.
- [ ] Создать worktrees `hermes-vps1` и `pi-vps2`.
- [ ] Привязать свои API-ключи (openrouter, wormsoft, xiaomi).
- [ ] Запустить Hermes и pi-coding-agent через Orca GUI.
- [ ] Сравнить UX: чистый SSH+tmux vs Orca ADE.

## Риски

- **Зрелость продукта** — Orca относительно молодой (хотя 78k stars и Y Combinator). Возможны баги, частые breaking changes.
- **Зависимость от Stably, Inc.** — если компания закроется, ADE останется (MIT), но активная разработка прекратится.
- **Не проверен на Windows** — у меня Windows, надо проверить, что всё работает.
- **Безопасность SSH** — Orca получает доступ к VPS через SSH-ключ, нужно хранить ключ правильно.

## План действий

- [ ] Создать entity-страницу (этот файл).
- [ ] Установить Orca на локальную машину, проверить работу на Windows.
- [ ] Обновить [[wiki/concepts/dual-agent-stack]] — добавить Orca ADE как опциональный GUI-фронтенд.
- [ ] Обновить [[wiki/overview]] — добавить ссылку на Orca.
- [ ] После установки — написать краткий обзор впечатлений.
- [ ] Решить, использовать ли Orca как основной GUI или держать как опцию.

## Evidence

- `https://www.onorca.dev` — официальный сайт, описание, FAQ, JSON-LD.
- `https://github.com/stablyai/orca` — репозиторий (78.1k stars, MIT).
- `https://stably.ai` — компания-разработчик.
- JSON-LD с сайта: SoftwareApplication, Free, MIT, ADE.
- [[wiki/concepts/dual-agent-stack]] — концепт, для которого Orca становится GUI-фронтендом.
- [[wiki/entities/hermes-agent]] — главный герой VPS-1, поддерживается Orca.
- [[wiki/entities/pi-agent]] — главный герой VPS-2, поддерживается Orca.

## Related Pages

- [[wiki/overview]] — карта базы.
- [[wiki/entities/hermes-agent]] — агент VPS-1, поддерживается Orca.
- [[wiki/entities/pi-agent]] — агент VPS-2, поддерживается Orca.
- [[wiki/concepts/dual-agent-stack]] — концепт развёртывания (Orca как опциональный GUI).
- [[wiki/entities/cursor]] — альтернатива IDE, но не worktree-first.
- [[wiki/entities/windsurf]] — альтернатива IDE.
- [[wiki/comparisons/2026-09-25-model-shortlist]] — выбор LLM, не путать с Orca ADE.

## Contradictions / Uncertainty

- **Orca ≠ Orca от BAAI** — разные продукты с одинаковым названием. Наша Orca — ADE, BAAI Orca — world foundation model (см. [[wiki/comparisons/2026-09-25-model-shortlist]]).
- **Зрелость продукта** — 78k stars впечатляют, но это не обязательно означает production-ready для серьёзного прода. Нужно тестировать.
- **Windows-поддержка** — заявлена, но не проверена на нашей машине.
- **Цена** — сейчас бесплатный, MIT. Если Stably начнёт монетизировать через enterprise — может стать платным.

## Next Questions

- Установить Orca и проверить на Windows.
- Проверить, что SSH-доступ к VPS работает через Orca без багов.
- Проверить, что Hermes и pi-coding-agent корректно запускаются как «любой CLI agent».
- Решить, делать ли Orca основным GUI или оставить как опцию.
- Мониторить активность разработки (<https://github.com/stablyai/orca/releases>).

## Change Impact on Wiki

- Создан `wiki/entities/orca-ade.md` — entity-страница.
- Будет обновлён [[wiki/concepts/dual-agent-stack]] — Orca как опциональный GUI-фронтенд.
- Будет обновлён [[wiki/overview]] — ссылка на Orca.
- Запись в `wiki/log.md`.
- Запись в `Сессии/2026-09-25/диалог-12-orca-ade.md`.
- Обновление `Сессии/2026-09-25/_summary.md`.
- Обновление `Отчет/2026-09-25-итог-дня.md`.
