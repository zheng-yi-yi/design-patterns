# Command Pattern

## Real-World Example

Java's thread pool `Executor` framework uses the Command pattern. The `Runnable` interface is the command interface — we create concrete command objects by implementing `Runnable`. The `Executor` (thread pool) is the invoker, executing commands by calling `run()`.

## Definition

> **Command Pattern**: Encapsulate a request as an object, thereby letting you **parameterize clients** with different requests, **queue or log requests**, and support **undoable operations**.

The Command pattern decouples the object that invokes the operation from the one that knows how to perform it.

## Roles

1. **Command**: An interface declaring the `execute()` method.
2. **Concrete Command**: Implements the Command interface, holds a reference to the Receiver, and delegates the actual work to it.
3. **Invoker**: Holds a Command and triggers execution. Does not need to know implementation details.
4. **Receiver**: Performs the actual business logic associated with the request.

## Example Code

```java
interface Command {
    void execute();
}

class ConcreteCommand implements Command {
    private Receiver receiver;

    ConcreteCommand(Receiver receiver) {
        this.receiver = receiver;
    }

    @Override
    public void execute() {
        receiver.action();
    }
}

class Invoker {
    private Command command;

    Invoker(Command command) {
        this.command = command;
    }

    void call() {
        command.execute();
    }
}

class Receiver {
    void action() {
        System.out.println("Executing request!");
    }
}

public class Client {
    public static void main(String[] args) {
        Receiver receiver = new Receiver();
        Command command = new ConcreteCommand(receiver);
        Invoker invoker = new Invoker(command);
        invoker.call();
    }
}
```

## Summary

The Command pattern wraps requests or operations into objects, decoupling senders from receivers. The sender has no direct reference to the receiver — it invokes the receiver indirectly through the command object. This provides high flexibility and makes it easy to implement new commands without changing existing code.
