---
title: Simple Factory
description: Learn how to encapsulate object creation logic using the Simple Factory pattern.
---

# Simple Factory Pattern

Simple Factory Pattern is not one of the 23 GoF design patterns, but it is widely used in practice as it serves as a foundation for other creational patterns. It encapsulates the creation logic of concrete products in a centralized factory class.

::: info Dimension and Breadth: Why do we need a Simple Factory?
From the perspective of design principles, the core value of the Simple Factory pattern lies in **Decoupling** and **Encapsulation**.

1.  **Hiding Instantiation Details**: Object creation may involve complex initialization configurations, dependency injections, or resource allocations. Through the factory, clients no longer care about these details, they just "ask as needed".
2.  **Separation of Concerns**: Separate the logic of "using an object" from the logic of "creating an object". The client is only responsible for the business logic, while the factory is responsible for lifecycle management.
3.  **Starting Point for Technical Evolution**: It is the simplified prototype of Factory Method and Abstract Factory. In the early stages of a system, over-design is often unnecessary, and the simple factory provides just the right amount of flexibility.
:::

## Structure Diagram

![Simple Factory Structure Diagram](../images/5968a8a58e4e0cda5b4acfe05bf71414.png)

## Core Roles

-   **Factory**: The core part, containing certain business logic and judgment logic, deciding which concrete product to create based on the information given by the outside world.
-   **Product**: The base class or interface for concrete products, defining the product specifications.
-   **ConcreteProduct**: The instance object being created.

## Examples

::: code-group
```cs [C#]
// Abstract Product
public interface ILogger
{
    void Log(string message);
}

// Concrete Product A
public class FileLogger : ILogger
{
    public void Log(string message) => Console.WriteLine($"[File] {message}");
}

// Concrete Product B
public class DatabaseLogger : ILogger
{
    public void Log(string message) => Console.WriteLine($"[DB] {message}");
}

// Simple Factory
public static class LoggerFactory
{
    public static ILogger CreateLogger(string type) => type.ToUpper() switch
    {
        "FILE" => new FileLogger(), // [!code highlight]
        "DB" => new DatabaseLogger(), // [!code highlight]
        _ => throw new ArgumentException("Invalid type")
    };
}
```

```java [Java]
// Abstract Product
interface Logger {
    void log(String message);
}

// Concrete Product A
class FileLogger implements Logger {
    public void log(String message) {
        System.out.println("Logging to file: " + message);
    }
}

// Concrete Product B
class DatabaseLogger implements Logger {
    public void log(String message) {
        System.out.println("Logging to database: " + message);
    }
}

// Simple Factory
class LoggerFactory {
    public static Logger createLogger(String type) {
        if ("FILE".equalsIgnoreCase(type)) { // [!code highlight]
            return new FileLogger(); // [!code highlight]
        } else if ("DB".equalsIgnoreCase(type)) { // [!code highlight]
            return new DatabaseLogger(); // [!code highlight]
        }
        throw new IllegalArgumentException("Unknown logger type");
    }
}
```
:::

## Application Examples

-   **JDK**: `java.util.Calendar.getInstance()` returns different calendar subclasses based on the timezone and locale.
-   **NET**: `System.Text.Encoding.GetEncoding("utf-8")` creates different encoding objects based on the encoding name.
-   **Web Frameworks**: Many routing engines are essentially simple factories, "manufacturing" different handlers (Controllers) based on URL paths (parameters).

## Limitations and Considerations

::: warning OCP Violation
Although the Simple Factory is convenient, it violates the **Open/Closed Principle**: for every new product added, the internal logic of the factory class must be modified.
:::

**When to use?**
-   When there are few product objects and the creation logic is relatively fixed.
-   When the client only cares about how to obtain the object, not how the object is born.
-   As the first choice for rapid prototype development or small and medium-sized projects.
