# Lint-отчёт: первая полная ревизия (2026-09-24)

## Source Metadata

- **Дата:** 2026-09-24.
- **Тип:** первая полная ревизия (baseline) + одновременно ingest-сеанс.
- **Триггер:** пользователь «Сделай ревизию».
- **Покрытие:** `raw/`, `raw/Clippings/`, корень проекта.

## Сводка

| Категория | Количество |
| --- | --- |
| Новых материалов | 6 ключевых + 3 кейс-расширения |
| Необработанных старых | много (архив, см. ниже) |
| Частично обработанных | 2 (Hermes overview + Telegram-кейсы) |
| Дублей | 1 (`raw/Бещенная задума.md` ↔ `raw/Бешенная задумка.md`) |
| Материалов, потребовавших обновления существующих страниц | 0 (база новая) |

## Что найдено

### Релевантное для вайбкодинга — проинтегрировано

- `raw/Clippings/LLM Wiki — Pi Agent.md` (12 763 байт, 2026-09-23) — саммари → [[wiki/sources/2026-09-23-llm-wiki-pi-agent]].
- `raw/Clippings/LLM Wiki — VS Code.md` (11 848 байт, 2026-09-23) — саммари → [[wiki/sources/2026-09-23-llm-wiki-vscode]].
- `raw/Clippings/LLM Wiki — Docker.md` (11 917 байт, 2026-09-23) — саммари → [[wiki/sources/2026-09-23-llm-wiki-docker]].
- `raw/Clippings/Самообучающийся ИИ-агент Hermes...md` (22 333 байт, 2026-09-19) — саммари → [[wiki/sources/2026-09-19-hermes-agent-overview]].
- `raw/Сборник/Hermes — инструкция по установке.md` (2 144 байт) — использован как дополнение к Hermes overview.
- `raw/Telegram/documents/CLAUDE - 20260919014812258.md` (CLAUDE.md проекта) — саммари → [[wiki/sources/2026-09-19-project-claude-md]].
- `raw/начальный промт для pi.md` (8 010 байт, 2025-09-15) — саммари → [[wiki/sources/2026-09-15-prompts-for-pi]].
- `raw/Бешенная задумка.md` (35 300 байт, 2025-09-17) + `raw/Без названия.md` (5 932 байт, 2025-09-22) — объединены в саммари → [[wiki/sources/2026-09-18-ai-vps-control]].
- `raw/Telegram/Гермес у меня дорос...md`, `raw/Telegram/Полгода я платил...md`, `raw/Telegram/Хватит лезть в терминал...md` — кейс-расширения, отражены в Hermes overview и AI-VPS source.

### Концепты, созданные как wiki-страницы

- [[wiki/concepts/llm-wiki-template]] — методология Карпати.
- [[wiki/concepts/agent-memory-skills]] — память и навыки агента.
- [[wiki/concepts/mcp-basics]] — Model Context Protocol.
- [[wiki/concepts/prompt-pattern-json-out]] — строгий JSON-вывод.
- [[wiki/concepts/vault-raw-wiki-pipeline]] — реализация пайплайна в этом vault.

### Сущности, созданные как wiki-страницы

- [[wiki/entities/hermes-agent]] — главный герой.
- [[wiki/entities/amvera-cloud]] — PaaS-деплой.
- [[wiki/entities/openrouter]] — мульти-LLM-провайдер.
- [[wiki/entities/vscode]] — базовая IDE.
- [[wiki/entities/docker]] — упаковка.
- [[wiki/entities/pi-agent]] — coding agent SDK.
- [[wiki/entities/openclaw]] — stub (без полноценного источника).
- [[wiki/entities/cloudflare-tunnel]] — публикация self-hosted.

### Архивно оставлено (без wiki-интеграции в этом сеансе)

