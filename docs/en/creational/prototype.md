# Prototype Pattern

## Real-World Example

Java's `java.lang.Object` class defines a `clone()` method — a native method that provides object copying capability. However, it is `protected`, so a class must implement the `Cloneable` interface and override `clone()` to use it. Java collection classes like `ArrayList` and `HashSet` implement `Cloneable` and override `clone()`, allowing convenient collection copying.

## Definition

Some objects have complex creation processes (e.g., heavy computation or resource consumption) and need to be created frequently. The Prototype pattern creates new objects by copying an existing prototype object, avoiding the need to know creation details and reducing creation cost.

> **Prototype Pattern**: Specify the kinds of objects to create using a prototypical instance, and create new objects by **copying this prototype**. It allows an object to create another customizable object without knowing any creation details.

- Cloned objects do **not share memory** with the original — they are fully independent.
- Modifying a cloned object does not affect the original, but **shallow vs. deep copy** issues must be considered for reference-type fields.

## Roles

1. **Abstract Prototype (`Prototype`)**: An interface or abstract class that defines the `clone()` method.
2. **Concrete Prototype (`ConcretePrototype`)**: Implements or extends the abstract prototype, overriding the `clone()` method to create new instances.

## Example Code

```java
abstract class Prototype {
    protected String attribute;

    public Prototype(String attribute) {
        this.attribute = attribute;
    }

    public String getAttribute() {
        return attribute;
    }

    public abstract Prototype clone();
}

class ConcretePrototypeA extends Prototype {
    public ConcretePrototypeA(String attribute) {
        super(attribute);
    }

    @Override
    public Prototype clone() {
        return new ConcretePrototypeA(getAttribute());
    }
}

class ConcretePrototypeB extends Prototype {
    public ConcretePrototypeB(String attribute) {
        super(attribute);
    }

    @Override
    public Prototype clone() {
        return new ConcretePrototypeB(getAttribute());
    }
}

public class Client {
    public static void main(String[] args) {
        Prototype prototypeA = new ConcretePrototypeA("Prototype Object A");
        Prototype copyA = prototypeA.clone();
        System.out.println("Original: " + prototypeA.getAttribute());
        System.out.println("Clone: " + copyA.getAttribute());

        Prototype prototypeB = new ConcretePrototypeB("Prototype Object B");
        Prototype copyB = prototypeB.clone();
        System.out.println("Original: " + prototypeB.getAttribute());
        System.out.println("Clone: " + copyB.getAttribute());
    }
}
```

## Shallow Copy vs. Deep Copy

**Shallow Copy**: Creates a new object and copies all non-static fields. For value types, a bit-by-bit copy is performed. For reference types, only the reference is copied — not the referenced object. The original and clone share the same referenced objects.

**Deep Copy**: Creates a new object and recursively copies all fields, including referenced objects, until the entire object graph is duplicated. The original and clone are completely independent.

In Java, shallow copy can be implemented via `Cloneable` and `clone()`, while deep copy can be achieved through serialization (`Serializable`).

## Summary

The Prototype pattern is used for creating objects of the **same type but at different memory addresses** by **copying an existing instance**. It is suitable when:

1. Class initialization consumes significant resources (data, hardware, etc.).
2. The system needs many small, similar objects.
3. You want to avoid creating a factory class hierarchy parallel to the product hierarchy.
