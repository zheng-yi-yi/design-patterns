# Memento Pattern

## Real-World Example

Java's serialization mechanism reflects the Memento pattern. It allows saving an object's state (its fields) to a byte stream, which can later be used to restore the object — the byte stream acts as a memento.

## Definition

> **Memento Pattern**: Without violating encapsulation, **capture and externalize an object's internal state** so that the object can be **restored to this state later**.

The Memento pattern is commonly used to implement "undo" or "restore" operations.

## Roles

1. **Originator**: The object whose state needs to be saved. Defines methods to create and restore mementos.
2. **Memento**: Stores the Originator's state. Only accessible by the Originator.
3. **Caretaker**: Responsible for storing mementos. Cannot modify or inspect memento contents.

## Example Code

```java
import java.util.ArrayList;
import java.util.List;

class Memento {
    private final String state;

    public Memento(String state) {
        this.state = state;
    }

    public String getState() {
        return state;
    }
}

class Originator {
    private String state;

    public void setState(String state) { this.state = state; }
    public String getState() { return state; }

    public Memento saveStateToMemento() {
        return new Memento(state);
    }

    public void getStateFromMemento(Memento memento) {
        state = memento.getState();
    }
}

class CareTaker {
    private final List<Memento> mementoList = new ArrayList<>();

    public void add(Memento state) {
        mementoList.add(state);
    }

    public Memento get(int index) {
        return mementoList.get(index);
    }
}

public class Client {
    public static void main(String[] args) {
        Originator originator = new Originator();
        CareTaker careTaker = new CareTaker();

        originator.setState("State #1");
        originator.setState("State #2");
        careTaker.add(originator.saveStateToMemento());

        originator.setState("State #3");
        careTaker.add(originator.saveStateToMemento());

        originator.setState("State #4");
        System.out.println("Current State: " + originator.getState());

        originator.getStateFromMemento(careTaker.get(0));
        System.out.println("First saved State: " + originator.getState());

        originator.getStateFromMemento(careTaker.get(1));
        System.out.println("Second saved State: " + originator.getState());
    }
}
```

Output:

```
Current State: State #4
First saved State: State #2
Second saved State: State #3
```

## Summary

The Memento pattern provides a mechanism to save and restore object state without exposing internal structure. It can be used for "undo/restore" operations and for implementing transactions (a series of operations that either all succeed or all fail).