- `raw/Clippings/Памяткашпаргалка по SQL.md` (90 714 байт) — большая SQL-шпаргалка. Не в фокусе вайбкодинга, но пригодится для SQL-навыков агента.
- `raw/Clippings/Большая шпаргалка по Docker как распилить монолитный проект на части.md` (47 124 байт) — DevOps-шпаргалка. Пересекается с [[wiki/entities/docker]], но в фокус не берём.
- `raw/Clippings/Собственное S3-хранилище на базе MinIO.md` (38 777 байт) — инфраструктура.
- `raw/Сборник/OpenAPI...`, `Swagger...` — документация.
- `raw/Сборник/Автоматическое создание резервных копий...`, `Бэкапы VPS с Restic...`, `Создание резервных копий VPS на Яндекс Диск` — backup-стратегии.
- `raw/Сборник/Интерфейс командной строки Yandex Cloud`, `Практика. Создание ВМ...` — YC-инфраструктура.
- `raw/Сборник/Hermes — инструкция по установке.md` — учтена в [[wiki/sources/2026-09-19-hermes-agent-overview]].
- `raw/Сборник/Obisidian плагины.md`, `raw/Templaters/АЛИСА ИИ.md` — об Obsidian/шаблонах.
- `raw/Сборник/Настройка autossh.md`, `raw/Учеба/Шпаргалка по SSH.md`, `raw/Учеба/Шпаргалка по WSL.md` — SSH-шпаргалки.
- `raw/Учеба/Docker.md`, `raw/Учеба/Шпаргалка по Podman.md`, `raw/Учеба/Podman обратная сторона...md` — Docker/Podman.
- `raw/Учеба/Учим API.md`, `raw/Учеба/Учим GIT.md`, `raw/Учеба/компактные шпаргалки.md` — базовые шпаргалки.
- `raw/Учеба/Шпаргалка по Postman.md` — инструменты.
- `raw/Учеба/Быстрый деплой бота...`, `raw/Учеба/Применение Portainer...` — CI/CD.
- `raw/Учеба/S3 и Yandex Object Storage.md`, `raw/Учеба/Yandex Object Storage.md` — хранилища.
- `raw/Учеба/Бэкап VPS.md`, `raw/Учеба/Для бэкапа VPS на Яндекс Диск.md`, `raw/Учеба/Бэкап VPS Yandex Disk.md`, `raw/Учеба/бэкап сайта на VPS.md` — бэкапы.
- `raw/Учеба/Изучаем RSYNC.md`, `raw/Учеба/Шпаргалка по настройке VPS...md`, `raw/Учеба/Шпаргалка по rsync.md` — серверные шпаргалки.
- `raw/VPS/*` — собственные VPS-заметки.
- `raw/Lora/База знаний MeshWorks...` — посторонняя тема.
- `raw/AlisaAI/*`, `raw/Excalidraw/*`, `raw/PDF/*`, `raw/Tags/Tags.md`, `raw/Vault.md` (пустой), `raw/Templaters/АЛИСА ИИ.md` — служебное/нерелевантное.
- Telegram-материалы про роутер Cudy, обзоры, фото, zip/apk-файлы — бытовое.
- `raw/Telegram/documents/m_upgrade_*.zip`, `openwrt-*.zip`, `WR3000U-*.zip`, `UV_AIR_DROID_*.apk` — прошивки/приложения.
- `raw/Telegram/Промт установки «Второго мозга» - ...md` — содержит только ссылки на Notion, **внешние ресурсы недоступны** для AI-агента, нужно попросить пользователя сделать локальный экспорт.

### Дубли

- `raw/Бешенная задумка.md` (35 300 байт) и `raw/Бещенная задума.md` (36 637 байт) — почти дубль, но в `Бещенная задума.md` есть уникальный фрагмент про обновление и установку утилит на сервере. Решено: в `raw/` не трогаем, в wiki унесли только общий концепт, уникальный фрагмент отражён в source-summary.

## Orphan / weak-link check

- [[wiki/entities/openclaw]] — пока stub без собственного источника, только упоминания в Hermes. **Стоит решить на следующей ревизии:** либо найти источник, либо удалить.
- [[wiki/entities/pi-agent]] — есть source-summary, есть связи, ок.
- Все concept-страницы имеют минимум одну входящую и одну исходящую wiki-ссылку, ок.
- Все entity-страницы аналогично.

## Противоречия

