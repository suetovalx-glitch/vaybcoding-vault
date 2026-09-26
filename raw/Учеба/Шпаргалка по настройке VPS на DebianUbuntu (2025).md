## Привет!

За годы работы и самообучения Linux'у у меня сформировалась шпаргалка с разными командами. Наконец-то дошли руки — и с помощью ИИ всё это упорядочено, обновлено и отформатировано. Полученный материал представляю вашему вниманию для всех, кто ещё не освоил 100% автоматизацию процесса, но постоянно покупает виртуальные сервера для своих нужд.

### Что мы сделаем?

- Подключимся по SSH.
- Изменим hostname.
- Обновим систему и установим ПО.
- Настроим timezone.
- Изменим порт SSH (опционально).
- Настроим firewall (UFW).
- Создадим sudo-пользователя.
- Настроим SSH-ключи.
- Отключим root-логин и заблокируем root.
- Включим автоматические обновления.
- Установим Fail2Ban.
- (Опционально) Добавим nightly reboot и speedtest.

---

#### 1\. Подключение по SSH

VPS обычно доступны под root по SSH.  
**Из Windows (PowerShell), Linux и macOS команда одна и та же:**  
Putty не предлагать!

```powershell
ssh root@YOUR_IP
```

#### 2\. Изменение hostname

Есть хостеры, которые даже не предлагают установить свой hostname, а вместо этого генерируют нечитаемую ерунду. Мне так не нравится, поэтому первым делом меняем hostname.

Установите новый hostname:

```bash
hostnamectl set-hostname new-hostname
```

Замените `new-hostname` на желаемое (например, `my-perfect-vps-01`).

Обновите `/etc/hosts`:

```bash
nano /etc/hosts
```

Измените строки, где есть старое имя сервера:

```
127.0.1.1 new-hostname
```

Чтобы настройки применились, нужно перезайти на хост или выполнить `reboot`. Пока просто проверьте: `hostnamectl`.

#### 3\. Обновление системы и установка утилит

Это святое! Всегда в первую очередь выполняем:

```bash
apt update && apt upgrade -y
```

Теперь устанавливаем всё, что может понадобиться. Простая команда (удалите лишнее и укажите нужное):

```bash
apt install curl wget git vim htop tmux unzip zip jq tree net-tools rsync lsof iotop iftop nethogs sysstat dstat glances btop ncdu duf nginx apache2 haproxy caddy certbot postgresql postgresql-contrib redis-server build-essential python3-pip python3-venv nodejs npm neofetch screenfetch ranger mc iptables-persistent wireguard openvpn nfs-common cifs-utils mosh docker.io
```

Или вот команда с выбором, чтобы не ставить лишнее:

```bash
packages_to_install=""; for pkg in curl wget git vim htop tmux unzip zip jq tree net-tools rsync lsof iotop iftop nethogs sysstat dstat glances btop ncdu duf nginx apache2 haproxy docker.io caddy certbot postgresql postgresql-contrib redis-server build-essential python3-pip python3-venv nodejs npm neofetch screenfetch ranger mc iptables-persistent wireguard openvpn nfs-common cifs-utils mosh; do read -p "Install $pkg? [y/n, default=n]: " yn; yn=${yn:-n}; case $yn in [Yy]*) packages_to_install="$packages_to_install $pkg" ;; esac; done; [ -n "$packages_to_install" ] && apt install -y $packages_to_install
```

Тут много программ — один раз составьте свой список фаворитов, потом просто от ситуации будете выбирать только из нужных программ.

Здесь есть `docker.io`, но в своих проектах я чаще использую самые свежие версии, поэтому обычно устанавливаю Docker официальным скриптом:

```bash
curl -fsSL https://get.docker.com | sh
```

Чтобы работать с Docker без `sudo`, добавьте пользователя в группу (делается после создания пользователя):

```bash
sudo usermod -aG docker $USER
```

После этого перезайдите по SSH.

#### 4\. Настройка timezone

```bash
timedatectl set-timezone Europe/Moscow
```

Замените на свою (список: `timedatectl list-timezones`).  
Проверьте:

```bash
timedatectl
```

#### 5\. Изменение порта SSH (опционально, для hardening)

Поменяйте на порт >1024, чтобы снизить сканирование и попытки подбора пароля.

```bash
nano /etc/ssh/sshd_config
```

Найдите `#Port 22`, раскомментируйте и измените: `Port 2222` (или свой).  
Перезапустите:

```bash
systemctl restart ssh
```

**Предупреждение:** Откройте новое соединение на новом порту перед закрытием старого: `ssh -p 2222 root@YOUR_IP`.

#### 6\. Настройка firewall (UFW)

