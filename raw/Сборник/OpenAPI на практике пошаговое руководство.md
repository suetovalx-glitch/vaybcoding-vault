![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/51d/c05/ff5/51dc05ff52d2d821ff80eb4a0e739f52.png)

OpenAPI — это открытая спецификация для описания REST API. Изначально она называлась Swagger, но в 2016 году была переименована в OpenAPI Specification и передана под управление OpenAPI Initiative. На данный момент Swagger — это набор инструментов для работы со спецификацией OpenAPI (Swagger UI, Editor, Codegen).

В OpenAPI определяются пути, параметры, тела запросов и ответов, коды статусов, схемы данных, типы аутентификации. В статье мы рассмотрим спецификацию OpenAPI версии 3.0: разберем из каких обязательных блоков она состоит и как правильно описывать типы данных и параметры запросов.

### Создаем первый эндпоинт

Для начала создадим пример, на котором изучим базовые концепции. Ниже представлен yaml-файл с одной точкой API:

```yaml
openapi: 3.0.3
info:
  title: API
  version: 0.1.0
servers:
  - url: http://localhost:4010
paths:
  /test:
    get:
      summary: Test
      tags: [test]
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  required: [id, title]
                  properties:
                    id:
                      type: string
                      description: Unique todo identifier
                    title:
                      type: string
                      description: Human readable titleОбъяснить с
```

Файл спецификации содержит описание единственного эндпоинта `/test`, который возвращает массив объектов. Для демонстрации его функциональности мы используем два инструмента: **Prism** (для развертывания мок-сервера) и **Swagger UI** (для визуализации документации и интерактивного тестирования).

```yaml
docker-compose 
services:
  prism:
    image: stoplight/prism:latest
    command: >-
      mock -h 0.0.0.0 -p 4010 --cors --errors --dynamic /spec/${SPEC_PATH:-openapi/openapi.yaml}
    ports:
      - "${PRISM_PORT:-4010}:4010"
    volumes:
      - ./docs:/spec:ro
    restart: unless-stopped

  swagger:
    image: swaggerapi/swagger-ui
    environment:
      SWAGGER_JSON: /spec/${SPEC_PATH:-openapi/openapi.yaml}
    ports:
      - "${SWAGGER_PORT:-8080}:8080"
    volumes:
      - ./docs:/spec:ro
    depends_on:
      - prism
    restart: unless-stoppedОбъяснить с
```

Далее запускаем контейнеры при помощи команды `*SPEC_PATH=basic.yaml docker compose up* -d`, затем переходим по ссылке [http://localhost:8080/](http://localhost:8080/). Если всё правильно работает, то в интерфейсе появится роут `test`.

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/8d4/5f1/64c/8d45f164c8324d59b576dbec7219177f.png)

Затем раскрываем его и нажимаем кнопки "Try it out" и "execute". После чего увидим примерно такой ответ:

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/184/af0/981/184af0981b1e5e7307cfe47f07553475.png)

### Практический пример документирования API

В этом разделе мы создадим API-документацию для блога, чтобы наглядно понять концепции OpenAPI. В примере подробно разберем, как документировать эндпоинты.

#### Структура спецификации

