# Сессия 12: Orca ADE — опциональный GUI-фронтенд для dual-agent-stack

**Дата:** 2026-09-25
**Время:** ~04:00 (ночная сессия)
**Ассистент:** MiniMax-M3 (wormsoft)
**Канал:** pi-coding-agent CLI (chat)

## Контекст

После фиксации hshp.host как провайдера VPS-2 (диалог 11) пользователь продолжил разговор. Спросил «можем ли мы использовать Orca?» и прислал ссылку `https://www.onorca.dev`. Первая попытка найти «Orca» через `ai-wormsoft_web_search` привела к **Orca от BAAI** (world foundation model) — это оказался **другой продукт**. После уточнения URL проверил `onorca.dev` напрямую через `fetch_content` — это совсем другая Orca: **Agent Development Environment (ADE)** от Stably, Inc.

## Что обсудили

### Блок 1. Две разные Orca

- **Orca (BAAI):** world foundation model, encoder-decoder, учит world latent space через Next-State-Prediction. 4B параметров, опубликована 2026-07-14. Не развёрнута у инференс-провайдеров. **Не подходит** для нашего стека (не LLM, нужен GPU).
- **Orca (Stably, Inc.):** Agent Development Environment. Worktree-first IDE для запуска нескольких AI-агентов параллельно. Поддерживает **Pi** и **Hermes Agent** в списке «любой CLI agent». Y Combinator, 78.1k stars, MIT, бесплатный.

### Блок 2. Что такое Orca ADE

- **Agent-first IDE / ADE** — рабочее окружение, в котором живут AI-агенты.
- **Worktree-first:** каждый агент работает в своём изолированном git worktree → несколько агентов параллельно без конфликтов.
- **Bring Your Own Agent / Subscription:** Claude Code, Codex, OpenCode, Grok, Gemini, Cursor CLI, Pi, Hermes Agent, Kimi, Qwen Code, Rovo Dev и др.
- **Ghostty-класс терминал** с infinite horizontal/vertical/nested splits.
- **Встроенные:** diff review, embedded browser, SSH remote development.
- **Кросс-платформенный:** macOS (ARM64/Intel), Windows, Linux + iOS/Android companion.
- **Лицензия:** MIT, бесплатный.

### Блок 3. Что это меняет для нашего dual-agent-stack

- В [[wiki/concepts/dual-agent-stack]] мы планировали GUI = свой (Telegram/Discord для Hermes, TUI/CLI для pi).
- **С Orca добавляется опциональный GUI-слой на локальной машине:**
  - Worktree `hermes-vps1` → Hermes Agent → SSH в VPS-1.
  - Worktree `pi-vps2` → pi-coding-agent → SSH в VPS-2.
  - Worktree `my-code` → свой проект через Claude Code / Codex / Cursor CLI.
- **Что это даёт:**
  1. GUI-интерфейс для обоих VPS-агентов без своего фронтенда.
  2. Worktree isolation — Hermes и pi в разных worktrees.
  3. Diff-review всех изменений AI до merge.
  4. Параллельный запуск нескольких агентов.
  5. SSH-в-VPS встроен.
  6. Browser-automation встроенный.
  7. Mobile companion для iOS/Android.

### Блок 4. Созданные артефакты

- **`wiki/entities/orca-ade.md`** — entity-страница по нашему шаблону (обзор, отличия от Cursor/Windsurf, как интегрировать, риски, план действий).
- **`wiki/concepts/dual-agent-stack.md`** — обновлён: добавлен Orca ADE в Evidence, Related Pages, Next Questions, Change Impact.
- **`wiki/index.md`** — добавлена ссылка на Orca в Entities.
- **`wiki/overview.md`** — добавлена инфа в Инфраструктуру.
- **`wiki/log.md`** — запись о находке.
- **`Сессии/2026-09-25/диалог-12-orca-ade-gui-фронтенд.md`** — этот файл.

### Блок 5. Что осталось

- Установить Orca на локальную машину (Windows), проверить работу.
- Создать SSH-ключ `~/.ssh/orca-ed25519`, добавить на оба VPS.
- Подключить VPS-1 и VPS-2 как remote hosts в Orca.
- Попробовать запустить Hermes и pi-coding-agent как «любой CLI agent».
- Решить, делать ли Orca основным GUI или оставить как опцию.

