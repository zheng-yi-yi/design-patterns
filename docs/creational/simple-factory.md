# Simple Factory Pattern

## Disclaimer

The Simple Factory pattern is **not** one of the 23 GoF design patterns.

This is because the factory class in the Simple Factory pattern has relatively heavy responsibilities, and when new products are added, the factory class needs to be modified, which violates the Open/Closed Principle. However, due to its simplicity and ease of use, it is still widely used in practice.

## Real-World Example

In the Java JDK, the `java.util.Calendar` class uses the Simple Factory pattern. The `Calendar` class has a static method `getInstance()` that returns a calendar based on the current timezone and locale. Internally, this method creates an instance of `GregorianCalendar`, but the user does not need to know this detail — they only need to know that the method returns a `Calendar` instance.

## Definition

The Simple Factory pattern (sometimes called the **Static Factory Method**) is commonly used for object creation. When we need to create an object of a certain class but do not want to use the `new` operator directly, we can use the Simple Factory pattern.

> The Simple Factory pattern **encapsulates the product creation process in a factory class**, centralizing the object creation flow in one place.

Before introducing the factory class, clients typically used the `new` keyword to create product objects directly. With the factory class, clients can obtain product objects by calling the factory's static method. The key point is: when you need something, just pass in the correct parameter to get the object you need, without knowing its creation details.

## Roles

In the Simple Factory pattern, there are two main roles:

1. **Factory**: Responsible for creating products. It decides which product class to instantiate based on the input parameter.
2. **Product**: The interface of the objects created by the factory.

## Example Code

```java
// Product interface
interface Product {
    void use();
}

// Concrete Product A
class ConcreteProductA implements Product {
    public void use() {
        System.out.println("Using product A");
    }
}

// Concrete Product B
class ConcreteProductB implements Product {
    public void use() {
        System.out.println("Using product B");
    }
}

// Factory class
class SimpleFactory {
    public static Product createProduct(String type) {
        if ("A".equals(type)) {
            return new ConcreteProductA();
        } else if ("B".equals(type)) {
            return new ConcreteProductB();
        }
        return null;
    }
}

public class Main {
    public static void main(String[] args) {
        Product productA = SimpleFactory.createProduct("A");
        if (productA != null) {
            productA.use();
        }

        Product productB = SimpleFactory.createProduct("B");
        if (productB != null) {
            productB.use();
        }
    }
}
```

## Summary

The Simple Factory pattern is a straightforward creational pattern that decides which product class to instantiate based on the input parameter. The client does not need to know the concrete product class — only the product interface or abstract class.

However, the downside is that when there are too many product types, the factory class becomes overloaded and hard to extend, violating the Open/Closed Principle. Adding a new product requires modifying the factory class logic (the static method), which can make the factory logic overly complex and difficult to maintain.
