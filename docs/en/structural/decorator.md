---
title: Decorator Pattern
description: Dynamically attach additional responsibilities to an object without modifying its interface — a flexible alternative to subclassing.
---

# Decorator Pattern

::: tip Definition
Dynamically attach additional responsibilities to an object **without modifying** the original object or its interface. The Decorator pattern is more flexible than subclass inheritance for extending functionality.
:::

## 1. Intent

**What problem does it solve?**
*   You need to dynamically **layer** new behaviors onto an object without modifying its source code.
*   Using inheritance for every combination leads to subclass explosion, and inheritance is static — you can't mix-and-match behaviors at runtime.

**Example scenarios**
*   ✅ Scenario A: An HTTP request pipeline — layer logging, authentication, rate limiting, and response compression as cross-cutting concerns around core business logic.
*   ✅ Scenario B: SaaS subscription billing — base plan + optional add-ons (advanced analytics, API quota boost, dedicated support); each add-on is a decorator.
*   ❌ Anti-pattern: If the feature combinations are fixed and very few, just write a couple of subclasses — no need for decorators.

## 2. Structure

### UML Class Diagram

> ![Decorator](../images/8335a62e6bd3a59e7d75b2d0462af31f.png)

### Roles & Responsibilities
| Role | Name | Responsibility |
| :--- | :--- | :--- |
| **Component** | Component Interface | Defines the core interface shared by decorators and the decorated object. |
| **ConcreteComponent** | Concrete Component | The original object containing core business logic. |
| **Decorator** | Abstract Decorator | Holds a Component reference and delegates calls. |
| **ConcreteDecorator** | Concrete Decorator | Adds new behavior before/after delegating to the wrapped component. |

### Collaboration Flow
1. Client creates a ConcreteComponent.
2. Wraps it with one or more ConcreteDecorators.
3. Calls the outermost decorator's method — decorators execute their added logic layer by layer, forming an **onion model**.

## 3. Code Example

> **Scenario**: An **HTTP request processing pipeline** — core handler wrapped with logging, auth, and rate limiting decorators.

::: code-group

```cs [C#]
// Component
public interface IHttpHandler
{
    string Handle(string request);
}

// ConcreteComponent — core business handler
public class BusinessHandler : IHttpHandler
{
    public string Handle(string request)
        => $"[Response] Processed: {request}";
}

// Abstract Decorator
public abstract class HttpHandlerDecorator : IHttpHandler
{
    protected readonly IHttpHandler Inner;
    protected HttpHandlerDecorator(IHttpHandler inner) => Inner = inner;
    public virtual string Handle(string request) => Inner.Handle(request);
}

// ConcreteDecorator A — Logging
public class LoggingDecorator : HttpHandlerDecorator
{
    public LoggingDecorator(IHttpHandler inner) : base(inner) { }

    public override string Handle(string request)
    {
        Console.WriteLine($"[LOG] Request: {request}");
        var response = Inner.Handle(request);
        Console.WriteLine($"[LOG] Response: {response}");
        return response;
    }
}

// ConcreteDecorator B — Authentication
public class AuthDecorator : HttpHandlerDecorator
{
    public AuthDecorator(IHttpHandler inner) : base(inner) { }

    public override string Handle(string request)
    {
        if (!request.Contains("token=valid"))
            return "[Error] 401 Unauthorized";
        return Inner.Handle(request);
    }
}

// ConcreteDecorator C — Rate Limiting
public class RateLimitDecorator : HttpHandlerDecorator
{
    private int _remaining;
    public RateLimitDecorator(IHttpHandler inner, int limit) : base(inner)
        => _remaining = limit;

    public override string Handle(string request)
    {
        if (_remaining <= 0)
            return "[Error] 429 Too Many Requests";
        _remaining--;
        return Inner.Handle(request);
    }
}
```

