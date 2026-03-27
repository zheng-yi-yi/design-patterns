# Decorator Pattern

## Real-World Example

Java's I/O library extensively uses the Decorator pattern. `BufferedReader`, `BufferedWriter`, and `PrintStream` are decorators that extend `Reader`, `Writer`, and `OutputStream` with buffering and printing capabilities.

In Java collections, `Collections.synchronizedList()` is a decorator that adds synchronization to an `ArrayList`.

## Definition

> **Decorator Pattern**: Dynamically attach additional responsibilities to an object **without modifying** the original object.

Typically, class functionality is extended through inheritance, but this leads to subclass proliferation. The Decorator pattern provides a way to add behavior dynamically without defining subclasses, by wrapping the original object in a decorator class. This follows the **Composition/Aggregation Reuse Principle** — prefer composition over inheritance.

## Roles

1. **Component**: Defines the interface for objects that can have responsibilities added dynamically.
2. **Concrete Component**: The original object being decorated.
3. **Decorator (Abstract)**: Holds a reference to a Component and delegates calls to it.
4. **Concrete Decorator**: Adds responsibilities to the component.

## Example Code

```java
// Component
interface Pizza {
    String make();
}

// Concrete Component
class PlainPizza implements Pizza {
    @Override
    public String make() {
        return "Plain Pizza";
    }
}

// Abstract Decorator
abstract class PizzaDecorator implements Pizza {
    protected Pizza pizza;

    public PizzaDecorator(Pizza pizza) {
        this.pizza = pizza;
    }

    public String make() {
        return pizza.make();
    }
}

// Concrete Decorators
class CheesePizzaDecorator extends PizzaDecorator {
    public CheesePizzaDecorator(Pizza pizza) {
        super(pizza);
    }

    public String make() {
        return pizza.make() + " + Cheese";
    }
}

class TomatoPizzaDecorator extends PizzaDecorator {
    public TomatoPizzaDecorator(Pizza pizza) {
        super(pizza);
    }

    public String make() {
        return pizza.make() + " + Tomato";
    }
}

// Client
public class Main {
    public static void main(String[] args) {
        Pizza pizza = new TomatoPizzaDecorator(
            new CheesePizzaDecorator(new PlainPizza()));
        System.out.println(pizza.make());
        // Output: Plain Pizza + Cheese + Tomato
    }
}
```

## Summary

The Decorator pattern uses association (composition/aggregation) to reuse existing object functionality through delegation. The abstract decorator aggregates the component, allowing layered method calls. The order of decoration determines the call sequence.

Key benefits:
- More flexible than inheritance — extend behavior at runtime.
- Decorators and decorated objects can vary independently.
- Conforms to the Open/Closed Principle — add new decorators without modifying existing code.

Key drawback:
- May increase system complexity with many concrete decorator classes.
