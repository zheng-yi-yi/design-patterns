# Flyweight Pattern

## Real-World Example

The `String` class uses the Flyweight pattern concept. When creating a `String`, the JVM first checks the string constant pool for an identical string — if found, it returns the pooled object; otherwise, a new string object is created.

Similarly, wrapper classes like `Integer` and `Long` cache values within a certain range. Calling `valueOf()` within the cache range returns a cached object directly.

## Definition

> **Flyweight Pattern**: Use sharing to support **large numbers of fine-grained objects** efficiently. The system uses only a small number of objects that are very similar, with minimal state changes and high reuse frequency.

The Flyweight Factory manages flyweight objects, typically using a collection to store created instances. When a flyweight is requested, the factory checks if it already exists — if so, it returns the existing one; otherwise, it creates a new one.

## Intrinsic State vs. Extrinsic State

1. **Intrinsic State**: The flyweight's inherent, immutable properties. Can be shared across contexts because they don't depend on specific scenarios.
2. **Extrinsic State**: Context-dependent information provided by the client, which changes with usage and cannot be shared.

Example — a game of Go:
- **Intrinsic state**: The stone's color (black or white) — fixed once created.
- **Extrinsic state**: The stone's position on the board — changes during the game.

## Roles

1. **Flyweight (Abstract)**: The superclass/interface for all concrete flyweights. Accepts and operates on extrinsic state.
2. **Concrete Flyweight**: Implements the Flyweight interface and stores intrinsic state. Must be shareable.
3. **Unshared Concrete Flyweight**: Not all Flyweight subclasses need to be shared. These are non-shared instances.
4. **Flyweight Factory**: Creates and manages flyweight objects (a flyweight pool). Provides existing instances or creates new ones on demand.

## Example Code

```java
import java.util.HashMap;
import java.util.Map;

// Flyweight interface
interface Flyweight {
    void operation(String externalState);
}

// Concrete Flyweight
class ConcreteFlyweight implements Flyweight {
    private final String intrinsicState;

    public ConcreteFlyweight(String intrinsicState) {
        this.intrinsicState = intrinsicState;
    }

    @Override
    public void operation(String externalState) {
        System.out.println("Intrinsic State = " + this.intrinsicState);
        System.out.println("External State = " + externalState);
    }
}

// Unshared Concrete Flyweight
class UnsharedConcreteFlyweight implements Flyweight {
    private final String allState;

    public UnsharedConcreteFlyweight(String allState) {
        this.allState = allState;
    }

    @Override
    public void operation(String externalState) {
        System.out.println("All State = " + this.allState);
        System.out.println("External State = " + externalState);
    }
}

// Flyweight Factory
class FlyweightFactory {
    private final Map<String, Flyweight> flyweights = new HashMap<>();

    public Flyweight getFlyweight(String key) {
        Flyweight flyweight = flyweights.get(key);
        if (flyweight == null) {
            flyweight = new ConcreteFlyweight(key);
            flyweights.put(key, flyweight);
        }
        return flyweight;
    }
}

public class Client {
    public static void main(String[] args) {
        FlyweightFactory factory = new FlyweightFactory();

        Flyweight flyweight1 = factory.getFlyweight("A");
        Flyweight flyweight2 = factory.getFlyweight("A");

        System.out.println(flyweight1 == flyweight2); // true

        flyweight1.operation("External State1");
        flyweight2.operation("External State2");

        Flyweight unshared = new UnsharedConcreteFlyweight("All State");
        unshared.operation("External State3");
    }
}
```

## Summary

The Flyweight pattern optimizes performance when dealing with large numbers of similar objects. By sharing the same intrinsic state, it significantly reduces memory usage. However, flyweight objects' state should not be changed arbitrarily, as modifications could affect all contexts sharing the same instance.
