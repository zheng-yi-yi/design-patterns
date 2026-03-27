---
title: Simple Factory Pattern
description: Encapsulate object creation logic in a centralized factory class that decides which concrete product to instantiate based on input parameters.
---

# Simple Factory Design Pattern

::: tip Definition
The Simple Factory pattern is not one of the 23 GoF patterns, but is widely used as a foundation for creational patterns. **It centralizes object creation logic in a single factory class** that decides which concrete product to instantiate based on a given parameter, eliminating scattered `new` operations across the codebase.
:::

## 1. Pattern Intent

**What problem does it solve?**
*   When a system has multiple product types to create and the client should not be concerned with specific instantiation logic, the Simple Factory consolidates this logic into one factory class, preventing creation code from scattering across the codebase.
*   For example: an e-commerce system supports multiple payment methods (Credit Card, PayPal, WeChat Pay). Without a factory, every caller writes its own `if/else` to select the right processor — adding a new payment method means modifying dozens of files.

**Application scenarios**
*   ✅ Payment channel selection: return different payment processors based on a string parameter.
*   ✅ Logging system: return file loggers, database loggers, etc. based on configuration.
*   ✅ Encoding/decoding: e.g., `Encoding.GetEncoding("utf-8")` returns the corresponding encoding object.
*   ❌ Not suitable when product types change frequently and are numerous — every new product requires modifying the factory class, violating the Open/Closed Principle.

## 2. Pattern Structure

### UML Class Diagram

![Simple Factory Structure](../images/5968a8a58e4e0cda5b4acfe05bf71414.png)

### Roles & Responsibilities
| Role | Name | Responsibility |
| :--- | :--- | :--- |
| **Factory** | Factory | Core role containing decision logic; determines which concrete product to create based on parameters. |
| **Product** | Abstract Product | Parent class or interface for concrete products; defines the product's public behavior contract. |
| **ConcreteProduct** | Concrete Product | Implements the abstract product interface; the actual object created and returned by the factory. |

### Collaboration Flow
1. The client calls the factory's static method, passing a type parameter.
2. The factory determines which concrete product to create based on the parameter.
3. The factory instantiates the corresponding concrete product and returns it to the client (as an abstract product type).

## 3. Code Implementation

> **Scenario**: A logging system that creates file loggers or database loggers based on a type parameter.

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

Client usage:

::: code-group
```cs [C#]
ILogger logger = LoggerFactory.CreateLogger("FILE");
logger.Log("System startup complete");
```

```java [Java]
Logger logger = LoggerFactory.createLogger("FILE");
logger.log("System startup complete");
```
:::

## 4. Pros & Cons

### Pros
1. **Centralized responsibility**: Object creation logic is concentrated in the factory class; clients don't need to know concrete product class names.
2. **Simple to use**: Clients only need to pass a parameter to get the desired product, lowering the usage barrier.

### Cons
1. **Violates Open/Closed Principle**: Every new product type requires modifying the factory's decision logic.
2. **Overloaded factory class**: As product types grow, the factory class becomes bloated and hard to maintain.

## 5. Related Pattern Comparison

| Pattern | Similarity | Key Difference |
| :--- | :--- | :--- |
| **Factory Method** | Both encapsulate object creation | Factory Method distributes creation logic across subclasses via inheritance, conforming to OCP; Simple Factory centralizes it in one class. |
| **Abstract Factory** | Both involve factory concepts | Abstract Factory creates **product families** (a set of related products); Simple Factory creates a single product. |
| **Strategy** | Both select different implementations based on parameters | Strategy focuses on interchangeable algorithms; Simple Factory focuses on object creation. |

## 6. Summary

**Core Idea**

*   The essence of Simple Factory is **centralization**: it collects scattered `new` operations into a single place, decoupling clients from concrete product classes. It is the most straightforward creational pattern, trading OCP compliance for simplicity.

**Real-World Applications**

*   **JDK**: `java.util.Calendar.getInstance()` returns different calendar subclasses based on timezone and locale.
*   **.NET**: `System.Text.Encoding.GetEncoding("utf-8")` returns the corresponding encoding implementation by name.
*   **Web Frameworks**: A routing engine is essentially a Simple Factory — it receives a request path `/users/123` and "manufactures" the corresponding `UserController`.
*   **Spring**: `BeanFactory.getBean("dataSource")` returns the corresponding Bean instance by name, sharing the same core idea as Simple Factory.
