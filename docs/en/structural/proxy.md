---
title: Proxy Pattern
description: Provide a surrogate or placeholder for another object to control access to it.
---

# Proxy Pattern

::: tip Definition
Provide a surrogate or placeholder for another object to **control access** to it. The proxy and real object implement the same interface, making the substitution transparent to clients.
:::

## 1. Intent

**What problem does it solve?**
*   You need to add control logic (permission checks, lazy loading, caching, logging) when accessing an object, without modifying the object's code.
*   The real object is expensive to create (large files, remote connections) and should be created on-demand or have its results cached.

**Example scenarios**
*   ✅ Scenario A: **Image/video lazy loading** — use a placeholder proxy on page load; fetch the real resource only when the user scrolls into the viewport.
*   ✅ Scenario B: **API response caching proxy** — cache third-party API results to avoid redundant calls and rate limit exhaustion.
*   ✅ Scenario C: **Database access permission proxy** — verify the current user's read permissions before executing queries.
*   ❌ Anti-pattern: If objects are cheap to create and need no access control, a proxy just adds unnecessary indirection.

## 2. Structure

### UML Class Diagram

> ![Proxy](../images/35274f1b008b4da2b1632bc2b9da3e8d.png)

### Roles & Responsibilities
| Role | Name | Responsibility |
| :--- | :--- | :--- |
| **Subject** | Subject Interface | Defines the shared interface for RealSubject and Proxy. |
| **RealSubject** | Real Subject | The actual object performing real business logic. |
| **Proxy** | Proxy | Holds a RealSubject reference; adds control logic before/after delegation. |

### Common Proxy Types
| Type | Description |
| :--- | :--- |
| **Remote Proxy** | Represents an object in a different address space (e.g., gRPC stub). |
| **Virtual Proxy** | Defers creation of expensive objects until actually needed. |
| **Protection Proxy** | Controls access permissions to the original object. |
| **Caching Proxy** | Caches results to avoid redundant computation or remote calls. |

### Collaboration Flow
1. Client calls a method through the Subject interface.
2. Proxy intercepts the request and performs additional logic (permission check / cache lookup / lazy init).
3. If the check passes or cache misses, delegates to RealSubject.
4. Proxy may post-process results (log / cache) before returning.

## 3. Code Example

> **Scenario**: A **third-party API caching proxy** — cache external weather API responses to avoid frequent requests.

::: code-group

```cs [C#]
// Subject
public interface IWeatherService
{
    string GetForecast(string city);
}

// RealSubject — actual external API call
public class ExternalWeatherService : IWeatherService
{
    public string GetForecast(string city)
    {
        Console.WriteLine($"  🌐 [Remote call] Fetching weather for {city}...");
        Thread.Sleep(1000); // simulate latency
        return $"{city}: Sunny, 26°C";
    }
}

// Proxy — caching proxy
public class CachingWeatherProxy : IWeatherService
{
    private readonly IWeatherService _realService;
    private readonly Dictionary<string, (string result, DateTime expiry)> _cache = new();
    private readonly TimeSpan _ttl;

    public CachingWeatherProxy(IWeatherService realService, TimeSpan ttl)
    {
        _realService = realService;
        _ttl = ttl;
    }

    public string GetForecast(string city)
    {
        if (_cache.TryGetValue(city, out var entry) && entry.expiry > DateTime.UtcNow)
        {
            Console.WriteLine($"  ⚡ [Cache hit] {city}");
            return entry.result;
        }

        Console.WriteLine($"  💨 [Cache miss] {city}");
        var result = _realService.GetForecast(city);
        _cache[city] = (result, DateTime.UtcNow.Add(_ttl));
        return result;
    }
}
```

```java [Java]
// Subject
public interface WeatherService {
    String getForecast(String city);
}

// RealSubject
public class ExternalWeatherService implements WeatherService {
    @Override
    public String getForecast(String city) {
        System.out.printf("  🌐 [Remote call] Fetching weather for %s...%n", city);
        try { Thread.sleep(1000); } catch (InterruptedException ignored) {}
        return city + ": Sunny, 26°C";
    }
}

// Proxy — caching proxy
public class CachingWeatherProxy implements WeatherService {
    private final WeatherService realService;
    private final Map<String, CacheEntry> cache = new HashMap<>();
    private final long ttlMillis;

    public CachingWeatherProxy(WeatherService realService, long ttlMillis) {
        this.realService = realService;
        this.ttlMillis = ttlMillis;
    }

    @Override
    public String getForecast(String city) {
        CacheEntry entry = cache.get(city);
        if (entry != null && entry.expiry > System.currentTimeMillis()) {
            System.out.printf("  ⚡ [Cache hit] %s%n", city);
            return entry.result;
        }

        System.out.printf("  💨 [Cache miss] %s%n", city);
        String result = realService.getForecast(city);
        cache.put(city, new CacheEntry(result, System.currentTimeMillis() + ttlMillis));
        return result;
    }

    private record CacheEntry(String result, long expiry) {}
}
```

:::

Client usage:

::: code-group

```cs [C#]
IWeatherService service = new CachingWeatherProxy(
    new ExternalWeatherService(),
    ttl: TimeSpan.FromMinutes(10));

Console.WriteLine(service.GetForecast("New York"));   // cache miss -> remote call
Console.WriteLine(service.GetForecast("New York"));   // cache hit -> instant
Console.WriteLine(service.GetForecast("London"));     // cache miss
```

```java [Java]
WeatherService service = new CachingWeatherProxy(
    new ExternalWeatherService(),
    10 * 60 * 1000); // 10 min TTL

System.out.println(service.getForecast("New York"));  // cache miss
System.out.println(service.getForecast("New York"));  // cache hit
System.out.println(service.getForecast("London"));    // cache miss
```

:::

## 4. Pros & Cons

### Pros
1. **Separation of concerns**: Access control logic is decoupled from business logic; the real object stays focused.
2. **Transparency**: Clients use the same interface regardless of whether they're talking to a proxy or the real object.
3. **Extensible**: Easily layer caching, logging, permissions, and other cross-cutting concerns.

### Cons
1. **Added latency**: The proxy layer's extra logic may introduce overhead (especially reflection in dynamic proxies).
2. **Debugging complexity**: The extra indirection makes call stacks harder to trace.

## 5. Related Patterns

| Pattern | Similarity | Key Difference |
| :--- | :--- | :--- |
| **Decorator** | Both wrap a target with additional behavior | Decorator stacks multiple layers of responsibility; Proxy focuses on access control, typically one layer. |
| **Adapter** | Both wrap calls to another object | Adapter changes the interface; Proxy preserves the interface and adds control. |
| **Facade** | Both simplify client calls | Facade wraps a group of subsystems with a new interface; Proxy wraps a single object with the same interface. |

## 6. Summary

**Core Idea**

*   The Proxy pattern is about **controlling access** — placing a checkpoint between the client and the real object, giving you the opportunity to inject any pre/post logic without modifying the real object.

**Real-World Applications**

*   **Spring AOP**: Uses JDK dynamic proxies or CGLIB to inject transaction management, logging, and security checks before/after method execution.
*   **MyBatis Mapper**: `@Mapper` interfaces have no implementation classes — MyBatis generates them at runtime via dynamic proxy, mapping method calls to SQL execution.
*   **Nginx Reverse Proxy**: Client requests arrive at Nginx (proxy), which forwards them to backend servers while adding load balancing, SSL termination, and caching.
*   **ES Module Lazy Import**: `const mod = await import('./heavy.js')` is essentially a virtual proxy — the module loads only when needed.
