Всем привет!!! Это мой первый пост на Хабре и я хочу поделиться с вами своим опытом в исследовании нового для себя фреймворка.

Мне предоставился момент выбрать тему и подготовить презентацию для своей команды. Вдохновившись спикером Евгений Маренковым, я решил выбрать данную тему. В процессе подготовки, я облазил много статей и репозиториев, чтобы компактно и эффективно донести нужную информацию.

Сейчас хочу поделиться ею в надежде, что кому-то она поможет в изучение Swagger (OpenApi 3.0)

## Введение

Я на 99% уверен у многих из вас были проблемы с поиском документации для нужного вам контроллера. Многие если и находили ее быстро, но в конечном итоге оказывалось что она работает не так как описано в документации, либо вообще его уже нет.  
Сегодня я вам докажу, что есть способы поддерживать документацию в актуальном виде и в этом мне будет помогать Open Source framework от компании SmartBear под названием Swagger, а с 2016 года он получил новое обновление и стал называться OpenAPI Specification.

**Swagger** - это фреймворк для спецификации RESTful API. Его прелесть заключается в том, что он дает возможность не только интерактивно просматривать спецификацию, но и отправлять запросы – так называемый Swagger UI.

Также возможно сгенерировать непосредственно клиента или сервер по спецификации API Swagger, для этого понадобится Swagger Codegen.

## Основные подходы

Swagger имеет два подхода к написанию документации:

- Документация пишется на основании вашего кода.
	- Данный подход позиционируется как "очень просто". Нам достаточно добавить несколько зависимостей в проект, добавить конфигурацию и уже мы будем иметь нужную документацию, хоть и не настолько описанной какою мы хотели.
		- Код проекта становится не очень читабельным от обилия аннотаций и описания в них.
		- Вся документация будет вписана в нашем коде (все контроллеры и модели превращаются в некий Java Swagger Code)
		- Подход не советуют использовать, если есть возможности, но его очень просто интегрировать.
- Документация пишется отдельно от кода.
	- Данный подход требует знать синтаксис Swagger Specification.
		- Документация пишется либо в YAML/JSON файле, либо в редакторе Swagger Editor.

## Swagger Tools

Swagger или OpenAPI framework состоит из 4 основных компонентов:

