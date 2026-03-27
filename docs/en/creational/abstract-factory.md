# Abstract Factory Pattern

## Real-World Example

`java.sql.Connection` is an abstract factory. It returns different abstract products such as `Statement`, `PreparedStatement`, and `CallableStatement`. The concrete implementations are provided by database drivers. This allows the JDBC API to work with multiple database drivers without changing the API code.

## Definition

In the Factory Method pattern, each concrete factory creates only a **single** product. Sometimes, we need a factory that can provide multiple product objects rather than just one.

> **Abstract Factory Pattern**: Provide an interface for creating **families of related or dependent objects** without specifying their concrete classes.

The Abstract Factory pattern ensures that a series of related products are created together and can work with each other.

## Roles

1. **Abstract Product (`AbstractProduct`)**: A product family that declares the main characteristics and behaviors. Multiple abstract product interfaces can be defined.
2. **Concrete Product (`ConcreteProduct`)**: Implements the abstract product interface to produce specific products.
3. **Abstract Factory (`AbstractFactory`)**: An interface that declares methods for creating abstract products, one method per product.
4. **Concrete Factory (`ConcreteFactory`)**: Implements the abstract factory's creation methods to produce specific products.

## Example Code

```java
abstract class AbstractProductA {  // Abstract Product (TV)
    public abstract void methodA();  // Play
}

class ConcreteProductA1 extends AbstractProductA {  // Concrete Product (Haier TV)
    @Override
    public void methodA() {
        System.out.println("Haier TV is playing...");
    }
}

class ConcreteProductA2 extends AbstractProductA {  // Concrete Product (TCL TV)
    @Override
    public void methodA() {
        System.out.println("TCL TV is playing...");
    }
}

abstract class AbstractProductB {  // Abstract Product (Air Conditioner)
    public abstract void methodB();  // Adjust temperature
}

class ConcreteProductB1 extends AbstractProductB {  // Concrete Product (Haier AC)
    @Override
    public void methodB() {
        System.out.println("Haier AC is adjusting temperature...");
    }
}

class ConcreteProductB2 extends AbstractProductB {  // Concrete Product (TCL AC)
    @Override
    public void methodB() {
        System.out.println("TCL AC is adjusting temperature...");
    }
}

abstract class AbstractFactory {  // Abstract Factory
    public abstract AbstractProductA createProductA();
    public abstract AbstractProductB createProductB();
}

class ConcreteFactory1 extends AbstractFactory {  // Concrete Factory (Haier)
    @Override
    public AbstractProductA createProductA() {
        System.out.println("Haier factory produces Haier TV");
        return new ConcreteProductA1();
    }

    @Override
    public AbstractProductB createProductB() {
        System.out.println("Haier factory produces Haier AC");
        return new ConcreteProductB1();
    }
}

class ConcreteFactory2 extends AbstractFactory {  // Concrete Factory (TCL)
    @Override
    public AbstractProductA createProductA() {
        System.out.println("TCL factory produces TCL TV");
        return new ConcreteProductA2();
    }

    @Override
    public AbstractProductB createProductB() {
        System.out.println("TCL factory produces TCL AC");
        return new ConcreteProductB2();
    }
}

public class Client {
    public static void main(String args[]) {
        AbstractFactory haierFactory = new ConcreteFactory1();
        AbstractProductA haierTV = haierFactory.createProductA();
        AbstractProductB haierAC = haierFactory.createProductB();
        haierTV.methodA();
        haierAC.methodB();

        AbstractFactory tclFactory = new ConcreteFactory2();
        AbstractProductA tclTV = tclFactory.createProductA();
        AbstractProductB tclAC = tclFactory.createProductB();
        tclTV.methodA();
        tclAC.methodB();
    }
}
```

## Summary

The Abstract Factory pattern provides an interface for creating families of related or dependent objects without specifying concrete classes. It is suitable when:

1. **Product families and product hierarchies**: A system needs to provide multiple product series, each containing related products.
2. **Decoupling from concrete products**: The system should be independent of product creation, composition, and representation.
3. **Emphasizing related product interfaces**: When you want to enforce that a series of related products are used together.
4. **Providing a product library**: When you want to expose only interfaces, not implementations.
