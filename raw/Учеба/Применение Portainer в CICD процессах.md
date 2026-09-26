Продолжаем знакомиться с Portainer и сферами его применения.

В двух прошлых статьях:

- Первая: « [Быстрый деплой бота (и не только) на Docker-хостинге с Portainer](https://pressanybutton.ru/post/primenenie-docker/bystryj-deploj-bota-i-ne-tolko-na-docker-hostinge-s-portainer/) »
- Вторая: « [Один Portainer, чтоб править всеми](https://pressanybutton.ru/post/primenenie-docker/odin-portainer-chtob-pravit-vsemi/) »

Если вы здесь впервые: **Portainer** — это веб-панель, которая упрощает работу с Docker (и Docker Swarm/Kubernetes): запуск контейнеров, обновления, сети, тома и права доступа — всё в одном интерфейсе.

Мы уже разобрались:

- что такое Portainer;
- что за сервис [DockerHosting.ru](https://dockerhosting.ru/) и как он помогает быстро стартовать;
- как писать `Dockerfile` и `docker-compose.yml`;
- как развернуть проект из Git-репозитория;
- как подключать к Portainer удалённые серверы и управлять на них контейнерами Docker.

В этой статье разберём, **как встроить Portainer в процессы CI/CD и где хранить Docker-образы**, а также узнаем, **как бесплатно получить и активировать Portainer Business Edition**.

> Коротко для тех, кто только знакомится с темой:  
> **CI** (Continuous Integration) — автоматическая сборка и проверка кода при каждом изменении.  
> **CD** (Continuous Delivery/Deployment) — автоматическая доставка/развёртывание собранного приложения.  
> **Регистр образов (registry)** — хранилище Docker-образов (публичное или приватное), из которого Portainer и ваши сервера забирают готовые образы для деплоя.

Также рекомендую к прочтению « [CI/CD: основы написания Workflow](https://pressanybutton.ru/post/devops/cicd-osnovy-napisaniya-workflow/) », чтобы глубже понять понятия CI/CD и Workflow.

---

## Где хранить Docker-образы

Начнём с хранилищ (Docker Registry). `Dockerfile` описывает, **как собрать образ**, а запись `build: .` в `docker-compose.yml` собирает его **локально**.

Однако в реальных проектах удобнее другой способ: **собрать образ один раз и отправить его в реестр**. Тогда при деплое сервер просто выполнит `docker pull` и заберёт готовый образ. Такой подход идеально подходит для CI/CD: вся тяжёлая сборка выполняется в конвейере, а на продакшене остаётся лишь запуск контейнера.

### Какие бывают реестры

- **Docker Hub** — самое популярное публичное хранилище.
- **Self-hosted** решения, например **Harbor** — реестр, который вы разворачиваете на своём сервере.
- **Реестры у git-хостингов**: **GitHub Container Registry (ghcr.io)**, **GitLab Container Registry**, встроенные решения в **Gitea** и другие.

### Чем они отличаются

- **Docker Hub**
	- Плюсы: легко начать, много готовых публичных образов.
		- Минусы: ограничения на бесплатных планах (скорость и объём хранения), зависимость от внешнего сервиса.
- **Self-hosted (например, Harbor)**
	- Плюсы: полный контроль над хранилищем, приватность, собственные политики безопасности, возможность репликации.
		- Минусы: нужно администрирование, дополнительные ресурсы и поддержка.
- **Git-хостинги (GHCR/GitLab и др.)**
	- Плюсы: образы хранятся рядом с кодом, удобно настраивать доступ, хорошая интеграция с CI/CD.
		- Минусы: привязка к конкретной платформе и её лимитам.

### Как это работает

1. Собираете образ из `Dockerfile` — локально или в CI/CD.
2. Присваиваете тег:
	- **фиксированный** (например, версия `1.2.3` или SHA коммита),
		- **плавающий** (`latest`).  
		Хорошая практика — использовать **оба тега**: фиксированный для надёжности и `latest` для быстрого запуска.
3. Отправляете образ в реестр (`docker push` работает примерно как `git push`, только вместо кода загружается образ).
4. На сервере запускаете `docker-compose.yml` и вместо `build: .` указываете `image:`.  
	Для продакшена безопаснее использовать **конкретный тег** или **дайджест** (`@sha256:…`), а не только `latest`.

Я, например, использую свой git-сервер на базе **Gitea** для хранения и кода, и Docker-образов. Но в этой статье мы будем работать с реестром от GitHub — **GHCR (ghcr.io)**.  
Если хотите подробнее про self-hosted-хранилища — напишите в комментариях, и я подготовлю отдельный материал.

---

## Проект для демонстрации

Для примера возьмём небольшой проект с GitHub: [https://github.com/proDreams/tempProject](https://github.com/proDreams/tempProject).

Это Telegram-бот, который отвечает на любое сообщение текстом **«Hello World!»**.  
Он нам нужен, чтобы показать все шаги на реальном проекте, а вы потом сможете легко адаптировать их под свой.

Разберём, что уже есть в репозитории.

### Dockerfile

`Dockerfile` выглядит так:

```
FROM python:3.13-slim  

WORKDIR /code  

COPY requirements.txt /code  

RUN pip install --upgrade pip && pip install -r requirements.txt  

COPY . /code  

CMD [ "python", "./main.py" ]
```

Что здесь происходит шаг за шагом:

1. `**FROM python:3.13-slim**`  
	Используем официальный базовый образ с Python 3.13 на облегчённой системе (`slim`). Такой образ весит меньше и быстрее скачивается.
2. `**WORKDIR /code**`  
	Устанавливаем рабочую директорию внутри контейнера. Все команды ниже будут выполняться именно в этой папке.
3. `**COPY requirements.txt /code**`  
	Копируем список зависимостей. Это сделано отдельным шагом, чтобы Docker мог закешировать установку пакетов и не ставил их заново при каждой пересборке.
4. `**RUN pip install --upgrade pip && pip install -r requirements.txt**`  
	Обновляем `pip` и устанавливаем зависимости из `requirements.txt`.  
	Благодаря предыдущему шагу, если `requirements.txt` не изменился, этот этап будет пропущен (Docker возьмёт данные из кеша).
5. `**COPY . /code**`  
	Копируем остальной код проекта в контейнер.
6. `**CMD ["python", "./main.py"]**`  
	Задаём команду, которая будет выполняться при запуске контейнера — запуск нашего Telegram-бота.  
	Важно: `CMD` можно переопределить при запуске (`docker run ...`), а вот `ENTRYPOINT` заменить сложнее.

Этот `Dockerfile` уже подходит для нашего примера, менять его не нужно.

### docker-compose.yaml

Сейчас файл `docker-compose.yaml` выглядит так:

```yaml
services:  
  test-bot:  
    build: .  
    container_name: test-bot  
    environment:  
      - BOT_TOKEN=${BOT_TOKEN}
```

Разберём, что здесь происходит:

- Создаётся сервис `**test-bot**`, для которого Docker **собирает образ из текущей папки** (`build: .`) по `Dockerfile`.
- Контейнер получает понятное имя `**test-bot**`. Это облегчает поиск в списке контейнеров, просмотр логов и выполнение команд.
- В контейнер передаётся переменная окружения `**BOT_TOKEN**`. Её значение берётся:
	- либо из переменной окружения на хосте,
		- либо из файла `**.env**`, если он находится рядом с `docker-compose.yaml`.

> Совет: файл `.env` удобно использовать для хранения токенов и паролей.  
> В репозиторий его обычно не добавляют, а делают `.env.example` с пустыми значениями, чтобы другим было понятно, какие переменные нужны.

Позже, когда мы подключим CI/CD, строчку `build: .` заменим на `**image: ...**`, чтобы использовать заранее собранный и загруженный в реестр образ.

### main.py

Код бота:

```python
import asyncio  
import os  

from aiogram import Dispatcher, Bot  
from aiogram.types import Message  
from dotenv import load_dotenv  

load_dotenv()  

async def send_message(message: Message) -> None:  
    await message.answer(text="Hello World!")  

async def start() -> None:  
    bot = Bot(token=os.getenv('BOT_TOKEN'))  
    dp = Dispatcher()  

    dp.message.register(send_message)  

    try:  
        await dp.start_polling(bot)  
    finally:  
        await bot.session.close()  

if __name__  "__main__":  
    asyncio.run(start())
```

Что здесь происходит:

- `**load_dotenv()**`  
	Загружает переменные окружения из файла `.env`.  
	Это нужно только при запуске локально. В Docker Compose переменные подтягиваются автоматически из секции `environment` или через `env_file`.  
	То есть в контейнере этот вызов необязателен, но и не мешает.
- **Обработчик сообщений**  
	Функция `send_message` отвечает на любое входящее сообщение фразой **«Hello World!»**.
- **Функция** `**start()**`
	- создаёт объект `Bot` с токеном из переменной `BOT_TOKEN`;
		- инициализирует `Dispatcher`;
		- регистрирует обработчик для **всех сообщений** (`dp.message.register(send_message)`).
- **Запуск long polling**  
	`dp.start_polling(bot)` включает механизм long polling — бот регулярно опрашивает серверы Telegram на наличие новых сообщений.
- **Корректное завершение работы**  
	В блоке `finally` закрывается HTTP-сессия бота, чтобы не оставалось «висячих» соединений.
- **Запуск из файла**  
	`if __name__ "__main__": asyncio.run(start())` гарантирует, что бот запустится только если вы запускаете этот файл напрямую, а не импортируете его в другой модуль.

---

## Workflow сборки образа

Теперь перейдём к практике. Наша цель — настроить Workflow, который будет **собирать Docker-образ проекта и отправлять его в реестр GitHub**.

Для этого воспользуемся **GitHub Actions** — встроенным в GitHub сервисом для CI/CD. Он позволяет автоматически запускать сценарии при каждом пуше в репозиторий (или по другим событиям).

Структура будет такой:

- В корне проекта создаём директорию `**.github**` — здесь хранится всё, что связано с настройками GitHub.
- Внутри неё создаём папку `**workflows**` — именно здесь GitHub Actions ищет сценарии для запуска.
- В этой папке создаём файл `**build_and_deploy.yaml**`.  
	В нём мы опишем задачи по сборке и деплою проекта. Для начала сделаем только сборку.

### build\_and\_deploy.yaml

Файл Workflow целиком:

```yaml
name: Build and Deploy Project  

on:  
  push:  
    branches:  
      - main  

permissions:  
  packages: write  
  contents: read  

jobs:  
  build-and-push:  
    runs-on: ubuntu-latest  

    steps:  
      - name: Checkout repository  
        uses: actions/checkout@v4  

      - name: Set up Docker Buildx  
        uses: docker/setup-buildx-action@v3  

      - name: Log in to GitHub Container Registry  
        uses: docker/login-action@v3  
        with:  
          registry: ghcr.io  
          username: ${{ github.actor }}  
          password: ${{ secrets.GITHUB_TOKEN }}  

      - name: Build and push Docker image  
        uses: docker/build-push-action@v6  
        with:  
          context: .  
          push: true  
          cache-from: type=registry,ref=ghcr.io/prodreams/tempproject:latest  
          cache-to: type=inline  
          tags: |  
            ghcr.io/prodreams/tempproject:latest    
            ghcr.io/prodreams/tempproject:${{ github.sha }}
```

### Что здесь происходит

- `**name**`  
	Просто название Workflow. Оно отображается во вкладке **Actions** на GitHub.
- `**on.push.branches: main**`  
	Запускаем Workflow при каждом пуше в ветку **main**.  
	Если вы работаете в другой ветке для продакшена, замените `main` на нужную (например, `production`).
- `**permissions**` Даём встроенному `GITHUB_TOKEN` права:
	- `packages: write` — загружать образы в GitHub Container Registry,
		- `contents: read` — читать код из репозитория.
- `**runs-on: ubuntu-latest**`  
	GitHub запускает сборку на Linux-раннере (виртуальной машине Ubuntu).
- **Checkout**  
	Забираем код вашего репозитория на раннер. Без этого Docker не увидит `Dockerfile` и исходники.
- **Buildx**  
	Подключаем расширенный механизм сборки Docker.  
	Он поддерживает кеширование и мультиархитектуру (например, если вы захотите собирать образы под ARM).
- **Login в GHCR**  
	Авторизуемся в GitHub Container Registry (`ghcr.io`) с помощью встроенного `GITHUB_TOKEN`.  
	Если при пуше в организацию получите ошибку `403`, проверьте:  
	1\. Включено ли использование GitHub Actions для пакетов в настройках организации.  
	2\. Нужен ли вам персональный токен (PAT) с правами `write:packages`.
- **Build and push Docker image**
	- `context: .` — собираем образ из текущей директории.
		- `push: true` — отправляем образ в реестр.
		- `cache-from` / `cache-to` — включаем кеш, чтобы повторные сборки были быстрее.  
		(Если вы запускаете Workflow впервые, кеша ещё не будет — это нормально).
		- `tags` — публикуем образ сразу с двумя тегами:
		- `latest` — всегда указывает на последнюю версию;
				- `${{ github.sha }}` — уникальный тег по коммиту (нужен, чтобы откатиться к точной версии).

### Откуда взять адрес?

После выполнения Workflow образ публикуется в GHCR с тегами `**latest**` и уникальным хэшем коммита (`**${{ github.sha }}**`).  
Чтобы использовать этот образ в `docker-compose.yml`, нужно указать **полный адрес вместе с тегом**.

**Шаблон для GHCR:**

```
ghcr.io/<организация_или_имя_пользователя>/<название_образа>:<тег>
```

Как составить адрес (даже если образ ещё не опубликован):

- `**ghcr.io/**` — домен GitHub Container Registry.
- `**<имя_пользователя>**` **или** `**<организация>**` — ваш логин GitHub или название организации (**строго в нижнем регистре**).
- `**<название_образа>**` — обычно совпадает с именем репозитория (**тоже в нижнем регистре**).
- `**:тег**` — версия образа. Это может быть `latest`, `1.0.0`, короткий SHA коммита или `${{ github.sha }}`.

> ⚠️ Важно: имя образа (всё до двоеточия с тегом) должно быть в **нижнем регистре**, иначе Docker выдаст ошибку `invalid reference format`.

Для репозитория [https://github.com/proDreams/tempProject](https://github.com/proDreams/tempProject) корректный префикс будет:

```
ghcr.io/prodreams/tempproject
```

Примеры полных адресов:

```
ghcr.io/prodreams/tempproject:latest
ghcr.io/prodreams/tempproject:${{ github.sha }}
```

### Отправляем изменения в GitHub и запускаем Workflow

Файл Workflow готов — пора отправить его в репозиторий.  
Когда коммит попадёт на GitHub и **сработает триггер** (у нас — пуш в ветку `main`), Actions автоматически запустит сборку.

Выполняем команды в терминале:

```bash
git add .github/workflows/build_and_deploy.yaml

git commit -m "CI/CD: Build docker image"

git push
```

После этого заходим на страницу репозитория и открываем вкладку **Actions**. Там отобразится выполняющийся Workflow:

![](https://napkincode.ru/media/post/2025/08/05/image-20250807112854784.png)

Кликаем по запуску, чтобы посмотреть список заданий (jobs). В нашем случае оно одно и на него можно кликнуть:

![](https://napkincode.ru/media/post/2025/08/05/image-20250807112927073.png)

Откроется подробный лог выполнения. Здесь можно увидеть каждый шаг и, если что-то пойдёт не так, понять причину:

![](https://napkincode.ru/media/post/2025/08/05/image-20250807113014771.png)

У нас всё прошло успешно — образ отправился в реестр.  
Теперь на главной странице репозитория в правом блоке **Packages** появится наш Docker-образ:

![](https://napkincode.ru/media/post/2025/08/05/image-20250807113045529.png)

Если перейти по пакету, откроется страница с подробной информацией об образе:

![](https://napkincode.ru/media/post/2025/08/05/image-20250807113112142.png)

### Если что-то не сработало

- **Workflow не стартовал**
	- проверьте, что пушите именно в ветку `main` (или измените ветку в триггере),
		- убедитесь, что файл лежит в `.github/workflows/...`,
		- проверьте, включены ли Actions в настройках репозитория.
- **Ошибка при пуше в GHCR**
	- убедитесь, что в Workflow указано `permissions: packages: write`,
		- при работе с организацией проверьте, что публикация пакетов из Actions разрешена,
		- если пакет приватный — настройте права доступа.

После успешного выполнения у вас есть адрес образа в GHCR и два тега:

- `**latest**` — всегда на последнюю сборку;
- `**${{ github.sha }}**` — конкретная версия для стабильного деплоя.

---

## Получаем и активируем Portainer Business Edition

Может возникнуть вопрос: зачем переходить на **Business Edition**, если до этого хватало версии **Community**?  
Дело в том, что CE (Community Edition) покрывает базовые потребности: можно управлять Docker-хостами, контейнерами и стаками.  
Однако, например, **создание Webhook’ов для автоматического обновления стаков и контейнеров** там недоступно — это уже функционал Business Edition.

Хорошая новость: Business Edition можно получить **бесплатно**, но с одним ограничением — **не более трёх Docker-хостов** (включая локальный).  
Для домашних или небольших проектов этого обычно достаточно.

### Как получить ключ

Переходим на страницу программы **Take 3**:  
👉 [https://www.portainer.io/take-3](https://www.portainer.io/take-3)

![](https://napkincode.ru/media/post/2025/08/05/image-20250807113150794.png)

Справа находится форма. Заполняем её:

- **Имя и фамилия**
- **Электронная почта** — укажите рабочую, именно туда придёт ключ.
- **Номер телефона** — российский номер проходит без проблем.
- **Страна** — выбираем «Россия» (есть в списке).
- **Использовали ли вы Portainer CE?** — отвечаем «Да».
- **Используемая платформа контейнеризации** — в моём случае «Docker Standalone».
- **Как вы используете Portainer?** — я указал «Для дома».
- **Как узнали о Portainer** — выбирайте любой подходящий вариант.
- И не забудьте поставить галочку согласия с лицензионным соглашением.

После нажатия «Submit» ждём письмо на почту с кодом активации.

### Обновление Portainer CE до BE

Обновить Portainer до Business Edition очень просто.

Если вы используете [DockerHosting.ru](https://dockerhosting.ru/), то предустановленный Portainer доступен по адресу:

```
https://<ip_сервера>:9000/
```

В верхнем левом углу, над логотипом, есть кнопка **«Upgrade to Business Edition»**. Нажимаем её — откроется окно для ввода ключа:

![](https://napkincode.ru/media/post/2025/08/05/image-20250807113238568.png)

Вводим полученный ключ и нажимаем **«Start upgrade»**.

После этого начнётся процесс обновления. Когда он завершится, система попросит вас снова войти в аккаунт:

![](https://napkincode.ru/media/post/2025/08/05/image-20250807113304785.png)

> ⚡ Важно: при обновлении до BE ваши контейнеры, стеки и настройки **не пропадут**.  
> Portainer просто активирует дополнительные функции, в том числе возможность использовать Webhook’и.

---

## Подключение реестра в Portainer

Теперь подключим к Portainer внешний реестр GitHub. Это нужно, чтобы при деплое Portainer мог сам **авторизоваться в реестре** и **скачать образ**.

В левом меню выберите **Registries** — откроется список подключённых реестров:

![](https://napkincode.ru/media/post/2025/08/05/image-20250807113349221.png)

Нажмите **Add Registry**. Вы попадёте на страницу добавления:

![](https://napkincode.ru/media/post/2025/08/05/image-20250807113407380.png)

Из вариантов выбираем **GitHub** (для GitHub Container Registry):

![](https://napkincode.ru/media/post/2025/08/05/image-20250807113440176.png)

Теперь заполняем поля:

- **Name** — любое название, например `github`.
- **Username** — ваш логин GitHub.
- **Personal Access Token** — ваш персональный токен GitHub.  
	Создать его можно здесь: 👉 [https://github.com/settings/tokens](https://github.com/settings/tokens)

> Для скачивания образов достаточно права **read:packages**.  
> Не давайте лишних разрешений: Portainer будет только читать образы, а пушит их ваш CI.

После сохранения вы вернётесь к списку реестров, где появится подключение к GitHub:

![](https://napkincode.ru/media/post/2025/08/05/image-20250807113516302.png)

### Примечания

- Если образы находятся в приватной организации, убедитесь, что токен имеет доступ к этой организации и к пакетам.
- Для Portainer используйте **минимально достаточные права** (обычно read-only).
- ⚠️ Не путайте **Personal Access Token** с `GITHUB_TOKEN`, который используется в GitHub Actions.  
	`GITHUB_TOKEN` работает только внутри CI, а для Portainer нужен отдельный PAT.

### Добавление GitHub Container Registry в Portainer CE

В **Portainer Community Edition** нет отдельного готового варианта для GitHub, но подключить реестр всё равно можно без проблем.  
Для этого при добавлении выбираем **Custom registry**:

![](https://napkincode.ru/media/post/2025/08/05/image-20250807113558736.png)

Далее заполняем поля:

- **Name** — любое удобное название, например `GitHub`.
- **Registry URL** — указываем `ghcr.io`.
- Включаем **Authentication** и вводим:
	- **Username** — ваш логин GitHub,
		- **Password/Token** — персональный токен (PAT). Создать его можно здесь: 👉 [https://github.com/settings/tokens](https://github.com/settings/tokens).

> Для скачивания образов достаточно права **read:packages**.  
> Помните: этот токен отличается от `GITHUB_TOKEN`, который используется внутри GitHub Actions. Здесь нужен именно **ваш PAT**.

После нажатия **Add registry** реестр появится в списке и будет готов к использованию.

---

## Создание стека в Portainer

В первой статье мы уже [пробовали создавать стек из Git-репозитория](https://pressanybutton.ru/post/primenenie-docker/bystryj-deploj-bota-i-ne-tolko-na-docker-hostinge-s-portainer/#deploj-proekta).  
Теперь сделаем то же самое, но используем только файл `**docker-compose.yml**` — немного изменив его.

### Изменение docker-compose.yml

Исходный файл выглядел так:

```yaml
services:  
  test-bot:  
    build: .  
    container_name: test-bot  
    environment:  
      - BOT_TOKEN=${BOT_TOKEN}
```

Здесь сервис собирает образ локально (`build: .`).  
Но теперь у нас уже есть готовый образ в реестре, поэтому локальная сборка не нужна.

Чтобы подтянуть образ из реестра, заменяем строку `build: .` на `**image:**` и указываем полный адрес с тегом:

```yaml
services:  
  test-bot:  
    image: ghcr.io/prodreams/tempproject:latest  
    container_name: test-bot  
    environment:  
      - BOT_TOKEN=${BOT_TOKEN}
```

### Стек в Portainer

Возвращаемся в Portainer и переходим в раздел **Stacks**:

![](https://napkincode.ru/media/post/2025/08/05/image-20250807113639782.png)

Нажимаем **Add stack**.  
Откроется страница создания стека. Выбираем вариант **Web editor**:

![](https://napkincode.ru/media/post/2025/08/05/image-20250807113700885.png)

Вверху указываем название стека. В моём случае это `test-bot`.  
Ниже в поле редактора вставляем содержимое нашего `docker-compose.yml`:

![](https://napkincode.ru/media/post/2025/08/05/image-20250807113731117.png)

Теперь прокручиваем страницу вниз и включаем переключатель **Create a Stack webhook**.  
Это создаст специальную ссылку для вебхука — в будущем мы сможем отправлять на неё запросы из CI/CD, чтобы автоматически обновлять проект.

Также в разделе **Environment variables** добавляем переменную окружения `**BOT_TOKEN**` — сюда вписывается токен нашего Telegram-бота.

После этого жмём **Deploy the stack**:

![](https://napkincode.ru/media/post/2025/08/05/image-20250807113806072.png)

Через несколько секунд нас перенаправит на страницу запущенных стаков:

![](https://napkincode.ru/media/post/2025/08/05/image-20250807113831532.png)

Осталось проверить, что бот работает:

![](https://napkincode.ru/media/post/2025/08/05/image-20250807113908861.png)

> ⚡ Если бот не запускается, загляните в логи контейнера — скорее всего, ошибка в переменных окружения или токен введён неправильно.

### Получение адреса вебхука

Для следующего шага — настройки Workflow деплоя — нам понадобится адрес **Webhook** для созданного стека.

Находясь на странице **Stacks**, выбираем наш стек и переходим на страницу его управления:

![](https://napkincode.ru/media/post/2025/08/05/image-20250807113952138.png)

В верхней части нажимаем **Editor**, чтобы открыть режим редактирования.  
В блоке **Webhooks** будет показана ссылка вебхука.

Нажимаем **Copy link**, чтобы скопировать её:

![](https://napkincode.ru/media/post/2025/08/05/image-20250807114014637.png)

Эта ссылка пригодится нам в CI/CD Workflow: мы будем отправлять на неё запрос, чтобы автоматически обновлять проект при новых сборках.

---

## Workflow деплоя

Переходим к самому интересному — деплою проекта через **Webhook Portainer** в CI/CD.

### Добавляем секрет в GitHub Actions

Прежде чем писать Workflow, нужно сохранить ссылку вебхука в секрете GitHub.  
Это важно по двум причинам:

- ссылка не попадёт в открытый доступ;
- её значение не будет видно в логах Workflow.

Открываем репозиторий на GitHub и заходим в раздел **Settings**:

![](https://napkincode.ru/media/post/2025/08/05/image-20250807114051936.png)

Слева выбираем **Secrets and variables → Actions**. Откроется страница управления секретами:

![](https://napkincode.ru/media/post/2025/08/05/image-20250807114111350.png)

Нажимаем зелёную кнопку **New repository secret**.

В появившейся форме:

- в поле **Name** указываем название секрета — `PORTAINER_WEBHOOK_URL`.
- в поле **Secret** вставляем скопированную ранее ссылку вебхука.
![](https://napkincode.ru/media/post/2025/08/05/image-20250807114131872.png)

Нажимаем **Add secret** — теперь этот секрет можно использовать в Workflow:

![](https://napkincode.ru/media/post/2025/08/05/image-20250807114159071.png)

> ⚡ Совет: секреты никогда не хранят в коде Workflow напрямую.  
> Если вы случайно закоммитите ссылку вебхука в репозиторий, любой сможет деплоить ваш проект.

### Дополняем build\_and\_deploy.yaml

Откроем файл `**build_and_deploy.yaml**` и добавим новую задачу (job), которая будет выполняться **после сборки образа**.  
Она вызовет вебхук, чтобы Portainer автоматически подтянул новый образ и перезапустил проект.

На уровне с `build-and-push` создаём новый блок `deploy`:

```yaml
deploy:  
  runs-on: ubuntu-latest  

  needs: build-and-push  

  steps:  
    - name: Trigger Portainer webhook  
      env:  
        PORTAINER_WEBHOOK_URL: ${{ secrets.PORTAINER_WEBHOOK_URL }}  
      run: curl -fsS -m 30 -X POST "$PORTAINER_WEBHOOK_URL"
```

#### Что здесь происходит

- `**needs: build-and-push**`  
	Эта строчка говорит GitHub Actions:  
	*«Запусти этот job только после успешного выполнения* `*build-and-push*` *».*  
	То есть деплой произойдёт только если образ собрался и загрузился в реестр.
- `**env**`  
	В переменную окружения `PORTAINER_WEBHOOK_URL` передаём значение секрета из GitHub (`${{ secrets.PORTAINER_WEBHOOK_URL }}`).  
	Так мы не храним ссылку вебхука в открытом виде.
- `**curl -fsS -m 30 -X POST "$PORTAINER_WEBHOOK_URL"**` Эта команда отправляет HTTP POST-запрос на вебхук Portainer. Параметры:
	- `-f` — завершить команду ошибкой, если статус-код ответа ≥ 400;
		- `-sS` — тихий режим без лишних логов, но с выводом ошибок;
		- `-m 30` — ограничение времени выполнения 30 сек.;
		- `-X POST` — используем POST-запрос;
		- `"$PORTAINER_WEBHOOK_URL"` — сама ссылка вебхука.

Всего одна команда — и Portainer перезапускает стек с новым образом.

Полный код файла:

```yaml
name: Build and Deploy Project  

on:  
  push:  
    branches:  
      - main  

permissions:  
  packages: write  
  contents: read  

jobs:  
  build-and-push:  
    runs-on: ubuntu-latest  

    steps:  
      - name: Checkout repository  
        uses: actions/checkout@v4  

      - name: Set up Docker Buildx  
        uses: docker/setup-buildx-action@v3  

      - name: Log in to GitHub Container Registry  
        uses: docker/login-action@v3  
        with:  
          registry: ghcr.io  
          username: ${{ github.actor }}  
          password: ${{ secrets.GITHUB_TOKEN }}  

      - name: Build and push Docker image  
        uses: docker/build-push-action@v6  
        with:  
          context: .  
          push: true  
          cache-from: type=registry,ref=ghcr.io/prodreams/tempproject:latest  
          cache-to: type=inline  
          tags: |  
            ghcr.io/prodreams/tempproject:latest    
            ghcr.io/prodreams/tempproject:${{ github.sha }}  

  deploy:  
    runs-on: ubuntu-latest  

    needs: build-and-push  

    steps:  
      - name: Trigger Portainer webhook  
        env:  
          PORTAINER_WEBHOOK_URL: ${{ secrets.PORTAINER_WEBHOOK_URL }}  
        run: curl -fsS -m 30 -X POST "$PORTAINER_WEBHOOK_URL"
```

### Дополняем код бота

Ранее мы уже запустили бота, создав стек в Portainer.  
Чтобы проверить обновление проекта через новый деплой, немного расширим функционал бота и добавим тестовую команду.

Обновлённый код:

```python
import asyncio  
import os  

from aiogram import Dispatcher, Bot  
from aiogram.filters import Command  
from aiogram.types import Message  
from dotenv import load_dotenv  

load_dotenv()  

async def send_message(message: Message) -> None:  
    await message.answer(text="Hello World!")  

async def send_sticker(message: Message) -> None:  
    await message.answer_sticker(sticker="CAACAgIAAxkBAAEKbW1lGVW1I6zFVLyovwo2rSgIt1l35QADJQACYp0ISWYMy8-mubjIMAQ")  

async def start():  
    bot = Bot(token=os.getenv('BOT_TOKEN'))  
    dp = Dispatcher()  

    dp.message.register(send_sticker, Command(commands="test"))  
    dp.message.register(send_message)  

    try:  
        await dp.start_polling(bot)  
    finally:  
        await bot.session.close()  

if __name__  "__main__":  
    asyncio.run(start())
```

Что изменилось:

- Добавлена функция `**send_sticker**`, которая отправляет стикер.
- В диспетчер зарегистрирован обработчик:
	- команда `**/test**` вызывает `send_sticker`,
		- любое другое сообщение вызывает `send_message` и отвечает **«Hello World!»**.

Теперь у нас есть удобный способ проверить, что новая версия бота действительно задеплоилась: достаточно отправить `/test` и убедиться, что в ответ приходит стикер.

### Пуш изменений

Осталось последний шаг — отправить изменения в удалённый репозиторий.  
После этого GitHub Actions сразу запустит сборку новой версии образа и деплой через Portainer.

Выполняем знакомые команды:

```bash
git add .github/workflows/build_and_deploy.yaml docker-compose.yaml main.py

git commit -m "CI/CD: Deploy"

git push
```

Теперь заходим в репозиторий на GitHub и открываем раздел **Actions**:

![](https://napkincode.ru/media/post/2025/08/05/image-20250807114233626.png)

Видим, что запустился Workflow, и теперь в нём выполняются **две задачи**:

![](https://napkincode.ru/media/post/2025/08/05/image-20250807114254422.png)

Если перейти в подробности задачи **deploy**, можно убедиться, что всё прошло успешно.  
Обратите внимание: адрес вебхука в логах не отображается — это сделано для безопасности, так как он хранится в **GitHub Secrets**:

![](https://napkincode.ru/media/post/2025/08/05/image-20250807114341060.png)

Теперь проверим бота:

![](https://napkincode.ru/media/post/2025/08/05/image-20250807114359618.png)

Бот работает корректно!

CI/CD-процесс полностью автоматизирован:

- при каждом пуше в `main` собирается новый образ,
- Portainer подтягивает его и перезапускает стек,
- а вы сразу можете протестировать новую версию.

---

## Заключение

За эти три статьи мы шаг за шагом разобрались, как устроен процесс деплоя:  
от запуска приложения напрямую из Git-репозитория — до полноценного автоматизированного CI/CD.

### В чём преимущество Portainer с Webhook

Обычно деплой выглядит так:  
Workflow подключается к серверу по SSH и выполняет там команды для обновления проекта.  
Этот способ подходит для сложных систем, но для большинства небольших проектов он слишком громоздкий и неудобный.

С Portainer всё проще:

- через удобный интерфейс вы создаёте контейнеры и управляете ими,
- а благодаря Webhook контейнеры автоматически обновляются после каждой сборки нового образа.

Такой подход особенно ценен для новичков: он позволяет быстро и безопасно внедрить CI/CD без лишней сложности.

Подписывайтесь на наш Telegram‑канал [«Код на салфетке»](https://t.me/press_any_button) —  
там вы найдёте ещё больше полезных материалов, как для новичков, так и для опытных разработчиков!