1. [**Swagger Core**](https://github.com/swagger-api/swagger-core) - позволяет генерировать документацию на основе существующего кода основываясь на Java Annotation.
2. [**Swagger Codegen**](https://github.com/swagger-api/swagger-codegen) - позволит генерировать клиентов для существующей документации.
3. [**Swagger UI**](https://github.com/swagger-api/swagger-ui) - красивый интерфейс, который представляет документацию. Дает возможность просмотреть какие типы запросов есть, описание моделей и их типов данных.
4. [**Swagger Editor**](https://github.com/swagger-api/swagger-editor) - Позволяет писать документацию в YAML или JSON формата.

Теперь давайте поговорим о каждом компоненте отдельно.

## Swagger Core

**Swagger Code** - это Java-реализация спецификации OpenAPI

Для того что бы использовать Swagger Core во все орудие, требуется:

- Java 8 или больше
- Apache Maven 3.0.3 или больше
- Jackson 2.4.5 или больше

Что бы внедрить его в проект, достаточно добавить две зависимости:

```java
<dependency>
    <groupId>io.swagger.core.v3</groupId>
    <artifactId>swagger-annotations</artifactId>
    <version>2.1.6</version>
</dependency>
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-ui</artifactId>
    <version>1.5.2</version>
</dependency>Объяснить с
```

Также можно настроить maven плагин, что бы наша документация при сборке проект генерировалсь в YAML

```java
<plugin>
 <groupId>org.springdoc</groupId>
 <artifactId>springdoc-openapi-maven-plugin</artifactId>
 <version>0.3</version>
 <executions>
   <execution>
   <phase>integration-test</phase>
   <goals>
     <goal>generate</goal>
   </goals>
   </execution>
 </executions>
 <configuration>
   <apiDocsUrl>http://localhost:8080/v3/api-docs</apiDocsUrl>
   <outputFileName>openapi.yaml</outputFileName>
   <outputDir>${project.build.directory}</outputDir>
 </configuration>
</plugin>Объяснить с
```

Дальше нам необходимо добавить конфиг в проект.

Для конфигурации Swagger необходимо добавить два бина. Где нам нужно будет описать название приложения, версию нашего API, так же можно добавить контакт разработчика, который отвечает за данные API.

```java
@Bean
public GroupedOpenApi publicUserApi() {
    return GroupedOpenApi.builder()
                         .group("Users")
                         .pathsToMatch("/users/**")
                         .build();
}

@Bean
public OpenAPI customOpenApi(@Value("${application-description}")String appDescription,
                             @Value("${application-version}")String appVersion) {
    return new OpenAPI().info(new Info().title("Application API")
                                        .version(appVersion)
                                        .description(appDescription)
                                        .license(new License().name("Apache 2.0")
                                                              .url("http://springdoc.org"))
                                        .contact(new Contact().name("username")
                                                              .email("test@gmail.com")))
                        .servers(List.of(new Server().url("http://localhost:8080")
                                                     .description("Dev service"),
                                         new Server().url("http://localhost:8082")
                                                     .description("Beta service")));
}Объяснить с
```

После добавления нужных нам зависимостей, у нас появятся новые аннотация с помощью которых можно документировать наш код.

Вот некоторые из них:

- **@Operation** - Описывает операцию или обычно метод HTTP для определенного пути.
- **@Parameter** - Представляет один параметр в операции OpenAPI.
- **@RequestBody** - Представляет тело запроса в операции
- **@ApiResponse** - Представляет ответ в операции
- **@Tag** - Представляет теги для операции или определения OpenAPI.
- **@Server** - Представляет серверы для операции или для определения OpenAPI.
- **@Callback** - Описывает набор запросов
- **@Link** - Представляет возможную ссылку времени разработки для ответа.
- **@Schema** - Позволяет определять входные и выходные данные.
- **@ArraySchema** - Позволяет определять входные и выходные данные для типов массивов.
- **@Content** - Предоставляет схему и примеры для определенного типа мультимедиа.
- **@Hidden** - Скрывает ресурс, операцию или свойство

Примеры использования:

```java
@Tag(name = "User", description = "The User API")
@RestController
public class UserController {}Объяснить с
```
```java
@Operation(summary = "Gets all users", tags = "user")
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "200",
                description = "Found the users",
                content = {
                        @Content(
                                mediaType = "application/json",
                                array = @ArraySchema(schema = @Schema(implementation = UserApi.class)))
                })
})
@GetMapping("/users")
public List<UserApi> getUsers()Объяснить с
```

## Swagger Codegen

**Swagger Codegen** - это проект, который позволяет автоматически создавать клиентские библиотеки API (создание SDK), заглушки сервера и документацию с учетом спецификации OpenAPI.

В настоящее время поддерживаются следующие языки / фреймворки:

- API clients:
	- Java (Jersey1.x, Jersey2.x, OkHttp, Retrofit1.x, Retrofit2.x, Feign, RestTemplate, RESTEasy, Vertx, Google API Client Library for Java, Rest-assured)
		- Kotlin
		- Scala (akka, http4s, swagger-async-httpclient)
		- Groovy
		- Node.js (ES5, ES6, AngularJS with Google Closure Compiler annotations)
		- Haskell (http-client, Servant)
		- C# (.net 2.0, 3.5 or later)
		- C++ (cpprest, Qt5, Tizen)
		- Bash
- Server stub:
	- Java (MSF4J, Spring, Undertow, JAX-RS: CDI, CXF, Inflector, RestEasy, Play Framework, [PKMST](https://github.com/ProKarma-Inc/pkmst-getting-started-examples))
		- Kotlin
		- C# (ASP.NET Core, NancyFx)
		- C++ (Pistache, Restbed)
		- Haskell (Servant)
		- PHP (Lumen, Slim, Silex, [Symfony](https://symfony.com/), [Zend Expressive](https://github.com/zendframework/zend-expressive))
		- Python (Flask)
		- NodeJS
		- Ruby (Sinatra, Rails5)
		- Rust (rust-server)
		- Scala ([Finch](https://github.com/finagle/finch), [Lagom](https://github.com/lagom/lagom), Scalatra)
- API documentation generators:
	- HTML
		- Confluence Wiki
- Other:
	- JMeter

Что бы внедрить его в проект, достаточно добавить зависимость, если используете Swagger:

```java
<dependency>
    <groupId>io.swagger</groupId>
    <artifactId>swagger-codegen-maven-plugin</artifactId>
    <version>2.4.18</version>
</dependency>Объяснить с
```

и если используете OpenApi 3.0, то:

```java
<dependency>
    <groupId>io.swagger.codegen.v3</groupId>
    <artifactId>swagger-codegen-maven-plugin</artifactId>
    <version>3.0.24</version>
</dependency>Объяснить с
```

Можно настроить maven плагин, и уже на процессе сборки мы можем сгенерировать нужный для нас клиент либо мок сервиса.

```java
<plugin>
  <groupId>org.openapitools</groupId>
  <artifactId>openapi-generator-maven-plugin</artifactId>
  <version>3.3.4</version>
  <executions>
    <execution>
      <phase>compile</phase>
      <goals>
        <goal>generate</goal>
      </goals>
      <configuration>
        <generatorName>spring</generatorName>
        <inputSpec>${project.basedir}/src/main/resources/api.yaml</inputSpec>
        <output>${project.build.directory}/generated-sources</output>
        <apiPackage>com.api</apiPackage>
        <modelPackage>com.model</modelPackage>
        <supportingFilesToGenerate>
          ApiUtil.java
        </supportingFilesToGenerate>
        <configOptions>
          <groupId>${project.groupId}</groupId>
          <artifactId>${project.artifactId}</artifactId>
          <artifactVersion>${project.version}</artifactVersion>
          <delegatePattern>true</delegatePattern>
          <sourceFolder>swagger</sourceFolder>
          <library>spring-mvc</library>
          <interfaceOnly>true</interfaceOnly>
          <useBeanValidation>true</useBeanValidation>
          <dateLibrary>java8</dateLibrary>
          <java8>true</java8>
        </configOptions>
        <ignoreFileOverride>${project.basedir}/.openapi-generator-ignore</ignoreFileOverride>
      </configuration>
    </execution>
  </executions>
</plugin>Объяснить с
```

Также все это можно выполнить с помощью командной строки.

Запустив джарник codegen и задав команду **help** можно увидеть команды, которые предоставляет нам **Swagger Codegen**:

- **config-help** - Справка по настройке для выбранного языка
- **generate** - Сгенерировать код с указанным генератором
- **help** - Отображение справочной информации об openapi-generator
- **list** - Перечисляет доступные генераторы
- **meta** - Генератор для создания нового набора шаблонов и конфигурации для Codegen. Вывод будет основан на указанном вами языке и будет включать шаблоны по умолчанию.
- **validate** - Проверить спецификацию
- **version** - Показать информацию о версии, используемую в инструментах

Для нас самые нужные команды это **validate,** которая быстро проверять на валидность спецификации и **generate,** с помощью которой мы можем сгенерировать **Client** на языке **Java**

- java -jar openapi-generator-cli-4.3.1.jar validate -i openapi.yaml
- java -jar openapi-generator-cli-4.3.1.jar generate -i openapi.yaml -g java --library jersey2 -o client-gener-new

## Swagger UI

**Swagger UI** - позволяет визуализировать ресурсы API и взаимодействовать с ними без какой-либо логики реализации. Он автоматически генерируется из вашей спецификации OpenAPI (ранее известной как Swagger), а визуальная документация упрощает внутреннюю реализацию и использование на стороне клиента.

Вот пример Swagger UI который визуализирует документацию для моего pet-project:

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/88b/c9f/0f9/88bc9f0f900b59774d74a79249b4ae80.png)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/3d6/265/2d8/3d62652d8f4a89d0e19297d3e22c1f1b.png)

Нажавши на кнопку "Try it out", мы можем выполнить запрос за сервер и получить ответ от него:

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/145/ff6/1eb/145ff61ebc5841671232e78dc9b02ba6.png)

## Swagger Editor

**Swagger Editor** - позволяет редактировать спецификации **Swagger API** в **YAML** внутри вашего браузера и просматривать документацию в режиме реального времени. Затем можно сгенерировать допустимые описания **Swagger JSON** и использовать их с полным набором инструментов **Swagger** (генерация кода, документация и т. Д.).

На верхнем уровне в спецификации OpenAPI 3.0 существует восемь объектов. Внутри этих верхнеуровневых объектов есть много вложенных объектов, но на верхнем уровне есть только следующие объекты:

1. openapi
2. info
3. servers
4. paths
5. components
6. security
7. tags
8. externalDocs

Для работы над документацией со спецификацией используется [онлайн-редактор Swagger](https://swagger.io/tools/swagger-editor/) Редактор Swagger имеет разделенное представление: слева пишем код спецификации, а справа видим полнофункциональный дисплей Swagger UI. Можно даже отправлять запросы из интерфейса Swagger в этом редакторе.

Редактор Swagger проверит контент в режиме реального времени, и укажет ошибки валидации, во время кодирования документа спецификации. Не стоит беспокоиться об ошибках, если отсутствуют X-метки в коде, над которым идет работа.

Первым и важным свойством для документации это **openapi**. В объекте указывается версия спецификации OpenAPI. Для Swagger спецификации это свойство будет swagger:

```
openapi: "3.0.2"Объяснить с
```

Объект **info** содержит основную информацию о вашем API,включая заголовок, описание, версию, ссылку на лицензию, ссылку на обслуживания и контактную информацию. Многие из этих свойство являются не обязательными.

```
info:
  title: "OpenWeatherMap API"
  description: "Get the current weather, daily forecast for 16 days, and a three-hour-interval forecast for 5 days for your city."
  version: "2.5"
  termsOfService: "https://openweathermap.org/terms"
  contact:
      name: "OpenWeatherMap API"
    url: "https://openweathermap.org/api"
    email: "some_email@gmail.com"
  license:
    name: "CC Attribution-ShareAlike 4.0 (CC BY-SA 4.0)"
    url: "https://openweathermap.org/price"Объяснить с
```

Объект **servers** указывает базовый путь, используемый в ваших запросах API. Базовый путь - это часть URL, которая находится перед конечной точкой. Объект **servers** обладает гибкой настройкой. Можно указать несколько URL-адресов:

```
servers:
  - url: https://api.openweathermap.org/data/2.5/
        description: Production server
  - url: http://beta.api.openweathermap.org/data/2.5/
        description: Beta server
  - url: http://some-other.api.openweathermap.org/data/2.5/
        description: Some other serverОбъяснить с
```

**paths** - Это та же “конечная точка” в соответствии с терминологии спецификации OpenAPI. Каждый объект path содержит объект operations - это методы GET, POST, PUT, DELETE:

```
paths:
  /weather:
     get:Объяснить с
```

Объект **components** уникален среди других объектов в спецификации **OpenAPI**. В components хранятся переиспользуемые определения, которые могут появляться в нескольких местах в документе спецификации. В нашем сценарии документации API мы будем хранить детали для объектов **parameters** и **responses** в объекте **components**

## Conclusions

- Документация стала более понятней для бизнес юзера так и для техническим юзерам (Swagger UI, Open Specifiation)
- Может генерировать код для Java, PHP,.NET, JavaScrypt (Swager Editor, Swagger Codegen)
- Можно проверять насколько совместимы изменения. Можно настраивать это в дженкинсе
- Нет ни какой лишней документации к коде, код отдельно, документация отдельно