```java [Java]
// Component
public interface HttpHandler {
    String handle(String request);
}

// ConcreteComponent
public class BusinessHandler implements HttpHandler {
    @Override
    public String handle(String request) {
        return "[Response] Processed: " + request;
    }
}

// Abstract Decorator
public abstract class HttpHandlerDecorator implements HttpHandler {
    protected final HttpHandler inner;
    protected HttpHandlerDecorator(HttpHandler inner) { this.inner = inner; }

    @Override
    public String handle(String request) { return inner.handle(request); }
}

// Logging Decorator
public class LoggingDecorator extends HttpHandlerDecorator {
    public LoggingDecorator(HttpHandler inner) { super(inner); }

    @Override
    public String handle(String request) {
        System.out.println("[LOG] Request: " + request);
        String response = inner.handle(request);
        System.out.println("[LOG] Response: " + response);
        return response;
    }
}

// Auth Decorator
public class AuthDecorator extends HttpHandlerDecorator {
    public AuthDecorator(HttpHandler inner) { super(inner); }

    @Override
    public String handle(String request) {
        if (!request.contains("token=valid"))
            return "[Error] 401 Unauthorized";
        return inner.handle(request);
    }
}

// Rate Limit Decorator
public class RateLimitDecorator extends HttpHandlerDecorator {
    private int remaining;
    public RateLimitDecorator(HttpHandler inner, int limit) {
        super(inner);
        this.remaining = limit;
    }

    @Override
    public String handle(String request) {
        if (remaining <= 0)
            return "[Error] 429 Too Many Requests";
        remaining--;
        return inner.handle(request);
    }
}
```

:::

Client usage:

::: code-group

```cs [C#]
IHttpHandler pipeline = new RateLimitDecorator(
    new AuthDecorator(
        new LoggingDecorator(
            new BusinessHandler())),
    limit: 100);

Console.WriteLine(pipeline.Handle("/api/orders?token=valid"));
Console.WriteLine(pipeline.Handle("/api/orders")); // 401 Unauthorized
```

```java [Java]
HttpHandler pipeline = new RateLimitDecorator(
    new AuthDecorator(
        new LoggingDecorator(
            new BusinessHandler())),
    100);

System.out.println(pipeline.handle("/api/orders?token=valid"));
System.out.println(pipeline.handle("/api/orders")); // 401 Unauthorized
```

:::

## 4. Pros & Cons

### Pros
1. **Runtime flexibility**: Stack any number and order of decorators as needed — far more combinations than inheritance.
2. **Open/Closed Principle**: New cross-cutting concerns require only a new decorator class.
3. **Single Responsibility**: Each decorator focuses on one concern (logging, auth, rate limiting).

### Cons
1. **Deep nesting**: Too many decorators make construction code and debug stack traces complex.
2. **Order-sensitive**: The wrapping order affects execution order — misuse can cause unexpected behavior.

## 5. Related Patterns

| Pattern | Similarity | Key Difference |
| :--- | :--- | :--- |
| **Proxy** | Both hold a reference to the target and enhance behavior | Proxy controls **access** (lazy loading, permissions); Decorator adds **responsibilities** and supports multi-layer stacking. |
| **Composite** | Both use recursive structure | Composite builds part-whole trees; Decorator builds core-wrapper chains. |
| **Chain of Responsibility** | Both form call chains | Each handler in CoR can independently decide to stop propagation; Decorator always delegates inward. |

## 6. Summary

**Core Idea**

*   The Decorator pattern is about **transparent wrapping and layered responsibilities** — adding behavior to an object dynamically without changing its interface, like Russian nesting dolls.

**Real-World Applications**

*   **Java I/O**: `BufferedInputStream(new FileInputStream(...))` is a textbook decorator chain.
*   **ASP.NET Core Middleware**: Each middleware is a decorator — `app.UseAuthentication()`, `app.UseRateLimiter()`, `app.UseResponseCompression()` form a processing pipeline.
*   **Spring Security FilterChain**: Each `Filter` in the `SecurityFilterChain` wraps the request handling logic in decorator fashion.
