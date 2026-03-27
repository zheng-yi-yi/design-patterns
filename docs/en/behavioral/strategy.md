# Strategy Pattern

## Real-World Example

In Java, `java.util.Comparator` is a typical Strategy pattern application. The `Comparator` interface defines a comparison strategy, which can be passed to methods like `Arrays.sort()` or `Collections.sort()` to specify the sorting behavior.

## Definition

A task can often be accomplished in multiple ways, each called a strategy. We can choose different strategies based on conditions or context.

> **Strategy Pattern**: Define a family of algorithms, encapsulate each one, and make them **interchangeable**. Strategy lets the algorithm vary independently from clients that use it.

For example, an e-commerce site may have different discount strategies — new user discounts, member-level discounts, etc. Hardcoding these leads to large if-else blocks and violates the Open/Closed Principle. The Strategy pattern encapsulates each algorithm in its own class, allowing strategies to be swapped at runtime.

## Roles

1. **Context**: Holds a reference to a Strategy and delegates work to it.
2. **Strategy (Abstract)**: An interface defining the algorithm's contract.
3. **Concrete Strategy**: Implements the Strategy interface with a specific algorithm.

## Example Code

```java
// Abstract Strategy
interface Strategy {
    void execute();
}

// Concrete Strategies
class ConcreteStrategyA implements Strategy {
    @Override
    public void execute() {
        System.out.println("Strategy A executed");
    }
}

class ConcreteStrategyB implements Strategy {
    @Override
    public void execute() {
        System.out.println("Strategy B executed");
    }
}

class ConcreteStrategyC implements Strategy {
    @Override
    public void execute() {
        System.out.println("Strategy C executed");
    }
}

// Context
class Context {
    private Strategy strategy;

    public Context(Strategy strategy) {
        this.strategy = strategy;
    }

    public void setStrategy(Strategy strategy) {
        this.strategy = strategy;
    }

    public void executeStrategy() {
        strategy.execute();
    }
}

public class Client {
    public static void main(String[] args) {
        Strategy strategyA = new ConcreteStrategyA();
        Strategy strategyB = new ConcreteStrategyB();
        Strategy strategyC = new ConcreteStrategyC();

        Context context = new Context(strategyA);
        context.executeStrategy();

        context.setStrategy(strategyB);
        context.executeStrategy();

        context.setStrategy(strategyC);
        context.executeStrategy();
    }
}
```

## Summary

The Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable. Clients create concrete strategy objects and pass them to the context, which uses the strategy through its interface. This allows strategies to be changed at runtime without modifying client code.