## Принятые решения

- **Orca ADE — опциональный GUI-фронтенд**, не замена VPS. VPS-1 и VPS-2 остаются отдельными VPS-ами.
- **Hermes всё ещё принимает сообщения из Telegram** — Orca это дополнительный канал.
- **BYOA подход:** используем свои подписки (openrouter, wormsoft, xiaomi-token-plan), не покупаем отдельную подписку Orca.
- **Worktree isolation:** Hermes и pi-coding-agent работают в разных worktrees — не ломают main.
- **Документируем, но не форсируем:** Orca — опция, не обязательный компонент. Если он не понравится — есть fallback (терминал + tmux + ручной git worktree).

## Созданные / изменённые артефакты

- `wiki/entities/orca-ade.md` — **создан**.
- `wiki/concepts/dual-agent-stack.md` — **обновлён** (Orca в Evidence/Related/Next/Change Impact).
- `wiki/index.md` — **обновлён** (Entities).
- `wiki/overview.md` — **обновлён** (Инфраструктура).
- `wiki/log.md` — **обновлён** (раздел «Orca ADE — опциональный GUI-фронтенд»).
- `Сессии/2026-09-25/диалог-12-orca-ade-gui-фронтенд.md` — **этот файл**.

## Открытые вопросы

- Windows-поддержка Orca — заявлена, но не проверена.
- Зрелость продукта (78k stars впечатляют, но это не гарантия production-ready).
- Совместимость с нашей версией Node 22 / pi-coding-agent — нужна проверка.
- Цена в будущем — пока бесплатный, но Stably может начать монетизировать через enterprise.
- Hermes Agent конкретно — Orca поддерживает «любой CLI agent», но реально ли это работает с Hermes — нужно проверить.

## Связанные wiki-страницы

- [[wiki/entities/orca-ade]] — новый entity.
- [[wiki/concepts/dual-agent-stack]] — концепт, куда интегрируем Orca.
- [[wiki/entities/hermes-agent]] — агент VPS-1, поддерживается Orca.
- [[wiki/entities/pi-agent]] — агент VPS-2, поддерживается Orca.
- [[wiki/entities/cursor]] — альтернатива IDE, не worktree-first.
- [[wiki/entities/windsurf]] — альтернатива IDE.

## Следующие шаги

- [ ] Скачать Orca на локальную машину: <https://www.onorca.dev/download>.
- [ ] Установить на Windows, проверить запуск.
- [ ] Создать SSH-ключ `~/.ssh/orca-ed25519`.
- [ ] Подключить VPS-1 (AdminVPS) и VPS-2 (hshp.host DE-E2) как remote hosts.
- [ ] Создать worktrees `hermes-vps1` и `pi-vps2`.
- [ ] Привязать свои API-ключи (openrouter, wormsoft, xiaomi).
- [ ] Попробовать запустить Hermes и pi-coding-agent.
- [ ] Сравнить UX: чистый SSH+tmux vs Orca ADE.
- [ ] Задокументировать впечатления в `wiki/queries/`.

## Цитаты / формулировки, которые стоит запомнить

> «Orca ≠ Orca от BAAI — разные продукты. Наша Orca — ADE, BAAI Orca — world foundation model.»

> «Orca ADE — **опциональный GUI-фронтенд**, не замена VPS.»

> «BYOA (Bring Your Own Agent) — не нужно покупать отдельную подписку, используем свои.»

## Технические детали

- **Orca ADE:** <https://www.onorca.dev>
- **GitHub:** <https://github.com/stablyai/orca> — 78.1k stars на 2026-09-25.
- **Компания:** Stably, Inc. (<https://stably.ai>).
- **Бэкенд:** Y Combinator.
- **Лицензия:** MIT, бесплатный.
- **Платформы:** macOS (ARM64/Intel), Windows, Linux + iOS/Android.
- **Поддерживает Pi:** да (явно в списке).
- **Поддерживает Hermes Agent:** да (явно в списке).
- **Discord:** <https://discord.gg/fzjDKHxv8Q>.
- **X:** <https://x.com/orca_build>.