Так как полный файл спецификации достаточно объемный, то в статье рассматриваются только его ключевые элементы. Полная версия файла и инструкция по запуску находится [тут](https://github.com/syncname/openapiexample). Спецификация OpenAPI состоит из восьми корневых элементов:

**openapi (обязательный)**

Версия спецификации OpenAPI всегда указывается первой строкой:

```yaml
openapi: 3.0.3Объяснить с
```

**info (обязательный)**

Раздел метаданных API. Обязательно указываются название (title) и версия (version). Опционально добавляются описание (description), контакты (contact) и лицензия (license). Описание можно форматировать через Markdown.

```yaml
info:
  title: Blog API
  description: |
    **Простое API блога** для изучения OpenAPI 3.0
  version: 1.0.0
  contact:
    name: Blog API Support
    email: support@blog.com
  license:
    name: MITОбъяснить с
```

**servers**

В этом разделе указывается список серверов, на которые могут отправляться запросы. URL формируются относительно базового адреса (например, [https://api.blog.com/v1](https://api.blog.com/v1)). В разделе variables можно настроить динамические параметры, которые будут подставляться в URL.

**paths (обязательный)**

В этом разделе описываются эндпоинты API: пути, HTTP-методы, параметры, тела запросов и форматы ответов, эти поля детально рассмотрим в статье позже.

```yaml
paths:
  /auth/login:
    post:
      summary: Вход в систему
      tags: [Auth]
      # ... детали операции
      
  /posts:
    get:
      summary: Получить список постов
      tags: [Posts]
      # ... параметры и ответы
    post:
      summary: Создать новый пост
      tags: [Posts]
      # ... тело запроса и ответы
      
  /posts/{postId}:
    get:
      summary: Получить пост по ID
      parameters:
        - name: postId
          in: path
          required: true
          schema:
            type: integer
      # ...Объяснить с
```

**components**

Стандарт OpenAPI позволяет нам создавать необходимые компоненты один раз и затем переиспользовать их при необходимости.

Основные типы компонентов:

- schemas — модели данных (User, Post, Error),
- securitySchemes — способы аутентификации,
- responses — общие ответы (404, 401 и т. д.),
- parameters — переиспользуемые параметры.
```yaml
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      
  schemas:
    User:
      type: object
      required: [id, email, name]
      properties:
        id: { type: integer }
        email: { type: string, format: email }
        name: { type: string }
        # ...
        
  responses:
    NotFoundError:
      description: Ресурс не найден
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'Объяснить с
```

**security**

Объект `security` определяет метод аутентификации по умолчанию для всех эндпоинтов:

```yaml
security:
  - BearerAuth: []Объяснить с
```

В OpenAPI поддерживаются 4 типа аутентификации, которые описаны в комментариях примера:

```yaml
components:
  securitySchemes:
    # 1. API Key (в header, query или cookie)
    ApiKeyAuth:
      type: apiKey
      name: X-API-Key
      in: header
    
    # 2. HTTP аутентификация (Basic, Bearer)
    BearerAuth:
      type: http
      scheme: bearer
    
    # 3. OAuth 2.0
    OAuth2:
      type: oauth2
      flows:
        authorizationCode:
          authorizationUrl: https://api.example.com/oauth/authorize
          tokenUrl: https://api.example.com/oauth/token
    
    # 4. OpenID Connect
    OpenID:
      type: openIdConnect
      openIdConnectUrl: https://api.example.com/.well-known/openid-configurationОбъяснить с
```

Для отдельных операций можно изменить настройки безопасности:

```yaml
/public:
  get:
    security: []  # Публичный доступ
    
/secure:
  get:
    security: 
      - BearerAuth: []  # Требует JWT токенОбъяснить с
```

**tags**

Объект `tags` позволяет логически группировать эндпоинты API по разделам, благодаря чему становится проще ориентироваться в документации. Теги объявляются в корне файла спецификации OpenAPI:

```yaml
tags:
  - name: Пользователи
    description: Управление пользователями блога
  - name: Статьи
    description: Операции с публикациями
  - name: Комментарии
    description: Работа с комментариями
  - name: Категории
    description: Управление категориями статейОбъяснить с
```

После того, как мы распределим роуты, страничка документации будет выглядеть примерно так:

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/307/c31/a18/307c31a185d6f0945cfeecb18af16e1e.png)

Каждый эндпоинт отдельно помечается соответствующими тегами:

```yaml
paths:
  /users:
    get:
      tags: ["Пользователи"]
      summary: Получить список пользователей
    post:
      tags: ["Пользователи"]
      summary: Создать нового пользователя

  /posts:
    get:
      tags: ["Статьи"]
      summary: Получить список статей
    post:
      tags: ["Статьи"]
      summary: Создать новую статью

  /posts/{postId}/comments:
    get:
      tags: ["Статьи", "Комментарии"]
      summary: Получить комментарии к статье
    post:
      tags: ["Статьи", "Комментарии"] 
      summary: Добавить комментарий к статьеОбъяснить с
```

**externalDocs**

Объект `externalDocs` предоставляет ссылки на дополнительную документацию, которая может быть полезной для пользователей API. Изначально его можно использовать на корневом уровне:

```yaml
yaml
externalDocs:
  description: Полная документация API блога
  url: https://docs.example.com/api/blogОбъяснить с
```

Но при необходимости можно добавлять ссылки к конкретным эндпоинтам для уточняющей информации:

```yaml
yaml
paths:
  /posts/{postId}/comments:
    get:
      summary: Получить комментарии к статье
      externalDocs:
        description: Руководство по работе с комментариями
        url: https://docs.example.com/guides/commentsОбъяснить с
```

### Структура эндпоинтов и HTTP-методов

Рассмотрим детализацию документации для конкретных эндпоинтов API на примере работы со статьями блога. В данном примере описана спецификация для эндпоинтов `/posts` и `/posts/{postId}`, где для каждого определены соответствующие HTTP-методы: GET, POST, PUT, DELETE, PATCH.

```yaml
yaml
paths:
  /posts:
    get:        # Получить список постов
      summary: Получить список постов
      tags: [Статьи]
      security: []  # Публичный endpoint
      parameters: 
        - name: page
          in: query
          schema: { type: integer, default: 1 }
      responses:
        '200':
          description: Список постов
          # ...
          
    post:       # Создать новый пост
      summary: Создать новый пост
      tags: [Статьи]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PostCreate'
      responses:
        '201':
          description: Пост создан
          # ...

  /posts/{postId}:
    get:        # Получить пост по ID
      # ...
    put:        # Обновить пост
      # ...  
    delete:     # Удалить пост
      # ...Объяснить с
```

Важные параметры HTTP-методов:

- summary — краткое описание операции,
- tags — группировка эндпоинтов (например, \[Статьи\]),
- security — настройки доступа (\[\] для публичных эндпоинтов),
- parameters — параметры запроса (query, path, header),
- responses — описание возможных ответов (200, 201, 400, etc.),
- requestBody — тело запроса для POST/PUT операций.

Обратите внимание на то, как описывается параметр в GET-методе у `/posts`.

Параметр page является query-параметром целочисленного типа со значением по умолчанию 1. В запросе он передается через строку запроса: `/posts?page=2`.

В методе POST для `/posts` используется ссылка $ref: '#/components/schemas/PostCreate'. Конструкция **$ref** представляет собой ссылку на переиспользуемую схему данных PostCreate, определенную в разделе `components/schemas`. Такой подход позволяет избежать дублирования кода, централизованно управлять схемами данных и упростить поддержку и обновление спецификаций.

#### Параметры

В OpenAPI существует четыре варианта передачи параметров: path, query, header и cookie. Каждый тип имеет свою область применения.

**Path-параметры** — обязательные параметры, встроенные в URL-путь. Используются для идентификации конкретного ресурса:

```yaml
paths:
  /posts/{postId}:
    get:
      parameters:
        - name: postId
          in: path
          required: true
          schema:
            type: integer
            minimum: 1Объяснить с
```

**Query-параметры** — необязательные параметры, передаваемые после знака? в URL. Применяются для фильтрации, сортировки и пагинации:

```yaml
paths:
  /posts:
    get:
      parameters:
        - name: page
          in: query
          description: Номер страницы
          schema:
            type: integer
            minimum: 1
            default: 1
        - name: published
          in: query
          schema:
            type: boolean
            default: trueОбъяснить с
```

**Header-параметры** — передаются в HTTP заголовках запроса. Используются для метаданных, версионирования API и авторизации:

```yaml
paths:
  /status:
    get:
      parameters:
        - name: X-API-Version
          in: header
          description: Версия API
          schema:
            type: string
            enum: [v1, v2]
            default: v1Объяснить с
```

**Cookie-параметры** — передаются через HTTP cookies. Применяются для сессий, настроек пользователя и состояния:

```yaml
paths:
  /cart:
    get:
      parameters:
        - name: session_id
          in: cookie
          description: Идентификатор сессии
          schema:
            type: string
            minLength: 1Объяснить с
```

После описания параметров в спецификации они автоматически появляются в интерфейсе Swagger UI. Параметры группируются по типам и отображаются с описаниями и примерами:

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/bbb/d34/ef6/bbbd34ef6ee046887a58cf24df8cc888.png)

Path-параметры обязательны, Query-, Header- и Cookie-параметры опциональны по умолчанию. Для пояснения параметров используйте поле description. Валидацию определяйте через schema (тип, ограничения, значения по умолчанию)

#### Request Body

В этом разделе описывается тело запроса для методов, у которых есть payload (обычно POST/PUT/PATCH). Обязательно указывайте content с медиатипами (например, application/json) и схему (schema) — часто через *$ref* на components/schemas. Флаг *required: true* означает, что тело запроса обязательно.

```yaml
paths:
  /posts:
    post:
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PostCreate'
            example:
              title: "Изучаем OpenAPI"
              content: "В этой статье разберем основы..."
              published: falseОбъяснить с
```

#### Responses

Раздел ответов описывает возможные результаты выполнения операции по HTTP статус-кодам. Для каждого ответа указывайте description, а при наличии тела ответа — content и schema (например через $ref). Стандартные ответы об ошибках удобно выносить в components/responses и переиспользовать.

#### Компоненты и схемы

Компоненты размещаются в объекте `components` и позволяют переиспользовать общие элементы спецификации через поле $ref. При создании моделей данных стоит использовать следующие поля:

- **type** — указывает тип данных, в нашем примере это объект JSON
- **properties** — определяет все поля объекта с их типами и ограничениями
- **required: \[...\]** — массив обязательных полей, которые должны присутствовать
- **example** — примеры значений для полей, упрощают понимание и тестирование
```yaml
components:
  schemas:
    User:
      type: object
      required: [id, email, name]
      properties:
        id: { type: integer, readOnly: true, example: 1 }
        email: { type: string, format: email, example: "john@blog.com" }
        name: { type: string, maxLength: 100, example: "John Doe" }

    Post:
      type: object
      required: [id, title, content]
      properties:
        id: { type: integer, readOnly: true, example: 42 }
        title: { type: string, maxLength: 200 }
        content: { type: string }
: { $ref: '#/components/schemas/User' }Объяснить с
```

Также дополнительно можно использовать следующие поля:

- nullable: true — позволяет принимать значение null
- oneOf/anyOf/allOf — логические операции для схем данных  
	\- oneOf — значение должно соответствовать одной из схем (варианты)  
	\- anyOf — может соответствовать любой из схем (объединение)  
	\- allOf — должно соответствовать всем схемам (наследование/расширение)
- additionalProperties — разрешает объекту иметь поля, не описанные в properties (true — любые поля разрешены, false — разрешены только указанные)
- uniqueItems: true — для массивов, гарантирует уникальность элементов

#### securitySchemes

Схемы аутентификации определяются один раз, после чего они подключаются к любым эндпоинтам через security.

```yaml
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWTОбъяснить с
```

### Переиспользуемые компоненты

В разделе components есть 4 объекта:

- parameters — переиспользуемые параметры (postId, page),
- headers — общие заголовки (X-Total-Count, X-RateLimit),
- responses — стандартные ответы (ошибки 404, 400),
- securitySchemes — схемы аутентификации (Bearer, API Key).

Все подключаются через $ref: '#/components/тип/название'.

#### parameters

Переиспользуемые параметры для нескольких эндпоинтов. Гарантирует единообразие типов и описаний.

```yaml
parameters:
    PostIdParam:
      name: postId
      in: path
      required: true
      description: ID поста
      schema:
        type: integer
        minimum: 1
      example: 42Объяснить с
```

PostIdParam— параметр для переиспользования:

- **name: postId** — имя параметра,
- **in: path** — параметр в пути URL (/posts/{postId}),
- **required: true** — обязательный,
- **schema** — целое число от 1,
- **example: 42** — пример значения.

Использование: $ref: '#/components/parameters/PostIdParam'

#### headers

Переиспользуемые заголовки ответов:

```yaml
headers:
    TotalCount:
      description: Общее количество элементов
      schema:
        type: integer
      example: 150Объяснить с
```

**TotalCount** — заголовок для переиспользования:

- **description** — описание
- **schema** — целое число
- **example** — пример

Использование: $ref: '#/components/headers/TotalCount'

#### responses

Тут находятся шаблоны стандартных ответов API. Они определяют HTTP-ответы со ссылками на схемы данных.

```yaml
responses:
    ValidationError:
      description: Ошибка валидации
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ValidationError'
    NotFound:
      description: Ресурс не найден
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'Объяснить с
```

**ValidationError** — ответ для ошибок валидации с деталями по каждому полю. **NotFound** — ответ для несуществующих ресурсов. Обратите внимание на то, что имена схем и ответов(responses) могут совпадать, за счет того что у них разные пути к конечным объектам.

Response содержит:

- description — описание ответа
- content — тип контента (обычно JSON)
- schema — ссылка на структуру данных в components/schemas

**Пример использования:**

```yaml
paths:
  /posts:
    post:
      responses:
        '400':
          $ref: '#/components/responses/ValidationError'
        '404':
          $ref: '#/components/responses/NotFound'Объяснить с
```

**Примеры JSON-ответов:**

```yaml
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Неверный формат email"
  }
}Объяснить с
```
```yaml
{
  "code": "VALIDATION_ERROR",
  "message": "Ошибка валидации входных данных",
  "errors": [
    {
      "field": "email",
      "code": "INVALID_FORMAT", 
      "message": "Неверный формат email"
    }
  ]
}Объяснить с
```

#### securitySchemes

Схемы аутентификации определяют способы защиты API. После объявления их можно применять ко всему API или отдельным эндпоинтам. Ниже представлен пример для BearerAuth (схема JWT-аутентификации через заголовок Authorization):

```yaml
securitySchemes:
  BearerAuth:
    type: http
    scheme: bearer
    bearerFormat: JWT
    description: |
      JWT токен в заголовке Authorization.
      Пример: \`Authorization: Bearer <token>\`Объяснить с
```

SecurityScheme содержит:

- type — тип аутентификации (http, apiKey, oauth2, openIdConnect),
- scheme — схема HTTP-аутентификации (bearer, basic),
- bearerFormat — формат токена (опционально),
- description — описание использования.

Глобальное применение:

```yaml
security:
  - BearerAuth: []Объяснить с
```

Применение к эндпоинту:

```yaml
paths:
  /posts:
    post:
      security:
        - BearerAuth: []
      # ...
  /public:
    get:
      security: []  # Отключение аутентификации
      # ...Объяснить с
```

### Разбиение спецификации OpenAPI на файлы

Монолитная спецификация OpenAPI быстро становится большой и сложной при росте API. Файл в несколько тысяч строк усложняет навигацию, код-ревью и командную работу. Модульная структура решает эти проблемы через разделение ответственности: каждый компонент хранится в отдельном файле и подключается через механизм ссылок $ref.

Корневой `openapi.yaml ` содержит только метаинформацию и ссылки:

```yaml
openapi: 3.0.3
info:
  title: Blog API
  version: 1.0.0

paths:
  /posts:
    $ref: './paths/posts.yaml'
  /posts/{postId}:
    $ref: './paths/posts.{postId}.yaml'

components:
  schemas:
    Post:
      $ref: './components/schemas/Post.yaml'Объяснить с
```

**paths/posts.yaml** описывает операции с коллекцией:

```yaml
get:
  summary: Получить список статей
  responses:
    '200':
      content:
        application/json:
          schema:
            $ref: '../components/schemas/PostList.yaml'Объяснить с
```

**components/schemas/Post.yaml** определяет структуру данных:

```yaml
type: object
required: [id, title, content]
properties:
  id: { type: integer }
  title: { type: string, maxLength: 200 }
  content: { type: string }Объяснить с
```

В результате вместо одного большого файла мы получаем модульную структуру с интуитивно понятными названиями. Пример организации файлов:

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/5bd/830/6a9/5bd8306a958fae6eb85c90e7a3371c4c.png)

