# Adapter Pattern

## Real-World Example

`Arrays.asList()` in Java accepts an array and returns a fixed-size `List`. This `List` is a view that still references the original array internally, allowing us to use the `List` interface to operate on arrays — an adapter from array to `List`.

## Definition

The Adapter pattern is a structural design pattern that converts one interface into another that clients expect. It acts as a bridge between two incompatible interfaces.

> **Adapter Pattern**: Convert the interface of a class into another interface clients expect. The Adapter pattern lets classes work together that couldn't otherwise because of incompatible interfaces. Also known as the **Wrapper** pattern.

## Roles

1. **Target**: The interface expected by the client (e.g., DC 20V).
2. **Adaptee**: The class/interface to be adapted (e.g., 220V AC).
3. **Adapter**: The core of the pattern — holds an Adaptee instance and implements the Target interface, translating Target calls into Adaptee calls.

## Example Code

### Class Adapter

```java
// Adaptee (existing class to be adapted)
class Adaptee {
    public void specificRequest() {
        System.out.println("Specific request...");
    }
}

// Target interface (expected by client)
interface Target {
    void request();
}

// Adapter (extends Adaptee, implements Target)
class Adapter extends Adaptee implements Target {
    @Override
    public void request() {
        super.specificRequest();
    }
}
```

Client:

```java
public class Client {
    public static void main(String[] args) {
        Target adapter = new Adapter();
        adapter.request();
    }
}
```

### Object Adapter

```java
// Adaptee
class Adaptee {
    public void specificRequest() {
        System.out.println("Specific request...");
    }
}

// Target interface
interface Target {
    void request();
}

// Adapter (holds Adaptee, implements Target)
class Adapter implements Target {
    private Adaptee adaptee;

    public Adapter(Adaptee adaptee) {
        this.adaptee = adaptee;
    }

    @Override
    public void request() {
        adaptee.specificRequest();
    }
}
```

Client:

```java
public class Client {
    public static void main(String[] args) {
        Target adapter = new Adapter(new Adaptee());
        adapter.request();
    }
}
```

## Summary

The Adapter pattern has two common implementations in Java:

- **Class Adapter**: The adapter extends the adaptee and implements the target interface.
- **Object Adapter**: The adapter holds an adaptee instance and implements the target interface.

Both approaches help reuse existing classes and extend functionality without modifying original code, focusing on solving interface incompatibility problems.
