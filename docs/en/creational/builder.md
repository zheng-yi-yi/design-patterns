---
title: Builder Pattern
description: Separate the construction of a complex object from its representation so that the same construction process can create different representations.
---

# Builder Design Pattern

::: tip Definition
**Builder Pattern**: Separate the **construction** of a complex object from its **representation**, so that the same construction process can create different representations. It allows step-by-step construction of complex objects, avoiding the telescoping constructor anti-pattern.
:::

## 1. Pattern Intent

**What problem does it solve?**
*   When an object's constructor has many optional parameters, it becomes a "telescoping constructor" — parameter order is hard to remember, callers pass `null` for unused parameters, and readability suffers.
*   When the construction steps are fixed but the specific implementation of each step may vary, the "how to build" needs to be separated from "what to build."

**Application scenarios**
*   ✅ Building HTTP requests: URL, Method, Headers, Body are mostly optional — a builder sets them incrementally.
*   ✅ Building complex emails: recipients, CC, BCC, attachments, HTML body — flexible combinations.
*   ✅ SQL query builders: `SELECT`, `WHERE`, `ORDER BY`, `LIMIT` assembled on demand.
*   ❌ When an object has only a few required parameters and they are fixed, a regular constructor is simpler.

## 2. Pattern Structure

### UML Class Diagram

![Builder Pattern](../images/84e1311ac13c1ab1ed6395a437376fcc-17175962994103.png)

### Roles & Responsibilities
| Role | Name | Responsibility |
| :--- | :--- | :--- |
| **Product** | Product | The complex object being built, containing multiple parts. |
| **Builder** | Abstract Builder | Defines the abstract interface for creating each part of the product. |
| **ConcreteBuilder** | Concrete Builder | Implements the builder interface; responsible for building and assembling parts; provides a method to retrieve the final product. |
| **Director** | Director | Controls the construction process by calling builder methods in a specific order (can be omitted in fluent API approaches). |

### Collaboration Flow
1. The client creates a concrete builder instance.
2. (Optional) The builder is passed to a director, which controls the construction order.
3. The builder incrementally sets each part of the product.
4. The client calls `build()` or `getResult()` to retrieve the final product.

## 3. Code Implementation

> **Scenario**: An HTTP request builder demonstrating the Fluent API approach.

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

Client usage:

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

## 4. Pros & Cons

### Pros
1. **Readable code**: The fluent API makes client code self-documenting — no need to remember parameter order.
2. **Flexible composition**: Each build step is independent; clients set only what they need, avoiding unnecessary `null` parameters.
3. **Separates construction from representation**: The same build process can produce different product representations.

### Cons
1. **Extra classes**: Each product requires a corresponding builder class, adding code volume.
2. **Requires stable product structure**: If the product's internal structure changes frequently, the builder must be updated in sync.

## 5. Related Pattern Comparison

| Pattern | Similarity | Key Difference |
| :--- | :--- | :--- |
| **Abstract Factory** | Both create complex objects | Abstract Factory creates **product families** (a set of related objects); Builder **step-by-step constructs a single complex object**. |
| **Factory Method** | Both encapsulate object creation | Factory Method focuses on **which object to create**; Builder focuses on **how to assemble the object step by step**. |
| **Prototype** | Both can generate new objects | Prototype **clones** an existing object quickly; Builder **constructs from scratch** step by step. |

## 6. Summary

**Core Idea**

*   The essence of Builder is **incremental construction**: it breaks down a complex object's creation into a series of independent, optional steps, letting clients compose what they need rather than being forced to supply all parameters at once. The Fluent API is the standard modern implementation approach.

**Real-World Applications**

*   **Java**: `StringBuilder.append().append().toString()`, `Stream.filter().map().collect()`, `HttpClient.newBuilder().version(HTTP_2).build()` are all classic Builder pattern applications.
*   **.NET**: `IHostBuilder` in ASP.NET Core configures the web host step by step (Kestrel, logging, DI container, etc.); `ConfigurationBuilder` layers configuration sources incrementally.
*   **MyBatis**: `SqlSessionFactoryBuilder` step-by-step constructs a `SqlSessionFactory` from XML configuration or Java code.
*   **Lombok**: The `@Builder` annotation auto-generates builder code for Java classes, internalizing this pattern as a language-level feature.
