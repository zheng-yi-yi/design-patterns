# Chain of Responsibility Pattern

## Real-World Example

The Java Servlet API's Filter mechanism is a great example. In servlet containers (like Tomcat), Filters form a processing chain where each Filter can preprocess and postprocess HTTP requests. Filters can be dynamically added or removed without modifying Servlet code.

## Definition

> **Chain of Responsibility Pattern**: Avoid coupling the sender of a request to its receiver by giving **more than one object a chance to handle the request**. Chain the receiving objects and **pass the request along the chain** until an object handles it.

The sender doesn't need to know the receiver's details — it just sends the request to the chain. Members can be added, removed, or reordered as needed.

## Roles

1. **Handler (Abstract)**: Defines the request-handling interface and holds a reference to the next handler in the chain.
2. **Concrete Handler**: Handles the request or passes it to the next handler. Can accept or reject handling, enabling dynamic chain organization.
3. **Client**: Creates the handler chain and sends requests to the first handler.

## Example Code

```java
interface Handler {
    void setNext(Handler handler);
    void handleRequest(String request);
}

class ConcreteHandler1 implements Handler {
    private Handler nextHandler;

    @Override
    public void setNext(Handler handler) {
        this.nextHandler = handler;
    }

    @Override
    public void handleRequest(String request) {
        if ("request1".equals(request)) {
            System.out.println("ConcreteHandler1 handled the request");
        } else if (nextHandler != null) {
            nextHandler.handleRequest(request);
        }
    }
}

class ConcreteHandler2 implements Handler {
    private Handler nextHandler;

    @Override
    public void setNext(Handler handler) {
        this.nextHandler = handler;
    }

    @Override
    public void handleRequest(String request) {
        if ("request2".equals(request)) {
            System.out.println("ConcreteHandler2 handled the request");
        } else if (nextHandler != null) {
            nextHandler.handleRequest(request);
        }
    }
}

public class Client {
    public static void main(String[] args) {
        Handler handler1 = new ConcreteHandler1();
        Handler handler2 = new ConcreteHandler2();

        handler1.setNext(handler2);

        handler1.handleRequest("request1");
        handler1.handleRequest("request2");
    }
}
```

## Summary

The Chain of Responsibility pattern decouples request senders from receivers. The sender sends the request to the first handler in the chain, and each handler decides whether to process it or pass it along. This provides high flexibility — handlers can be added, removed, or modified without changing existing code.
