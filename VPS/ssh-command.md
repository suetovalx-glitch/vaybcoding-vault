<%*
// Шаблон Templater: вставляет SSH-команду подключения,
// сгенерированную из frontmatter заметки.
//
// Использование:
//   1. Settings → Templater → Template folder location → укажи VPS/
//   2. Открой нужную VPS-заметку (с frontmatter).
//   3. Ctrl+P → "Templater: Insert template" → выбери "ssh-command".
//   4. Шаблон вставит SSH-команду в текущую позицию курсора.

const result = await tp.user.sshFromFrontmatter(tp);

if (!result.isValid) {
    tR += `> [!warning] Не хватает полей в frontmatter: \`${result.missingFields.join('`, `')}\`.\n`;
    tR += `> Заполни их и вставь шаблон ещё раз.\n\n`;
}

tR += `## Подключение\n\n`;
tR += `\`\`\`bash\n`;
tR += result.sshCommand + '\n';
tR += `\`\`\`\n\n`;

if (result.sshWithKey !== result.sshCommand) {
    tR += `### С явным указанием ключа\n\n`;
    tR += `\`\`\`bash\n`;
    tR += result.sshWithKey + '\n';
    tR += `\`\`\`\n\n`;
}

tR += `### Копирование файла (scp)\n\n`;
tR += `\`\`\`bash\n`;
tR += result.scpTo + '\n';
tR += `\`\`\`\n`;

if (result.metadata) {
    tR += `\n### Параметры\n\n`;
    tR += `| Поле | Значение |\n`;
    tR += `| --- | --- |\n`;
    tR += `| IP | \`${result.metadata.ip}\` |\n`;
    tR += `| User | \`${result.metadata.user}\` |\n`;
    tR += `| Port | \`${result.metadata.port}\` |\n`;
    if (result.metadata.identityFile) {
        tR += `| IdentityFile | \`${result.metadata.identityFile}\` |\n`;
    }
    if (result.metadata.proxyJump) {
        tR += `| ProxyJump | \`${result.metadata.proxyJump}\` |\n`;
    }
    if (result.metadata.sshAlias) {
        tR += `| SSH Alias | \`${result.metadata.sshAlias}\` |\n`;
    }
}
%>
