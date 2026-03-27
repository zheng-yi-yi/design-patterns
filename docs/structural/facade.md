# Facade Pattern

## Real-World Example

Java's `Collections` class is a good example of the Facade pattern. It provides a series of static methods for manipulating or returning collections, hiding implementation details and offering a simple interface.

## Definition

The Facade pattern (also called the "Front Controller" pattern) hides subsystem complexity behind a single, unified interface. Clients interact only with the facade object, not with the many subsystem classes directly.

> **Facade Pattern**: Provide a unified interface to a set of interfaces in a subsystem. The Facade defines a **higher-level interface** that makes the subsystem easier to use.

In microservice architectures, a gateway is essentially a Facade — it provides a unified entry point for multiple backend services, and may also handle load balancing, caching, authentication, and rate limiting.

## Roles

- **Facade**: Provides a unified high-level interface, delegating client requests to subsystem objects.
- **Subsystem Classes**: Implement subsystem functionality and handle tasks assigned by the facade.

## Example Code

```java
// Subsystem A
class SubsystemA {
    public void operationA() {
        System.out.println("SubsystemA operation");
    }
}

// Subsystem B
class SubsystemB {
    public void operationB() {
        System.out.println("SubsystemB operation");
    }
}

// Subsystem C
class SubsystemC {
    public void operationC() {
        System.out.println("SubsystemC operation");
    }
}

// Facade
class Facade {
    private SubsystemA subsystemA;
    private SubsystemB subsystemB;
    private SubsystemC subsystemC;

    public Facade() {
        this.subsystemA = new SubsystemA();
        this.subsystemB = new SubsystemB();
        this.subsystemC = new SubsystemC();
    }

    public void facadeOperation() {
        subsystemA.operationA();
        subsystemB.operationB();
        subsystemC.operationC();
    }
}

// Client
public class Main {
    public static void main(String[] args) {
        Facade facade = new Facade();
        facade.facadeOperation();
    }
}
```

## Summary

The Facade pattern simplifies client interaction by providing a unified interface to a complex subsystem. Even if subsystem implementations change, the client code remains unchanged as long as the facade interface stays the same. The facade does not participate in subsystem business logic — it only provides an access interface, maintaining independence.

> Note: Adding new subsystems or modifying subsystem behavior may require modifying the facade class, which violates the Open/Closed Principle.