Установите (если не установлено):

```bash
apt install -y ufw
```

Разрешите порты:

```bash
ufw allow OpenSSH               # Или ufw allow 2222/tcp для кастомного порта
ufw allow 80/tcp                # HTTP, если нужно
ufw allow 443/tcp               # HTTPS, если нужно
ufw default deny incoming
ufw default allow outgoing
ufw enable
```

Проверьте:

```bash
ufw status verbose
```

#### 7\. Создание sudo-пользователя

```bash
adduser yourusername
usermod -aG sudo yourusername
```

Проверьте (переключитесь):

```bash
su - yourusername
sudo whoami   # Должен вывести 'root'
```

#### 8\. Настройка SSH-ключей

**На клиенте (Windows/Linux/macOS):**

```bash
# Рекомендуемый вариант в 2025 году
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Скопируйте публичный ключ (весь вывод команды):

```bash
cat ~/.ssh/id_ed25519.pub
```

**На сервере (под новым пользователем):**

```bash
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys   # Вставьте ключ
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

В `/etc/ssh/sshd_config` убедитесь, что есть:

```
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
```

Перезапустите:

```bash
sudo systemctl restart ssh
```

**Критически важно:** Откройте новое окно и убедитесь, что можете зайти по ключу под новым пользователем (с новым портом, если меняли). Только после этого переходите дальше!

#### 9\. Отключение root-логина и пароля

**Предупреждение:** Хостер потеряет root-доступ. Если хостер предоставляет прямой доступ к root (VNC-консоль и т.п.), он перестанет работать. Только rebuild при проблемах.

В `/etc/ssh/sshd_config`:

```bash
sudo nano /etc/ssh/sshd_config
```

Установите:

```
PermitRootLogin no
PasswordAuthentication no
```

Перезапустите:

```bash
systemctl restart ssh
```

Заблокируйте root:

```bash
sudo passwd -l root   # Блокировка пароля
sudo passwd -d root # Или вовсе удаляем пароль, теперь под root никто не пройдёт
```

Проверьте подключение по ключу ещё раз.

---

#### 10\. Автоматические обновления

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades   # Выберите Yes
```

Настройте `/etc/apt/apt.conf.d/50unattended-upgrades` (раскомментируйте нужное):

```
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}";
    "${distro_id}:${distro_codename}-security";
    "${distro_id}:${distro_codename}-updates";  // Опционально
};

Unattended-Upgrade::Automatic-Reboot "true";
Unattended-Upgrade::Automatic-Reboot-Time "04:00";
```

Можно добавить уведомления на почту:

```
Unattended-Upgrade::Mail "your@email.com";
```

В `/etc/apt/apt.conf.d/20auto-upgrades`:

```
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Download-Upgradeable-Packages "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
```

#### 11\. Настройка Fail2Ban

```bash
sudo apt install -y fail2ban
```

Создайте `/etc/fail2ban/jail.local`:

```bash
sudo nano /etc/fail2ban/jail.local
```

Содержимое:

```
[DEFAULT]
banaction = ufw
bantime = 3600
findtime = 600
maxretry = 5
backend = systemd
ignoreip = 127.0.0.1/8 YOUR_IP   # Добавьте свой домашний IP

[sshd]
enabled = true
port = ssh                      # Или ваш кастомный порт
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
```

Перезапустите:

```bash
systemctl restart fail2ban
```

Проверьте: `sudo fail2ban-client status sshd` или `sudo ufw status`.

#### 12\. Ночная перезагрузка (опционально)

Обычно сервера прекрасно работают без этого, но если какое-то ПО сбивается, можно добавить reboot в 3:00:

```bash
sudo crontab -e
```

Добавьте строку:

```
0 3 * * * /sbin/reboot
```

Проверьте: `crontab -l`.  
Для теста: `sudo /sbin/reboot`.

#### 13\. Speedtest (для теста сети)

Знаю, что многим Speedtest не нравится, потому что он попсовый, но как по мне идеальный способ быстро оценить канал хостера. Всего 2 команды! А то бывает, что пишут гигабит, а там от силы 300 мбит\\с.

```bash
apt install speedtest-cli
```

Запуск:

```bash
speedtest                  # Базовый тест
speedtest --servers        # Список серверов
speedtest --server-id=1111 # По ID
```

#### Заключение

С помощью простых шагов мы получили базовый минимум солидного сервера, закрыли основные проблемы с безопасностью, настроили вход только по ключу и включили автообновления.

Это точно не финальная версия шпаргалки — я постоянно её дорабатываю. Если у вас есть комментарии, замечания, предложения или возражения, с радостью приму их в свою практику и обновлю текст.