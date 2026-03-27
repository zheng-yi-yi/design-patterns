---
title: Singleton Pattern
description: Ensure a class has only one instance and provide a global access point to it.
---

# Singleton Design Pattern

::: tip Definition
**Singleton Pattern**: Ensure a class has **only one instance** and provide a **global access point** to that instance. It is primarily used to control shared resource access, avoiding duplicate creation and data inconsistency.
:::

## 1. Pattern Intent

**What problem does it solve?**
*   When multiple modules need to access the same shared resource (e.g., log file, database connection pool, application configuration) and that resource should only exist as a single instance. If each module creates its own, it leads to resource waste, handle conflicts, or data inconsistency.
*   When a global coordination point is needed to manage state or resources.

**Application scenarios**
*   ✅ Logging system: multiple modules share the same log file handle to avoid write conflicts.
*   ✅ Database connection pool: a globally unique pool prevents exceeding connection limits.
*   ✅ Application configuration: configuration is read once at startup and shared globally.
*   ❌ Stateless utility classes don't need Singleton — just use static methods.
*   ❌ When instantiation is cheap and there's no shared state, Singleton is over-engineering.

## 2. Pattern Structure

### UML Class Diagram

![Singleton Pattern](../images/4a98103b10a6c704d36c55f00006677b.png)

### Roles & Responsibilities
| Role | Name | Responsibility |
| :--- | :--- | :--- |
| **Singleton** | Singleton Class | Holds a private static variable for its unique instance; provides a public static method as the global access point; privatizes the constructor to prevent external `new`. |

### Collaboration Flow
1. The client requests the instance via `Singleton.getInstance()` (or property `Singleton.Instance`).
2. The singleton class checks whether the instance has been created:
   - If not created, it creates and caches the instance.
   - If already created, it returns the cached instance.
3. All callers receive the same object reference.

### Implementation Essentials
*   **Private constructor**: prevents external `new`.
*   **Private static member**: holds the unique instance.
*   **Public static method/property**: global access entry point.
*   **Thread safety**: in multi-threaded environments, instance uniqueness must be guaranteed.

## 3. Code Implementation

> **Scenario**: A global singleton demonstrating thread-safe lazy initialization.

::: code-group
```cs [C#]
// Thread-safe Singleton with Lazy initialization
public sealed class Singleton
{
    private static readonly Lazy<Singleton> _instance = 
        new Lazy<Singleton>(() => new Singleton());

    private Singleton() { }

    public static Singleton Instance => _instance.Value; // [!code highlight]

    public void DoWork() => Console.WriteLine("Singleton is working.");
}
```

```java [Java]
// Double-Checked Locking implementation
public class Singleton {
    private volatile static Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton(); // [!code highlight]
                }
            }
        }
        return instance;
    }
}
```
:::

Client usage:

::: code-group
```cs [C#]
Singleton.Instance.DoWork(); // Output: Singleton is working.

// Verify uniqueness
var a = Singleton.Instance;
var b = Singleton.Instance;
Console.WriteLine(ReferenceEquals(a, b)); // True
```

```java [Java]
Singleton.getInstance().doWork();

// Verify uniqueness
Singleton a = Singleton.getInstance();
Singleton b = Singleton.getInstance();
System.out.println(a == b); // true
```
:::

## 4. Pros & Cons

### Pros
1. **Resource sharing**: Ensures shared resources have only one instance, avoiding duplicate creation and data inconsistency.
2. **Global access**: Provides a unified access entry point for convenience.
3. **Lazy initialization**: The instance can be created only when first used, saving startup time.

### Cons
1. **Hidden dependencies**: The global access point makes dependencies implicit, increasing coupling and testing difficulty.
2. **Violates Single Responsibility**: The singleton class is responsible for both business logic and its own lifecycle management.
3. **Multi-threading risks**: Improper implementation can lead to thread safety issues.

## 5. Related Pattern Comparison

| Pattern | Similarity | Key Difference |
| :--- | :--- | :--- |
| **Factory Method** | Both involve object creation control | Factory Method focuses on **creating different types of objects**; Singleton focuses on **limiting instances to exactly one**. |
| **Prototype** | Both involve instance management | Prototype is for **mass-cloning** objects; Singleton is for **restricting to a unique** instance. |
| **Static Class** | Both provide global access | Static classes cannot implement interfaces, don't support lazy initialization or polymorphism; a Singleton is a regular object that can participate in DI and polymorphism. |

## 6. Summary

**Core Idea**

*   The essence of Singleton is **uniqueness guarantee**: it ensures that a critical resource in the system exists as exactly one instance, fundamentally preventing conflicts and waste from multiple instances. In modern development, however, hand-written singletons are increasingly replaced by DI containers.

**Real-World Applications**

*   **Spring**: The default Bean scope is `singleton`, with the IoC container managing the unique instance — no hand-written singleton code needed.
*   **.NET Core**: `services.AddSingleton<T>()` registers a service with singleton lifetime; the DI container guarantees uniqueness.
*   **Java Runtime**: `Runtime.getRuntime()` returns the JVM's unique `Runtime` instance.
*   **Database Connection Pools**: HikariCP, Druid, and similar pools typically exist as singletons, managed by the framework or DI container.