- В Telegram-кейсе «Полгода я платил...» автор говорит, что перешёл с OpenClaw на Hermes. В обзорной статье про Hermes этого не упоминается. Решено: фиксируем обе версии явно — основная статья описывает Hermes как «новый», Telegram-кейс подтверждает сравнение. Противоречия нет, есть разные углы зрения.

## Что спасено от потери

- CLAUDE.md проекта, лежавший в Telegram, не потерян — теперь есть его source-summary в `wiki/sources/`.
- Три Telegram-кейса про Hermes (полгода платил, дорос до 6 сабагентов, дашборд через Cloudflare Tunnel) зафиксированы как кейс-расширения в Hermes overview.
- `raw/Без названия.md` (Hermes Desktop через SSH-туннель) интегрирован в AI-VPS source.
- `raw/начальный промт для pi.md` — важный pattern-контент, теперь есть и source, и concept.

## Что стоит обработать следующим приоритетом

1. **Notion-материалы** — попросить локальный экспорт, иначе обработка невозможна.
2. **SQL/Docker/S3-шпаргалки** — в следующих сеансах перевести в concept-страницы по «БД для AI-агентов», «Docker-паттерны для агентов», «Объектные хранилища» (по мере появления связного материала, не раньше).
3. **Первые кейсы по вайбкодингу** — нужен собственный опыт пользователя или внешние статьи.
4. **Cursor, Windsurf** — нужны источники, чтобы закрыть пробелы в карте AI IDE.
5. **OpenClaw** — либо найти полноценный источник, либо удалить stub-страницу.
6. **Темы «SaaS с ИИ», «Ниши», «Монетизация»** — нужны первые источники, чтобы заводить подпапки.

## Что было создано / обновлено (полный список)

### Создано

- `wiki/index.md` (обновлён от старой stub-версии).
- `wiki/log.md`.
- `wiki/overview.md`.
- `wiki/sources/2026-09-23-llm-wiki-pi-agent.md`.
- `wiki/sources/2026-09-23-llm-wiki-vscode.md`.
- `wiki/sources/2026-09-23-llm-wiki-docker.md`.
- `wiki/sources/2026-09-19-hermes-agent-overview.md`.
- `wiki/sources/2026-09-19-project-claude-md.md`.
- `wiki/sources/2026-09-15-prompts-for-pi.md`.
- `wiki/sources/2026-09-18-ai-vps-control.md`.
- `wiki/concepts/llm-wiki-template.md`.
- `wiki/concepts/agent-memory-skills.md`.
- `wiki/concepts/mcp-basics.md`.
- `wiki/concepts/prompt-pattern-json-out.md`.
- `wiki/concepts/vault-raw-wiki-pipeline.md`.
- `wiki/entities/hermes-agent.md`.
- `wiki/entities/amvera-cloud.md`.
- `wiki/entities/openrouter.md`.
- `wiki/entities/vscode.md`.
- `wiki/entities/docker.md`.
- `wiki/entities/pi-agent.md`.
- `wiki/entities/openclaw.md` (stub).
- `wiki/entities/cloudflare-tunnel.md`.
- `wiki/lint-reports/2026-09-24-initial-revision.md` (этот файл).

### Обновлено

- (база была пустой, обновлять было нечего — кроме `wiki/index.md`, переписан с нуля)

## Почему решения такие

- **Не завёл отдельные тематические подпапки** (`wiki/Cursor/`, `wiki/Сlаude-Code/`, `wiki/Сursor/` и т. п.) — нет источников по этим темам. Когда появятся — заведу по принципу «одна крупная тема = одна подпапка с `index.md`».
- **Сохранил плоскую структуру `raw/`** — пользовательская организация (`Clippings/`, `Сборник/`, `Telegram/` и т. д.) работает, не ломаю.
- **Русифицировал содержимое**, оставил английский только в технических терминах, командах и точечных цитатах.
- **Stub-страницу [[wiki/entities/openclaw]]** оставил явно, чтобы не потерять упоминание, но с честным признанием «источника пока нет».

## Замечание для пользователя

- В `raw/Telegram/Промт установки «Второго мозга»` — только внешние ссылки на Notion, я не могу их прочитать. Чтобы wiki-страницы по этим материалам появились, нужен локальный экспорт страниц Notion (PDF / Markdown / HTML).
