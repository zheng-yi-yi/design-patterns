---
title: Abstract Factory Pattern
description: Provide an interface for creating families of related or dependent objects without specifying their concrete classes.
---

# Abstract Factory Design Pattern

::: tip Definition
**Abstract Factory Pattern**: Provide an interface for creating **families of related or dependent objects** without specifying their concrete classes. It ensures that objects within the same product family are always used together.
:::

## 1. Pattern Intent

**What problem does it solve?**
*   When a system needs to create multiple related products (a product family) and must guarantee compatibility between them. Factory Method can only create a single product, while Abstract Factory encapsulates the creation of an entire family of related products in one factory, structurally preventing cross-family mixing.
*   For example: in a game UI theme system, Fantasy-style buttons must pair with Fantasy-style health bars — they cannot be mixed with Sci-Fi components.

**Application scenarios**
*   ✅ Cross-platform UI toolkits: Windows/macOS/Linux each have a set of buttons, text fields, and dropdowns that must be used together.
*   ✅ Game theme systems: Fantasy/Sci-Fi UI elements must maintain visual consistency.
*   ✅ Database access layers: Connection, Command, and DataReader for different databases (MySQL/PostgreSQL/SQLite) must be from the same provider.
*   ❌ When there is only one product type (not a product family), use Factory Method instead — Abstract Factory adds unnecessary complexity.

## 2. Pattern Structure

### UML Class Diagram

![Abstract Factory Pattern](../images/image-20240605185157189.png)

### Roles & Responsibilities
| Role | Name | Responsibility |
| :--- | :--- | :--- |
| **AbstractFactory** | Abstract Factory | Declares methods for creating each product in the family; one method per abstract product type. |
| **ConcreteFactory** | Concrete Factory | Implements the abstract factory's creation methods, producing a complete set of products for one brand/theme. |
| **AbstractProduct** | Abstract Product | Defines the public interface for one category of products in the family. Multiple abstract products may exist. |
| **ConcreteProduct** | Concrete Product | Implements the abstract product interface; belongs to a specific brand/theme. |

### Collaboration Flow
1. The client selects a concrete factory (e.g., `HaierFactory`) and holds it via the abstract factory interface.
2. The client calls the factory's creation methods (`createTelevision()`, `createAirConditioner()`).
3. The factory returns matching products from the same brand; the client programs against abstract products.
4. Switching brands only requires replacing the factory instance — client code needs no changes.

## 3. Code Implementation

> **Scenario**: Home appliance brands — televisions and air conditioners from the same brand must be used together.

::: code-group
```cs [C#]
// Abstract Products
public interface ITelevision { void Play(); }
public interface IAirConditioner { void Adjust(); }

// Concrete Products (Brand A - Haier)
public class HaierTelevision : ITelevision 
{ 
    public void Play() => Console.WriteLine("Playing Haier TV"); 
}
public class HaierAirConditioner : IAirConditioner 
{ 
    public void Adjust() => Console.WriteLine("Adjusting Haier AC"); 
}

// Concrete Products (Brand B - Xiaomi)
public class XiaomiTelevision : ITelevision 
{ 
    public void Play() => Console.WriteLine("Playing Xiaomi TV"); 
}
public class XiaomiAirConditioner : IAirConditioner 
{ 
    public void Adjust() => Console.WriteLine("Adjusting Xiaomi AC"); 
}

// Abstract Factory
public interface IApplianceFactory
{
    ITelevision CreateTelevision();
    IAirConditioner CreateAirConditioner();
}

// Concrete Factory (Haier)
public class HaierFactory : IApplianceFactory
{
    public ITelevision CreateTelevision() => new HaierTelevision(); // [!code highlight]
    public IAirConditioner CreateAirConditioner() => new HaierAirConditioner(); // [!code highlight]
}

// Concrete Factory (Xiaomi)
public class XiaomiFactory : IApplianceFactory
{
    public ITelevision CreateTelevision() => new XiaomiTelevision(); // [!code highlight]
    public IAirConditioner CreateAirConditioner() => new XiaomiAirConditioner(); // [!code highlight]
}
```

