// _scripts/ssh-from-frontmatter.js
//
// Templater user script: генерирует SSH-команду подключения
// из frontmatter текущей заметки.
//
// Использование в шаблоне:
//
//   <%*
//   const { sshCommand, sshWithKey, scpTo } = await tp.user.sshFromFrontmatter(tp);
//   tR += "```bash\n" + sshCommand + "\n```";
//   %>
//
// Скрипт читает поля из frontmatter заметки:
//   - ip           (обязательно) — IP-адрес или hostname
//   - user         (опционально, default: root) — пользователь SSH
//   - port         (опционально, default: 22) — порт SSH
//   - identityFile (опционально) — путь к SSH-ключу
//   - proxyJump    (опционально) — бастион-хост
//
// Дополнительно:
//   - sshAlias     (опционально) — если задан, команда будет
//     использовать алиас из ~/.ssh/config вместо прямого подключения.
//
// Возвращает объект:
//   {
//     sshCommand:    "ssh user@ip -p 22",            // готовая к запуску команда
//     sshWithKey:    "ssh -i ~/.ssh/key user@ip",    // если задан identityFile
//     scpTo:         "scp <file> user@ip:/path/",     // scp-шаблон
//     isValid:       true|false,                    // валидна ли конфигурация
//     missingFields: ["ip", "user"]                 // список недостающих полей
//   }

async function sshFromFrontmatter(tp) {
    // Достаём frontmatter текущей активной заметки
    const file = tp.file.find_tfile(tp.file.path(true));
    if (!file) {
        return {
            sshCommand: "# файл не найден",
            sshWithKey: "",
            scpTo: "",
            isValid: false,
            missingFields: ["file"],
        };
    }

    // Кэш Obsidian API для чтения frontmatter
    const cache = app.metadataCache.getFileCache(file);
    if (!cache || !cache.frontmatter) {
        return {
            sshCommand: "# frontmatter пуст",
            sshWithKey: "",
            scpTo: "",
            isValid: false,
            missingFields: ["frontmatter"],
        };
    }

    const fm = cache.frontmatter;
    const missing = [];

    // === Обязательное поле ===
    if (!fm.ip) missing.push("ip");
    const ip = fm.ip || "<нет-ip>";

    // === Опциональные с дефолтами ===
    const user = fm.user || "root";
    const port = fm.port || 22;
    const identityFile = fm.identityFile || null;
    const proxyJump = fm.proxyJump || null;
    const sshAlias = fm.sshAlias || null;

    // === Сборка команды ===
    let command;

    if (sshAlias) {
        // Если задан алиас — используем его. Это самый короткий вариант,
        // и он автоматически подхватит все настройки из ~/.ssh/config
        // (проброс ключа, keepalive, проксирование и т.д.)
        command = `ssh ${sshAlias}`;
    } else {
        // Иначе — собираем команду из полей
        const parts = ["ssh"];

        // Порт (только если нестандартный)
        if (port !== 22) {
            parts.push("-p", port);
        }

        // Identity-файл (если задан)
        if (identityFile) {
            // На Windows: заменяем ~ на $HOME или оставляем как есть
            // (Mosh/Git Bash/Windows Terminal понимают ~/).
            // На Unix — просто ~.
            parts.push("-i", identityFile);
        }

        // ProxyJump (бастион)
        if (proxyJump) {
            parts.push("-J", proxyJump);
        }

        // User@host
        parts.push(`${user}@${ip}`);

        command = parts.join(" ");
    }

    // === sshWithKey (вариант с явным ключом, игнорируя sshAlias) ===
    let sshWithKey = command;
    if (!identityFile) {
        // Если ключ не указан, добавляем дефолтный
        const keyPath =
            process.platform === "win32"
                ? "~/.ssh/id_ed25519"
                : "~/.ssh/id_ed25519";
        sshWithKey = command.replace(/^ssh /, `ssh -i ${keyPath} `);
    }

    // === scpTo (шаблон для копирования файлов) ===
    const scpPort = port === 22 ? "" : `-P ${port} `;
    const scpKey = identityFile ? `-i ${identityFile} ` : "";
    const scpTo = `scp ${scpPort}${scpKey}<local-file> ${user}@${ip}:/path/on/server/`;

    return {
        sshCommand: command,
        sshWithKey: sshWithKey,
        scpTo: scpTo,
        isValid: missing.length === 0,
        missingFields: missing,
        metadata: {
            ip: ip,
            user: user,
            port: port,
            identityFile: identityFile,
            proxyJump: proxyJump,
            sshAlias: sshAlias,
        },
    };
}

// Экспорт для Templater
module.exports = sshFromFrontmatter;
