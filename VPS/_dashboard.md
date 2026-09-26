# VPS Dashboard

Все твои VPS-серверы в одной таблице. Обновляется автоматически при изменении frontmatter.

## Все серверы

```dataview
TABLE
    ip AS "IP",
    user AS "User",
    port AS "Port",
    os AS "ОС",
    provider AS "Провайдер",
    location AS "Локация",
    created AS "Создан"
FROM "VPS"
WHERE ip != null
SORT provider ASC, created ASC
```

## По провайдерам

```dataview
TABLE
    ip AS "IP",
    os AS "ОС",
    location AS "Локация",
    created AS "Создан"
FROM "VPS"
WHERE ip != null
SORT provider ASC, location ASC
```

## По локациям

```dataview
TABLE
    ip AS "IP",
    user AS "User",
    os AS "ОС",
    provider AS "Провайдер"
FROM "VPS"
WHERE ip != null
SORT location ASC
```

## Неполные карточки

```dataview
TABLE
    ip AS "IP",
    file.link AS "Файл"
FROM "VPS"
WHERE ip = null OR ip = ""
```

## Сводка

```dataview
TABLE WITHOUT ID
    provider AS "Провайдер",
    length(rows) AS "Кол-во серверов"
FROM "VPS"
WHERE ip != null
GROUP BY provider
SORT provider ASC
```

```dataview
TABLE WITHOUT ID
    location AS "Локация",
    length(rows) AS "Кол-во серверов"
FROM "VPS"
WHERE ip != null
GROUP BY location
SORT location ASC
```

```dataview
TABLE WITHOUT ID
    os AS "ОС",
    length(rows) AS "Кол-во серверов"
FROM "VPS"
WHERE ip != null
GROUP BY os
SORT os ASC
```

## Как это работает

Dataview парсит frontmatter всех заметок в папке `VPS/` (включая `_template.md`, `_setup-templater.md`, `_dashboard.md` — но у них нет поля `ip`, поэтому они автоматически отфильтруются через `WHERE ip != null`).

### Что нужно для работы

1. ✅ Плагин Dataview включён в Obsidian — у тебя уже стоит.
2. ✅ Создана хотя бы одна VPS-заметка с frontmatter (используй `VPS/_template.md` как основу).

### Как добавить новый VPS

1. Скопируй `VPS/_template.md`, переименуй (например, `VPS/prod-01.md`).
2. Заполни frontmatter (`ip`, `user`, `port`, `os`, `provider`, `location`, `created`).
3. Сохрани — Dataview обновит таблицу на этой странице автоматически.
