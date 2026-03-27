# Builder Pattern

## Real-World Example

In Java, `StringBuilder` uses the Builder pattern. It provides a mutable character sequence — you can add characters or strings step by step via `append()`, and finally get the built string via `toString()`.

In Java 8, the `Stream API` also applies the Builder pattern. Methods like `filter` and `map` build a processing pipeline step by step, each returning a new `Stream`. A terminal operation (like `collect` or `forEach`) produces the final result.

## Definition

The Builder pattern is used for **step-by-step construction of complex objects**. The construction algorithm is independent of the parts' creation and assembly.

> **Builder Pattern**: Separate the **construction** of a complex object from its **representation**, so that the same construction process can create different representations.

The Builder pattern separates construction (handled by `Builder`) from assembly (handled by `Director`), decoupling these responsibilities and allowing different builders and assembly methods to create different objects.

## Roles

1. **Product**: A complex object with multiple parts that can be assembled step by step.
2. **Abstract Builder (`Builder`)**: An interface defining methods for creating each part of the product.
3. **Concrete Builder (`ConcreteBuilder`)**: Implements the builder interface, responsible for constructing and assembling parts, and provides a method to retrieve the finished product.
4. **Director**: Controls the construction process by calling the builder's methods in a specific order.

## Example Code

### Classic Approach

```java
// Product
class Product {
    private String partA;
    private String partB;

    public void setPartA(String partA) { this.partA = partA; }
    public void setPartB(String partB) { this.partB = partB; }

    @Override
    public String toString() {
        return "Product{partA='" + partA + "', partB='" + partB + "'}";
    }
}

// Builder
interface Builder {
    void buildPartA();
    void buildPartB();
    Product getResult();
}

// ConcreteBuilder
class ConcreteBuilder implements Builder {
    private Product product = new Product();

    public void buildPartA() { product.setPartA("Part A built"); }
    public void buildPartB() { product.setPartB("Part B built"); }
    public Product getResult() { return product; }
}

// Director
class Director {
    private Builder builder;

    public Director(Builder builder) { this.builder = builder; }

    public Product construct() {
        builder.buildPartA();
        builder.buildPartB();
        return builder.getResult();
    }
}

public class Client {
    public static void main(String[] args) {
        Builder builder = new ConcreteBuilder();
        Director director = new Director(builder);
        Product product = director.construct();
        System.out.println(product);
    }
}
```

### Fluent API Approach

```java
// Product
class Product {
    private String partA;
    private String partB;

    public Product setPartA(String partA) { this.partA = partA; return this; }
    public Product setPartB(String partB) { this.partB = partB; return this; }

    @Override
    public String toString() {
        return "Product{partA='" + partA + "', partB='" + partB + "'}";
    }
}

// Builder
interface Builder {
    Builder buildPartA(String partA);
    Builder buildPartB(String partB);
    Product getResult();
}

// ConcreteBuilder
class ConcreteBuilder implements Builder {
    private Product product = new Product();

    public Builder buildPartA(String partA) { product.setPartA(partA); return this; }
    public Builder buildPartB(String partB) { product.setPartB(partB); return this; }
    public Product getResult() { return product; }
}

// Director
class Director {
    private Builder builder;

    public Director withBuilder(Builder builder) { this.builder = builder; return this; }
    public Product construct() { return builder.getResult(); }
}

public class Client {
    public static void main(String[] args) {
        Product product = new Director()
            .withBuilder(new ConcreteBuilder()
                .buildPartA("Part A built")
                .buildPartB("Part B built"))
            .construct();
        System.out.println(product);
    }
}
```

## Summary

The Builder pattern separates the construction of sub-components (by `Builder`) from their assembly (by `Director`), enabling the creation of complex objects through decoupled building and assembly processes. Different builders and assembly strategies can produce different products.
