## Hermes: установка на сервер и базовая подготовка

Краткая памятка: подготовка сервера, ручное редактирование `env.txt`, создание пользователя `hermes` и установка самого агента.

Тема оформления

По умолчанию страница подхватывает системную тему устройства.

1

## Подготовьте сервер

Первый скрипт создаёт swap, просит пароль для будущего пользователя и подготавливает `/root/setup-data/env.txt`.

`wget -O /tmp/prepare-hermes.sh https://amorev.ru/misc/hermes/prepare-hermes-1.sh && sudo bash /tmp/prepare-hermes.sh`

2

## Отредактируйте env.txt вручную

После первого шага откройте файл и заполните свои значения: токен Telegram, chat id, endpoint модели и остальные параметры.

`sudo nano /root/setup-data/env.txt`

3

## Создайте пользователя и включите защиту

Второй скрипт создаёт пользователя `hermes`, меняет SSH-порт, включает UFW, fail2ban и ставит Telegram-уведомления для SSH-входа.

`wget -O /tmp/prepare-hermes2.sh https://amorev.ru/misc/hermes/prepare-hermes-2.sh && sudo bash /tmp/prepare-hermes2.sh`

4

## Проверьте вход под hermes

Откройте новую сессию и убедитесь, что вход под новым пользователем работает. Порт берите из `env.txt` или из вывода второго скрипта.

`ssh hermes@<ВАШ_IP_СЕРВЕРА> -p 2091`

5

## Установите Hermes под пользователем hermes

Выполняйте установку уже без `sudo`, от имени пользователя `hermes`.

`curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash`