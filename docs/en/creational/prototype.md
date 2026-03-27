---
title: Prototype Pattern
description: Specify the kinds of objects to create using a prototypical instance, and create new objects by copying this prototype.
---

# Prototype Design Pattern

::: tip Definition
**Prototype Pattern**: Specify the kinds of objects to create using a prototypical instance, and create new objects by **copying (cloning)** this prototype. When object creation is costly, cloning is more efficient than constructing from scratch.
:::

## 1. Pattern Intent

**What problem does it solve?**
*   When object initialization requires expensive resources (database queries, file parsing, network requests), every `new` repeats the costly initialization. The Prototype pattern clones an existing object to avoid repeated initialization.
*   When many structurally similar objects are needed with only minor differences, cloning a "baseline object" and tweaking it is more efficient than building from scratch.

**Application scenarios**
*   ✅ Mass enemy spawning in games: clone from a prototype instead of initializing from database each time.
*   ✅ Configuration management: clone a baseline server config and tweak port, tags, etc.
*   ✅ Document templates: clone a new document from a template without rebuilding all styles and formatting.
*   ❌ When object creation is cheap and the structure is simple, using `new` directly is clearer — no need for cloning.

## 2. Pattern Structure

### UML Class Diagram

![Prototype Pattern](../images/image-20240605211858384.png)

### Roles & Responsibilities
| Role | Name | Responsibility |
| :--- | :--- | :--- |
| **Prototype** | Abstract Prototype | Declares the `clone()` method interface. |
| **ConcretePrototype** | Concrete Prototype | Implements the `clone()` method, returning a copy of itself. |
| **Client** | Client | Creates new objects by calling the prototype's `clone()` method. |

### Collaboration Flow
1. The client holds a reference to a prototype object.
2. When a new object is needed, the client calls the prototype's `clone()` method.
3. The prototype returns a copy of itself (shallow or deep copy).
4. The client customizes the clone as needed.

### Shallow Copy vs Deep Copy

| Feature | Shallow Copy | Deep Copy |
| :--- | :--- | :--- |
| **Value Types** | Copied by value | Copied by value |
| **Reference Types** | Only the reference (memory address) is copied | A new object is created and its contents are copied |
| **Independence** | Shared child objects | Completely independent |

::: warning
If an object contains mutable reference-type members, you must use **deep copy**. Otherwise, the original and the clone share internal state, leading to unexpected data corruption.
:::

## 3. Code Implementation

> **Scenario**: Server configuration cloning — clone a baseline config then fine-tune.

::: code-group
```csharp [C#]
using System;
using System.Collections.Generic;

public class ServerConfig : ICloneable
{
    public string OS { get; set; }
    public int Port { get; set; }
    public List<string> Tags { get; set; } = new();

    public object Clone()
    {
        // Shallow Copy
        var clone = (ServerConfig)this.MemberwiseClone(); // [!code highlight]
        
        // Deep Copy for the List
        clone.Tags = new List<string>(this.Tags); // [!code highlight]
        
        return clone;
    }

    public override string ToString() => $"OS={OS}, Port={Port}, Tags=[{string.Join(", ", Tags)}]";
}
```

```java [Java]
import java.util.ArrayList;
import java.util.List;

public class ServerConfig implements Cloneable {
    private String os;
    private int port;
    private List<String> tags = new ArrayList<>();

    public void setOs(String os) { this.os = os; }
    public void setPort(int port) { this.port = port; }
    public List<String> getTags() { return tags; }

    @Override
    public ServerConfig clone() {
        try {
            ServerConfig copy = (ServerConfig) super.clone(); // [!code highlight]
            // Manually handle deep copy for mutable members
            copy.tags = new ArrayList<>(this.tags); // [!code highlight]
            return copy;
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }
}
```
:::

Client usage:

::: code-group
```csharp [C#]
var baseConfig = new ServerConfig { OS = "Linux", Port = 80, Tags = { "web" } };

var instance1 = (ServerConfig)baseConfig.Clone();
instance1.Port = 8080;
instance1.Tags.Add("api");

Console.WriteLine(baseConfig);  // OS=Linux, Port=80, Tags=[web]
Console.WriteLine(instance1);   // OS=Linux, Port=8080, Tags=[web, api]
```

```java [Java]
ServerConfig baseConfig = new ServerConfig();
baseConfig.setOs("Linux");
baseConfig.setPort(80);
baseConfig.getTags().add("web");

ServerConfig instance1 = baseConfig.clone();
instance1.setPort(8080);
instance1.getTags().add("api");

// baseConfig's tags are unaffected (deep copy)
```
:::

## 4. Pros & Cons

### Pros
1. **Performance**: Cloning objects is far faster than re-initializing (database reads, file parsing, etc.).
2. **Simplified creation**: Hides the complexity of object initialization; clients simply call `clone()`.
3. **Dynamic object creation**: Different prototypes can be used at runtime to dynamically produce different objects.

### Cons
1. **Deep copy complexity**: When objects contain multiple layers of nested references, each layer must be manually deep-copied.
2. **May violate encapsulation**: Cloning requires access to an object's internal state, potentially exposing private details.

## 5. Related Pattern Comparison

| Pattern | Similarity | Key Difference |
| :--- | :--- | :--- |
| **Factory Method** | Both create objects | Factory Method **creates new objects from scratch** via factory classes; Prototype **clones existing objects**. |
| **Builder** | Both can create complex objects | Builder **constructs from scratch step by step**; Prototype **copies an existing object at once** then tweaks. |
| **Singleton** | Both involve instance management | Singleton ensures a **single unique instance**; Prototype is used for **mass-copying** instances. |

## 6. Summary

**Core Idea**

*   The essence of Prototype is **clone instead of create**: when `new` is too expensive, find an existing object, "photocopy" it, and make minor adjustments. It encapsulates the complexity of "how to initialize an object" inside the prototype, exposing only a `clone()` interface to the outside.

**Real-World Applications**

*   **Java**: `Object.clone()` is the language's built-in prototype support. In Spring, beans with `prototype` scope return new instances on each `getBean()` call, conceptually aligned with this pattern.
*   **.NET**: The `ICloneable` interface and `MemberwiseClone()` method are the standard building blocks for implementing the Prototype pattern.
*   **JavaScript**: `Object.create(proto)` creates new objects directly from an existing object as prototype — the prototype chain is a core language mechanism.
*   **Game Engines**: Unity's `Instantiate(prefab)` is essentially prototype cloning — a Prefab is the prototype, and each instantiation is a clone.
