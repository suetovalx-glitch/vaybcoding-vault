# VS Code

## Summary

Visual Studio Code — основной редактор кода от Microsoft. В контексте вайбкодинга интересен как **платформа для AI-ассистентов и агентов**: подключается к LLM через расширения, поддерживает Remote Development (SSH, WSL, туннели), Dev Containers, Workspace Trust.

## Current Understanding

- Версия 1.137.0 актуальна на сентябрь 2026.
- Подсистемы, релевантные для AI-агентских стеков: API расширений, Workspace Trust, Remote Development, встроенный терминал, Git-интеграция, Dev Containers, Tasks.
- GitHub Copilot/Chat/Agents — отдельная тема, в LLM Wiki-обзоре VS Code явно не покрыта.
- VS Code — **общий движок** для Cursor и Windsurf, поэтому многие расширения и настройки переносимы.

## Evidence

- [[wiki/sources/2026-09-23-llm-wiki-vscode]] — основной источник.
- [[wiki/concepts/llm-wiki-template]] — этот клиппинг часть той же серии.

## Related Pages

- [[wiki/entities/pi-agent]] — один из вариантов coding agent, работающих в IDE-подобной среде.
- [[wiki/overview]] — упомянут в разделе «AI IDE и редакторы».

## Contradictions / Uncertainty

- Стоит ли в нашей базе отдельно рассматривать Cursor и Windsurf, или они идут как «надстройки над VS Code» — пока не решено.

## Next Questions

- Какие конкретно AI-расширения для VS Code реально используются в вайбкодинге в 2026.
- Сравнение с Cursor и Windsurf — нужно собрать отдельные источники.
