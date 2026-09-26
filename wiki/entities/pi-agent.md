# Pi Agent

## Summary

Pi Agent — набор инструментов от разработчиков pi-coding-agent для построения LLM-агентов. В отличие от Hermes, это **SDK/фреймворк**, а не готовый продукт с Telegram-ботом. Состоит из трёх пакетов: `pi-ai` (мульти-провайдерный API + потоковые события), `pi-agent-core` (обвязка: повороты, события, хуки), `pi-coding-agent` (интерактивный/печатный/RPC/SDK-режимы + TUI).

## Current Understanding

- Поставляется как библиотека + CLI, не как SaaS.
- Поддерживает пользовательские и OpenAI-совместимые провайдеры.
- Работа с сеансами: fork, clone, branch, share.
- Расширения, пакеты, навыки, сжатие контекста, контейнеризация.
- Локальная модель доверия/безопасности.
- Актуальная версия на 2026-08-10: 0.84.1.

## Evidence

- [[wiki/sources/2026-09-23-llm-wiki-pi-agent]] — основной источник.
- [[wiki/concepts/llm-wiki-template]] — LLM Wiki-обзор, частью которого является Pi Agent.

## Related Pages

- [[wiki/entities/hermes-agent]] — альтернативный (готовый) агент для сравнения.
- [[wiki/entities/vscode]] — IDE-контекст, в котором может работать.
- [[wiki/concepts/agent-memory-skills]] — общая концепция, реализованная в т. ч. в Pi Agent.

## Contradictions / Uncertainty

- Насколько Pi Agent конкурирует с Claude Code напрямую — нужны прямые сравнения.

## Next Questions

- Реальные кейсы использования Pi Agent как библиотеки (не как CLI).
- Размер community и частота обновлений.