```java [Java]
// Abstract Products
interface Television { void play(); }
interface AirConditioner { void adjust(); }

// Concrete Products (Haier)
class HaierTelevision implements Television {
    public void play() { System.out.println("Haier TV is playing..."); }
}
class HaierAirConditioner implements AirConditioner {
    public void adjust() { System.out.println("Haier AC is adjusting temperature..."); }
}

// Concrete Products (TCL)
class TCLTelevision implements Television {
    public void play() { System.out.println("TCL TV is playing..."); }
}
class TCLAirConditioner implements AirConditioner {
    public void adjust() { System.out.println("TCL AC is adjusting temperature..."); }
}

// Abstract Factory
interface ApplianceFactory {
    Television createTelevision();
    AirConditioner createAirConditioner();
}

// Concrete Factory (Haier)
class HaierFactory implements ApplianceFactory {
    @Override
    public Television createTelevision() { return new HaierTelevision(); } // [!code highlight]
    @Override
    public AirConditioner createAirConditioner() { return new HaierAirConditioner(); } // [!code highlight]
}

// Concrete Factory (TCL)
class TCLFactory implements ApplianceFactory {
    @Override
    public Television createTelevision() { return new TCLTelevision(); } // [!code highlight]
    @Override
    public AirConditioner createAirConditioner() { return new TCLAirConditioner(); } // [!code highlight]
}
```
:::

Client usage:

::: code-group
```cs [C#]
IApplianceFactory factory = new HaierFactory();
ITelevision tv = factory.CreateTelevision();
IAirConditioner ac = factory.CreateAirConditioner();
tv.Play();    // Output: Playing Haier TV
ac.Adjust();  // Output: Adjusting Haier AC
```

```java [Java]
ApplianceFactory factory = new HaierFactory();
Television tv = factory.createTelevision();
AirConditioner ac = factory.createAirConditioner();
tv.play();    // Output: Haier TV is playing...
ac.adjust();  // Output: Haier AC is adjusting temperature...
```
:::

## 4. Pros & Cons

### Pros
1. **Product family consistency**: The factory structurally guarantees that products from the same family are used together — cross-family mixing is impossible.
2. **Open/Closed Principle**: Adding a new product family only requires new concrete factory and product classes — no modification to existing code.
3. **Decouples client from concrete products**: The client depends only on abstract interfaces; switching families only requires swapping the factory instance.

### Cons
1. **Difficult to add new product types**: If the family needs a new product type (e.g., adding a washing machine), the abstract factory interface and all concrete factories must be modified — known as the "incline of OCP."
2. **Class proliferation**: Each product family requires a full set of factory and product classes, increasing system complexity.

## 5. Related Pattern Comparison

| Pattern | Similarity | Key Difference |
| :--- | :--- | :--- |
| **Factory Method** | Both create objects via factory interfaces | Factory Method creates a **single product**; Abstract Factory creates **product families** (multiple related products). |
| **Builder** | Both encapsulate complex object creation | Builder focuses on **step-by-step construction of one complex object**; Abstract Factory focuses on **batch creation of a set of related objects**. |
| **Prototype** | Both can create new objects | Prototype creates objects by **cloning** existing ones; Abstract Factory creates brand-new objects via **factory methods**. |

## 6. Summary

**Core Idea**

*   The essence of Abstract Factory is the **product family constraint**: it not only encapsulates "what to create," but also enforces "which things must be created together." By centralizing an entire family's creation in one factory, it eliminates cross-family mixing at compile time.

**Real-World Applications**

*   **Java AWT/Swing**: `java.awt.Toolkit` is a classic Abstract Factory — different platforms (Windows/macOS/Linux) return their own native buttons, text fields, etc., ensuring consistent UI widget styling per platform.
*   **ADO.NET**: `DbProviderFactory` (e.g., `SqlClientFactory`, `MySqlClientFactory`) provides matching Connection, Command, and DataAdapter for each database.
*   **Spring Framework**: Different implementations of the `BeanFactory` interface (`XmlBeanFactory`, `AnnotationConfigApplicationContext`) create different families of Beans based on configuration style.
