---
title: Factory Method Pattern
description: Learn how the Factory Method pattern defers instantiation to subclasses for better extensibility.
---

# Factory Method Pattern

The Factory Method pattern introduces abstract factories and concrete factories. Each concrete factory is responsible for creating only one specific product (overriding the abstract method defined by the abstract factory). This way, adding new product classes only requires adding new factory classes, without modifying existing factory code. This supports extension and conforms to the Open/Closed Principle.

![Factory Method](../images/5968a8a58e4e0cda5b4acfe05bf71414.png)

::: info Definition
**Factory Method Pattern**: Define an interface for creating an object, but **let subclasses decide which class to instantiate**. The Factory Method pattern **defers instantiation to subclasses**.
:::

## Real-World Examples

### Logging Frameworks (Log4j / Serilog)
Modern logging frameworks often use the Factory Method pattern. For example, in **Serilog** for .NET or **Log4j** for Java, you might have a `LoggerConfiguration` that creates different types of `ILogger` implementations (File, Console, Database) based on the configuration. The application code only interacts with the `ILogger` interface, while the specific sink (concrete product) is instantiated by the framework's logic (concrete factory).

### Dependency Injection (DI) Containers
In modern web frameworks like **ASP.NET Core** or **Spring Boot**, the DI container acts as a sophisticated factory. When you register a service using `services.AddScoped<IMyService, MyService>()`, you are essentially defining a factory method. When the application requests an `IMyService`, the container (the factory) decides which concrete class to instantiate and manages its lifecycle.

## Roles

- **Abstract Factory (Creator)**: Defines the abstract factory method for creating product objects.
- **Abstract Product (Product)**: Describes the common behavior of products.
- **Concrete Factory (ConcreteCreator)**: Implements the abstract method to create specific products.
- **Concrete Product (ConcreteProduct)**: The actual product objects created by factories.

## Example Code

::: code-group
```cs [C#]
// Abstract Product
public interface ITelevision
{
    void Play();
}

// Concrete Products
public class HaierTelevision : ITelevision
{
    public void Play() => Console.WriteLine("Playing Haier Television");
}

public class XiaomiTelevision : ITelevision
{
    public void Play() => Console.WriteLine("Playing Xiaomi Television");
}

// Abstract Factory
public interface ITelevisionFactory
{
    ITelevision CreateTelevision();
}

// Concrete Factories
public class HaierTelevisionFactory : ITelevisionFactory
{
    public ITelevision CreateTelevision() => new HaierTelevision(); // [!code highlight]
}

public class XiaomiTelevisionFactory : ITelevisionFactory
{
    public ITelevision CreateTelevision() => new XiaomiTelevision(); // [!code highlight]
}
```

```java [Java]
// Abstract Product - Television
interface Television {
    void play();
}

// Concrete Product - Haier Television
class HaierTelevision implements Television {
    public void play() {
        System.out.println("Playing Haier Television");
    }
}

// Concrete Product - Xiaomi Television
class XiaomiTelevision implements Television {
    public void play() {
        System.out.println("Playing Xiaomi Television");
    }
}

// Abstract Factory - Television Factory
interface TelevisionFactory {
    Television createTelevision();
}

// Concrete Factory - Haier Television Factory
class HaierTelevisionFactory implements TelevisionFactory {
    @Override
    public Television createTelevision() {
        return new HaierTelevision(); // [!code highlight]
    }
}

// Concrete Factory - Xiaomi Television Factory
class XiaomiTelevisionFactory implements TelevisionFactory {
    @Override
    public Television createTelevision() {
        return new XiaomiTelevision(); // [!code highlight]
    }
}
```
:::

## Summary

::: tip Key Insight
"In the Factory Method pattern, the parent class determines how instances are generated, but does not determine the specific class to generate. The specific processing is entirely delegated to subclasses. This separates the framework for generating instances from the classes that actually generate instances."
:::

The Factory Method pattern encapsulates object creation in an abstract class (or interface), and lets subclasses decide which class to instantiate. The client only needs to call the factory method to get the product — "I want something, you give it to me."
