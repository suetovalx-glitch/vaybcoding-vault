[Devops](https://amorev.ru/category/devops/)

# Настройка autossh

[04.01.202401.04.2024](https://amorev.ru/autossh/)

В ситуациях, когда VPN недоступен или кажется избыточным настраивать, использование SSH-туннеля может быть довольно хорошей альтернативой. SSH-туннель работает путем настройки SSH-соединения между двумя хостами и использует это соединение для передачи обычного сетевого трафика. На одной стороне туннеля программное обеспечение OpenSSH принимает всё, что отправляется на определенный порт, и отправляет это на другую сторону соединения. Когда пакеты достигают целевой стороны, программное обеспечение OpenSSH перенаправляет их на правильный локальный порт. Естественно, трафик шифруется в пути, тем самым создавая миниатюрный VPN.

Настройка SSH-туннеля довольно проста, например, в терминале:

Plain text

Copy to clipboard

Open code in new window

EnlighterJS 3 Syntax Highlighter

ssh -NL 8080:127.0.0.1:80 root@192.168.10.10

ssh -NL 8080:127.0.0.1:80 root@192.168.10.10

ssh -NL 8080:127.0.0.1:80 root@192.168.10.10

Давайте разберем это:

- \-N означает, что SSH должен просто создать соединение и затем ничего не делать.
- \-L означает, что локальная сторона является прослушивающей стороной. Если вы хотите сделать наоборот, используйте -R. 8080:127.0.0.1:80 говорит SSH, что прослушивающая сторона должна слушать порт 8080 на своем интерфейсе localhost, а другая сторона должна перенаправить его на порт 80. Таким образом, на машине, которая выполняет эту команду, все, что отправляется на 127.0.0.1:8080, перенаправляется на порт 80 на другой стороне. root@192.168.10.10 говорит SSH подключиться к 192.168.10.10 с именем пользователя root.

Детально про SSH-туннели простыми словами я описал [здесь](https://amorev.ru/ssh-tunnels-on-practice/ "SSH туннели на практике").

Существует только одна проблема с этим. Каждый раз, когда соединение SSH разрывается, туннель также разрывается, и вам придется снова запускать эту команду. В зависимости от вашей ситуации это может быть проблемой, и вот почему существует `autossh`.

### Autossh

`autossh` - это инструмент, который настраивает туннель и затем проверяет его каждые 10 секунд. Если туннель перестает работать, autossh просто перезапускает его снова. Так что вместо запуска указанной выше команды вы могли бы запустить:

Plain text

Copy to clipboard

Open code in new window

EnlighterJS 3 Syntax Highlighter

autossh -NL 8080:127.0.0.1:80 root@192.168.10.10

autossh -NL 8080:127.0.0.1:80 root@192.168.10.10

autossh -NL 8080:127.0.0.1:80 root@192.168.10.10

Примечание: запуск SSH-туннеля с помощью `autossh` предполагает, что вы настроили аутентификацию с открытым ключом между клиентом и сервером, поскольку `autossh` не имеет возможности запросить у вас пароль. Особенно если вы хотите следовать дальнейшему описанию этой статьи и автоматически запускать туннели. Пожалуйста, прочтите здесь подробности о том, как настроить аутентификацию с открытым ключом (про это писал [здесь](https://amorev.ru/avtorizaciya-v-ssh-po-otkrytomu-klyuch/)).

Автоматический запуск Обладание автоматическим мониторингом ваших туннелей с помощью autossh - это большое преимущество, но это все еще требует запуска команды всякий раз, когда autossh сам умирает, например, после перезагрузки. Для этого можно прописать `autossh` как сервис

Чтобы добавить `autossh` в качестве службы в Ubuntu, вы можете воспользоваться системой инициализации systemd. Вот пошаговая инструкция:

**Создайте файл службы для autossh**: Создайте файл с расширением `.service` в каталоге `/etc/systemd/system/`. Например, `/etc/systemd/system/autossh.service`.

**Откройте файл службы для редактирования**: Используйте любой текстовый редактор, например, `nano`, чтобы открыть созданный файл:

Plain text

Copy to clipboard

Open code in new window

EnlighterJS 3 Syntax Highlighter

sudo nano /etc/systemd/system/autossh.service

sudo nano /etc/systemd/system/autossh.service

   sudo nano /etc/systemd/system/autossh.service

Добавьте следующий конфигурационный скрипт:

Plain text

Copy to clipboard

Open code in new window

EnlighterJS 3 Syntax Highlighter

\[Unit\]

Description=Autossh Service

After=network.target

\[Service\]

Environment="AUTOSSH\_PIDFILE=/var/run/autossh.pid"

Environment="AUTOSSH\_POLL=30"

Environment="AUTOSSH\_FIRST\_POLL=30"

ExecStart=/usr/bin/autossh -NL 8080:127.0.0.1:80 root@192.168.10.10

ExecReload=/bin/kill -HUP $MAINPID

KillMode=process

Restart=always

RestartSec=3

\[Install\]

WantedBy=multi-user.target

\[Unit\] Description=Autossh Service After=network.target \[Service\] Environment="AUTOSSH\_PIDFILE=/var/run/autossh.pid" Environment="AUTOSSH\_POLL=30" Environment="AUTOSSH\_FIRST\_POLL=30" ExecStart=/usr/bin/autossh -NL 8080:127.0.0.1:80 root@192.168.10.10 ExecReload=/bin/kill -HUP $MAINPID KillMode=process Restart=always RestartSec=3 \[Install\] WantedBy=multi-user.target

   \[Unit\]
   Description=Autossh Service
   After=network.target

   \[Service\]
   Environment="AUTOSSH\_PIDFILE=/var/run/autossh.pid"
   Environment="AUTOSSH\_POLL=30"
   Environment="AUTOSSH\_FIRST\_POLL=30"
   ExecStart=/usr/bin/autossh -NL 8080:127.0.0.1:80 root@192.168.10.10
   ExecReload=/bin/kill -HUP $MAINPID
   KillMode=process
   Restart=always
   RestartSec=3

   \[Install\]
   WantedBy=multi-user.target

В этом конфигурационном файле:

- `Description` - описание службы.
- `After` - указывает, что служба должна запускаться после загрузки сети.
- `Environment` - устанавливает переменные окружения для autossh (необязательно).
- `ExecStart` - команда, которая запускает autossh. Убедитесь, что путь к `autossh` указан правильно.
- `ExecReload` - команда для перезагрузки службы.
- `KillMode` - режим завершения процесса.
- `Restart` и `RestartSec` - указывают, что служба должна перезапускаться в случае ошибки с интервалом в 3 секунды.

**Сохраните и закройте файл**: Нажмите `Ctrl + X`, затем `Y` для сохранения изменений, и `Enter` для подтверждения имени файла.

**Перезагрузите systemd**: После внесения изменений перезапустите systemd, чтобы он обновил свою конфигурацию:

Plain text

Copy to clipboard

Open code in new window

EnlighterJS 3 Syntax Highlighter

sudo systemctl daemon-reload

sudo systemctl daemon-reload

   sudo systemctl daemon-reload

Включите autossh в автозапуск. Чтобы autossh автоматически запускался при загрузке системы, выполните следующую команду:

Plain text

Copy to clipboard

Open code in new window

EnlighterJS 3 Syntax Highlighter

sudo systemctl enable autossh

sudo systemctl enable autossh

   sudo systemctl enable autossh

Вы можете запустить службу `autossh` вручную или перезапустить систему:

Plain text

Copy to clipboard

Open code in new window

EnlighterJS 3 Syntax Highlighter

sudo systemctl start autossh

sudo systemctl start autossh

   sudo systemctl start autossh

Теперь `autossh` будет работать как служба и автоматически перезапускаться в случае необходимости. Вы также можете управлять этой службой с помощью стандартных команд systemd, таких как `stop`, `restart` и `status`.