Механизм $ref поддерживает относительные пути от текущего файла. При ссылке из paths/ на компоненты используется префикс../components/. Внутри одной директории можно ссылаться напрямую:./User.yaml. Полный пример разбиения монолитного файла можете посмотреть на [гитхабе](https://github.com/syncname/openapiexample).

### Валидация файлов спецификации

Для проверки OpenAPI-документации используются два инструмента с разными задачами. Для проверки синтаксиса используется yq. Redocly CLI проверяет файл на соответствие спецификации OpenAPI. Оба инструмента легко интегрируются в CI/CD-процессы.

Установка инструментов:

```bash
sudo snap install yq
npm install -g @redocly/cliОбъяснить с
```

Сначала проверим корректность YAML-файла. Утилита yq позволяет найти синтаксические ошибки. Для проверки нужно выполнить следующую команду:

```bash
yq e '.' docs/openapi/openapi.yaml >/dev/null && echo "OK"Объяснить с
```

При успешной проверке команда выведет OK. В случае ошибки будет показано сообщение с указанием проблемной строки.

После проверки синтаксиса мы должны удостовериться, что содержимое файла соответствует стандарту OpenAPI и не содержит логических ошибок. Для этого применяется инструмент RedoclyCLI. Пример команды для валидации:

```bash
redocly lint docs/openapi/openapi.yamlОбъяснить с
```

При наличии ошибок Redocly покажет детальное описание проблем с указанием файлов и путей.

### Общие выводы

OpenAPI 3.0 представляет собой стандарт документирования REST API, обеспечивающий единый контракт между фронтендом и бэкендом. Спецификация описывает все аспекты API: эндпоинты, параметры, модели данных, методы аутентификации и форматы ответов.

**Автор** [**alex\_name\_m**](https://habr.com/ru/users/alex_name_m/)

---


