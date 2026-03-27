# Bridge Pattern

## Real-World Example

JDBC defines a set of interfaces, while each database vendor provides concrete implementations. Java programs connect to various databases through this unified interface without worrying about specific implementations — a typical Bridge pattern application.

Java's RMI (Remote Method Invocation) also uses the Bridge pattern: a remote object (abstraction) can have multiple communication protocols (implementation), such as TCP/IP or HTTP, and both can vary independently.

## Definition

> **Bridge Pattern**: Decouple an **abstraction** from its **implementation** so that the two can vary independently. This prevents "class explosion" in multi-dimensional variations and improves extensibility.

In the Bridge pattern, the abstraction and implementation are connected through composition rather than inheritance. Adding new features to the abstraction or new implementations does not affect the other part.

## Roles

1. **Abstraction**: Defines the abstract class and contains a reference to an Implementor object.
2. **Refined Abstraction**: A subclass of Abstraction that implements business methods using the Implementor.
3. **Implementor**: Defines the interface for implementation classes, providing basic operation methods.
4. **Concrete Implementor**: Concrete implementations of the Implementor interface.

## Example Code

```java
// Implementor
interface Color {
    void applyColor();
}

// Concrete Implementors
class RedColor implements Color {
    public void applyColor() {
        System.out.println("red.");
    }
}

class BlueColor implements Color {
    public void applyColor() {
        System.out.println("blue.");
    }
}

// Abstraction
abstract class Shape {
    protected Color color;

    public Shape(Color color) {
        this.color = color;
    }

    abstract public void applyColor();
}

// Refined Abstractions
class Triangle extends Shape {
    public Triangle(Color color) {
        super(color);
    }

    public void applyColor() {
        System.out.print("Triangle filled with color ");
        color.applyColor();
    }
}

class Circle extends Shape {
    public Circle(Color color) {
        super(color);
    }

    public void applyColor() {
        System.out.print("Circle filled with color ");
        color.applyColor();
    }
}

public class Client {
    public static void main(String[] args) {
        Shape tri = new Triangle(new RedColor());
        tri.applyColor();

        Shape cir = new Circle(new BlueColor());
        cir.applyColor();
    }
}
```

## Summary

> "The Bridge pattern is complex to implement and rarely used directly, but its design philosophy is worth learning: avoid over-using inheritance — prefer composition to extend functionality."

The Bridge pattern focuses on using **composition over inheritance**. When a class has multiple dimensions of variation, using inheritance for each dimension leads to a combinatorial explosion of subclasses. The Bridge pattern lets each dimension vary independently, reducing coupling. `RefinedAbstraction` and `ConcreteImplementor` are loosely coupled — connected only through the aggregation relationship between `Abstraction` and `Implementor`.
