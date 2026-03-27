# Observer Pattern

## Real-World Example

Event listeners in Java are a typical Observer pattern application. When a user clicks a button, an `ActionEvent` is generated and sent to all registered `ActionListener` objects — the subject notifies all its registered observers when its state changes.

## Definition

> **Observer Pattern**: Define a **one-to-many dependency** between objects so that when one object changes state, all its dependents are **notified and updated automatically**.

For example, in a news subscription system, users subscribe to topics of interest. When new news is published, the system automatically pushes it to all subscribers of that topic.

## Roles

1. **Observer (Abstract)**: Defines the update interface for receiving notifications.
2. **Subject**: Maintains a list of observers, supports adding/removing observers, and notifies all observers on state changes.
3. **Concrete Observer**: Implements the update interface to respond to state changes.
4. **Concrete Subject**: Contains actual business logic and notifies observers when state changes.

## Example Code

```java
import java.util.ArrayList;
import java.util.List;

abstract class Observer {
    public abstract void update();
}

abstract class Subject {
    private final List<Observer> observers = new ArrayList<>();

    public void attach(Observer observer) {
        observers.add(observer);
    }

    public void detach(Observer observer) {
        observers.remove(observer);
    }

    public void notifyToAll() {
        for (Observer observer : observers) {
            observer.update();
        }
    }
}

class ConcreteObserver extends Observer {
    private final String name;
    private final ConcreteSubject subject;

    public ConcreteObserver(String name, ConcreteSubject subject) {
        this.name = name;
        this.subject = subject;
    }

    @Override
    public void update() {
        String state = subject.getState();
        System.out.println(name + " received: " + state);
    }
}

class ConcreteSubject extends Subject {
    private String state;

    public String getState() { return state; }

    public void setState(String state) {
        this.state = state;
        notifyToAll();
    }
}

public class Client {
    public static void main(String[] args) {
        ConcreteSubject subject = new ConcreteSubject();
        Observer observer1 = new ConcreteObserver("Observer 1", subject);
        Observer observer2 = new ConcreteObserver("Observer 2", subject);
        Observer observer3 = new ConcreteObserver("Observer 3", subject);

        subject.attach(observer1);
        subject.attach(observer2);
        subject.attach(observer3);

        subject.setState("New state");
    }
}
```

## Summary

The Observer pattern establishes dependencies between objects so that when one object's state changes, all dependents are notified and updated automatically. It achieves loose coupling between interacting objects, making code more maintainable and extensible. Widely used in GUI development, real-time messaging systems, and multi-threaded applications.
