# Factory Method Pattern

## Real-World Example

In JDBC, the `DriverManager.getConnection()` method is a factory method that returns a `java.sql.Connection` instance based on the URL, username, and password provided. The actual `Connection` instance is created by the database driver registered with `DriverManager`.

When `DriverManager.getConnection()` is called, it iterates through all registered database drivers, asking each whether it can handle the given URL. The first driver that can handle the URL is used to create the `Connection` instance.

## Definition

The Factory Method pattern introduces abstract factories and concrete factories. Each concrete factory is responsible for creating only one specific product (overriding the abstract method defined by the abstract factory). This way, adding new product classes only requires adding new factory classes, without modifying existing factory code. This supports extension and conforms to the Open/Closed Principle.

> **Factory Method Pattern**: Define an interface for creating an object, but **let subclasses decide which class to instantiate**. The Factory Method pattern **defers instantiation to subclasses**.

## Roles

- **Abstract Factory (Creator)**: Defines the abstract factory method for creating product objects.
- **Abstract Product (Product)**: Describes the common behavior of products.
- **Concrete Factory (ConcreteCreator)**: Implements the abstract method to create specific products.
- **Concrete Product (ConcreteProduct)**: The actual product objects created by factories.

## Example Code

```java
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
    public Television createTelevision() {
        return new HaierTelevision();
    }
}

// Concrete Factory - Xiaomi Television Factory
class XiaomiTelevisionFactory implements TelevisionFactory {
    public Television createTelevision() {
        return new XiaomiTelevision();
    }
}

// Client code
public class Client {
    public static void main(String[] args) {
        TelevisionFactory haierFactory = new HaierTelevisionFactory();
        Television haierTelevision = haierFactory.createTelevision();
        haierTelevision.play();

        TelevisionFactory xiaomiFactory = new XiaomiTelevisionFactory();
        Television xiaomiTelevision = xiaomiFactory.createTelevision();
        xiaomiTelevision.play();
    }
}
```

Output:

```
Playing Haier Television
Playing Xiaomi Television
```

## Summary

> "In the Factory Method pattern, the parent class determines how instances are generated, but does not determine the specific class to generate. The specific processing is entirely delegated to subclasses. This separates the framework for generating instances from the classes that actually generate instances."

The Factory Method pattern encapsulates object creation in an abstract class (or interface), and lets subclasses decide which class to instantiate. The client only needs to call the factory method to get the product — "I want something, you give it to me."
