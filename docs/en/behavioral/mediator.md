# Mediator Pattern

## Real-World Example

In the Spring framework, `ApplicationContext` acts as a mediator. It manages Bean lifecycles, handles dependencies between Beans, and provides services like event publishing and resource loading. Beans interact through `ApplicationContext` rather than directly with each other.

## Definition

> **Mediator Pattern**: Define an object that **encapsulates how a set of objects interact**. The Mediator promotes loose coupling by keeping objects from referring to each other explicitly, and lets you vary their interaction independently.

In complex systems, object interactions can be intricate and highly coupled. The Mediator pattern introduces a mediator object so that all objects interact through it, reducing system coupling.

## Roles

1. **Mediator**: Defines an interface for communicating with Colleague objects.
2. **Colleague**: Each colleague knows its mediator and communicates with other colleagues through it.

## Example Code

```java
import java.util.ArrayList;
import java.util.List;

interface Mediator {
    void register(Colleague colleague);
    void relay(Colleague colleague, String message);
}

class ConcreteMediator implements Mediator {
    private final List<Colleague> colleagues = new ArrayList<>();

    @Override
    public void register(Colleague colleague) {
        colleagues.add(colleague);
    }

    @Override
    public void relay(Colleague colleague, String message) {
        for (Colleague c : colleagues) {
            if (!c.equals(colleague)) {
                c.receive(message);
            }
        }
    }
}

abstract class Colleague {
    protected Mediator mediator;

    public Colleague(Mediator mediator) {
        this.mediator = mediator;
    }

    public abstract void send(String message);
    public abstract void receive(String message);
}

class ConcreteColleague1 extends Colleague {
    public ConcreteColleague1(Mediator mediator) {
        super(mediator);
    }

    @Override
    public void send(String message) {
        mediator.relay(this, message);
    }

    @Override
    public void receive(String message) {
        System.out.println("Colleague1 received: " + message);
    }
}

class ConcreteColleague2 extends Colleague {
    public ConcreteColleague2(Mediator mediator) {
        super(mediator);
    }

    @Override
    public void send(String message) {
        mediator.relay(this, message);
    }

    @Override
    public void receive(String message) {
        System.out.println("Colleague2 received: " + message);
    }
}

public class Main {
    public static void main(String[] args) {
        Mediator mediator = new ConcreteMediator();
        Colleague colleague1 = new ConcreteColleague1(mediator);
        Colleague colleague2 = new ConcreteColleague2(mediator);
        mediator.register(colleague1);
        mediator.register(colleague2);
        colleague1.send("Hello from Colleague1!");
        colleague2.send("Hi from Colleague2!");
    }
}
```

## Summary

The Mediator pattern reduces chaotic dependencies between objects by routing all interactions through a mediator. This:

- **Reduces coupling**: Objects interact through the mediator, not directly.
- **Centralizes control**: All interactions are managed in one place.
- **Simplifies interfaces**: Objects only need to know the mediator.
- **Improves flexibility**: Changing the mediator changes the interaction behavior.

Downsides: The mediator itself can become overly complex, and the system becomes dependent on it.
