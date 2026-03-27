---
title: Factory Method Pattern
description: Define an interface for creating objects, letting subclasses decide which class to instantiate, deferring instantiation to subclasses.
---

# Factory Method Design Pattern

::: tip Definition
**Factory Method Pattern**: Define an interface for creating an object, but **let subclasses decide which class to instantiate**. The Factory Method defers instantiation to subclasses, enabling new products to be added without modifying existing code.
:::

## 1. Pattern Intent

**What problem does it solve?**
*   Simple Factory puts all creation logic in one class — every new product requires modifying that class, violating the Open/Closed Principle. Factory Method provides a separate factory subclass for each product, distributing creation logic so that adding products only means adding factory classes.
*   When a parent class needs to control the creation workflow (validate → create → post-process), but **which specific object to create** is decided by subclasses.

**Application scenarios**
*   ✅ Cross-platform document export: The export workflow is identical, but PDF/Word/HTML serialization differs — subclass factories decide which exporter to create.
*   ✅ Game level enemy spawning: Spawning mechanics are shared, but different levels spawn different enemy types.
*   ✅ Logging frameworks: The core framework defines the logging pipeline; concrete output (file/database/message queue) is decided by factory subclasses.
*   ❌ When there are only one or two product types that rarely change, Simple Factory is sufficient — no need for Factory Method's extra hierarchy.

## 2. Pattern Structure

### UML Class Diagram

![Factory Method Pattern](../images/5968a8a58e4e0cda5b4acfe05bf71414.png)

### Roles & Responsibilities
| Role | Name | Responsibility |
| :--- | :--- | :--- |
| **Creator** | Abstract Factory | Declares the factory method (returns an abstract product); may contain template logic for the creation workflow. |
| **ConcreteCreator** | Concrete Factory | Implements the factory method, returning the corresponding concrete product instance. |
| **Product** | Abstract Product | Defines the public interface and behavior contract for products. |
| **ConcreteProduct** | Concrete Product | Implements the abstract product interface; the actual object created by factories. |

### Collaboration Flow
1. The client creates a concrete factory instance (e.g., `HaierTelevisionFactory`).
2. The client calls `createProduct()` through the abstract factory interface.
3. The concrete factory instantiates and returns the corresponding concrete product.
4. The client always programs against the abstract product — no dependency on any concrete class.

## 3. Code Implementation

> **Scenario**: Television production — different brands have independent factories.

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
// Abstract Product
interface Television {
    void play();
}

// Concrete Products
class HaierTelevision implements Television {
    public void play() {
        System.out.println("Playing Haier Television");
    }
}

class XiaomiTelevision implements Television {
    public void play() {
        System.out.println("Playing Xiaomi Television");
    }
}

// Abstract Factory
interface TelevisionFactory {
    Television createTelevision();
}

// Concrete Factories
class HaierTelevisionFactory implements TelevisionFactory {
    @Override
    public Television createTelevision() {
        return new HaierTelevision(); // [!code highlight]
    }
}

class XiaomiTelevisionFactory implements TelevisionFactory {
    @Override
    public Television createTelevision() {
        return new XiaomiTelevision(); // [!code highlight]
    }
}
```
:::

Client usage:

::: code-group
```cs [C#]
ITelevisionFactory factory = new HaierTelevisionFactory();
ITelevision tv = factory.CreateTelevision();
tv.Play(); // Output: Playing Haier Television
```

```java [Java]
TelevisionFactory factory = new HaierTelevisionFactory();
Television tv = factory.createTelevision();
tv.play(); // Output: Playing Haier Television
```
:::

## 4. Pros & Cons

### Pros
1. **Open/Closed Principle**: Adding products only requires adding new factory and product classes — no modification to existing code.
2. **Decouples client from concrete products**: The client programs against abstractions, independent of concrete class names.
3. **Single Responsibility**: Each factory is responsible for creating exactly one product type.

### Cons
1. **Class proliferation**: Every new product requires a new factory class, increasing system complexity.
2. **Additional abstraction layer**: Introduces an extra layer of abstraction that may be overkill for simple scenarios.

## 5. Related Pattern Comparison

| Pattern | Similarity | Key Difference |
| :--- | :--- | :--- |
| **Simple Factory** | Both encapsulate object creation | Simple Factory uses one class with centralized decision logic; Factory Method uses inheritance to distribute decisions across subclasses, conforming to OCP. |
| **Abstract Factory** | Both use factory interfaces | Factory Method creates a **single product**; Abstract Factory creates **product families** (a set of related products). |
| **Template Method** | Both defer part of the logic to subclasses | Template Method defers **algorithm steps**; Factory Method defers **object creation**. |

## 6. Summary

**Core Idea**

*   The essence of Factory Method is **deferred decision-making**: the parent class defines "what to do" (the creation workflow), while subclasses decide "what to create" (the concrete product). It is the upgraded version of Simple Factory, replacing `if/else` with inheritance and polymorphism to achieve true open-for-extension, closed-for-modification.

**Real-World Applications**

*   **Java Collection Framework**: `Collection.iterator()` is a classic Factory Method — `ArrayList` returns `ArrayList.Itr`, `HashSet` returns `HashMap.KeyIterator`, and callers only depend on the `Iterator` interface.
*   **SLF4J**: `ILoggerFactory.getLogger()` is implemented by different logging frameworks (Logback, Log4j2); application code only depends on the SLF4J interface.
*   **ASP.NET Core**: `IServiceProviderFactory<TContainerBuilder>` allows swapping DI container implementations (e.g., Autofac) — the framework itself is not bound to any specific container.
