---
title: 建造者模式
description: 将一个复杂对象的构建与其表示分离，使得同样的构建过程可以创建不同的表示。
---

# 建造者模式

::: tip 定义
**建造者模式**：将一个复杂对象的**构建**与其**表示**分离，使得同样的构建过程可以创建不同的表示。它允许逐步构建复杂对象，避免构造函数参数爆炸。
:::

## 1. 模式意图

**解决了什么问题？**
*   当对象的构造过程包含大量可选参数时，构造函数会变成"望远镜式构造函数"（telescoping constructor），参数顺序难以记忆，代码可读性差。
*   当对象的创建步骤固定但每一步的具体实现可能不同时，需要将"怎么建"和"建什么"分离。

**应用场景举例**
*   ✅ 构建 HTTP 请求：URL、Method、Headers、Body 等参数大多可选，用建造者逐步设置。
*   ✅ 构建复杂邮件：收件人、抄送、密送、附件、HTML 正文等字段组合灵活。
*   ✅ SQL 查询构建器：`SELECT`、`WHERE`、`ORDER BY`、`LIMIT` 按需拼接。
*   ❌ 对象只有少量必填参数且参数固定时，直接用构造函数更简单。

## 2. 模式结构

### UML 类图

![建造者模式](../images/84e1311ac13c1ab1ed6395a437376fcc-17175962994103.png)

### 角色与职责
| 角色 | 名称 | 职责描述 |
| :--- | :--- | :--- |
| **Product** | 产品 | 被构建的复杂对象，包含多个组成部分。 |
| **Builder** | 抽象建造者 | 定义创建产品各个部分的抽象方法接口。 |
| **ConcreteBuilder** | 具体建造者 | 实现建造接口，负责各部分的具体构建和装配，并提供获取最终产品的方法。 |
| **Director** | 指挥者 | 控制构建流程，按特定顺序调用建造者的方法（在流式 API 中可省略）。 |

### 协作流程
1. 客户端创建具体建造者实例。
2. （可选）将建造者传给指挥者，由指挥者控制构建顺序。
3. 建造者逐步设置产品的各个部分。
4. 调用 `build()` 或 `getResult()` 获取最终产品。

## 3. 代码实现

> **代码场景**：以 HTTP 请求构建器为例，展示流式 API（Fluent Interface）方式。

::: code-group
```csharp [C#]
public class HttpRequest
{
    public string URL { get; internal set; }
    public string Method { get; internal set; }
    public Dictionary<string, string> Headers { get; internal set; }
    public string Body { get; internal set; }

    public override string ToString() => $"{Method} {URL}\nHeaders: {Headers.Count}\nBody: {Body}";
}

public class HttpRequestBuilder
{
    private readonly HttpRequest _request = new HttpRequest { Headers = new() };

    public HttpRequestBuilder SetUrl(string url)
    {
        _request.URL = url; // [!code highlight]
        return this;
    }

    public HttpRequestBuilder SetMethod(string method)
    {
        _request.Method = method.ToUpper(); // [!code highlight]
        return this;
    }

    public HttpRequestBuilder AddHeader(string key, string value)
    {
        _request.Headers[key] = value;
        return this;
    }

    public HttpRequestBuilder SetBody(string body)
    {
        _request.Body = body;
        return this;
    }

    public HttpRequest Build() => _request;
}
```

```java [Java]
import java.util.HashMap;
import java.util.Map;

public class HttpRequest {
    private String url;
    private String method;
    private Map<String, String> headers;
    private String body;

    private HttpRequest() {}

    public static class Builder {
        private String url;
        private String method = "GET";
        private Map<String, String> headers = new HashMap<>();
        private String body;

        public Builder url(String url) {
            this.url = url; // [!code highlight]
            return this;
        }

        public Builder method(String method) {
            this.method = method; // [!code highlight]
            return this;
        }

        public Builder header(String key, String value) {
            this.headers.put(key, value);
            return this;
        }

        public Builder body(String body) {
            this.body = body;
            return this;
        }

        public HttpRequest build() {
            HttpRequest request = new HttpRequest();
            request.url = this.url;
            request.method = this.method;
            request.headers = this.headers;
            request.body = this.body;
            return request;
        }
    }
}
```
:::

客户端调用：

::: code-group
```csharp [C#]
var request = new HttpRequestBuilder()
    .SetUrl("https://api.example.com")
    .SetMethod("POST")
    .AddHeader("Content-Type", "application/json")
    .SetBody("{ \"key\": \"value\" }")
    .Build();

Console.WriteLine(request);
```

```java [Java]
HttpRequest request = new HttpRequest.Builder()
    .url("https://api.example.com")
    .method("POST")
    .header("Content-Type", "application/json")
    .body("{ \"key\": \"value\" }")
    .build();
```
:::

## 4. 优缺点分析

### 优点
1. **代码可读性强**：流式 API 让调用方代码自解释，无需记忆参数顺序。
2. **灵活组合**：每个构建步骤独立，客户端按需设置，不必传无用的 `null`。
3. **构建与表示分离**：相同的构建流程可以产出不同的产品表示。

### 缺点
1. **额外的类**：需要为每种产品编写对应的建造者类，增加了代码量。
2. **产品结构要求稳定**：如果产品内部结构频繁变化，建造者也需要同步修改。

## 5. 相关模式对比

| 模式名称 | 相似点 | 核心区别 |
| :--- | :--- | :--- |
| **抽象工厂** | 都用于创建复杂对象 | 抽象工厂创建**产品族**（一组相关对象）；建造者**分步构建单个复杂对象**。 |
| **工厂方法** | 都封装了对象创建 | 工厂方法关注**创建哪种对象**；建造者关注**如何一步步组装对象**。 |
| **原型模式** | 都能生成新对象 | 原型通过**克隆**快速复制已有对象；建造者从零开始**逐步构建**新对象。 |

## 6. 总结与思考

**核心思想**

*   建造者的"魂"在于**分步构建**：把复杂对象的创建过程拆解为一系列独立的、可选的步骤，让客户端按需组合，而不是被迫一次性传入所有参数。流式接口（Fluent API）是现代建造者的标配实现方式。

**实际应用**

*   **Java**：`StringBuilder.append().append().toString()`、`Stream.filter().map().collect()`、`HttpClient.newBuilder().version(HTTP_2).build()` 都是建造者模式的典型应用。
*   **.NET**：`IHostBuilder` 在 ASP.NET Core 中用于逐步配置 Web 主机（Kestrel、日志、DI 容器等），`ConfigurationBuilder` 用于按层叠加配置源。
*   **MyBatis**：`SqlSessionFactoryBuilder` 从 XML 配置或 Java 代码分步构建 `SqlSessionFactory`。
*   **Lombok**：`@Builder` 注解自动为 Java 类生成建造者代码，将这一模式内化为语言级特性。
