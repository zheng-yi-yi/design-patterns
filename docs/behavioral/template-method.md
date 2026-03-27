# Template Method Pattern

## Real-World Example

In Servlet technology, we typically extend `HttpServlet` and override `doGet()` or `doPost()` to handle HTTP requests. Here, `HttpServlet` is the template, and `doGet()`/`doPost()` are the specific steps for subclasses to implement.

## Definition

> **Template Method Pattern**: Define the **skeleton of an algorithm** in an operation, **deferring some steps to subclasses**. Template Method lets subclasses redefine certain steps of an algorithm without changing the algorithm's structure.

The main advantage is encapsulating the invariant parts while allowing extension of the variable parts. It provides excellent code reuse and can use hook methods to control subclass extensions.

## Roles

1. **Abstract Class**: Defines the algorithm framework and declares abstract methods for subclasses to implement.
2. **Concrete Class**: Implements the abstract methods, providing specific algorithm steps.

## Example Code

```java
abstract class AbstractClass {
    // Template method — controls the algorithm flow
    public final void templateMethod() {
        primitiveOperation1();
        primitiveOperation2();
    }

    protected abstract void primitiveOperation1();
    protected abstract void primitiveOperation2();
}

class ConcreteClass extends AbstractClass {
    @Override
    protected void primitiveOperation1() {
        System.out.println("ConcreteClass operation 1");
    }

    @Override
    protected void primitiveOperation2() {
        System.out.println("ConcreteClass operation 2");
    }
}

public class Main {
    public static void main(String[] args) {
        AbstractClass instance = new ConcreteClass();
        instance.templateMethod();
    }
}
```

## Summary

The Template Method pattern defines an algorithm skeleton in a base class method, allowing subclasses to override specific steps without changing the overall structure. The template method is typically declared `final` to prevent subclasses from altering the algorithm flow. The abstract operations can be either abstract or have default implementations.
