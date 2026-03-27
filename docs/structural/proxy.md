# Proxy Pattern

## Real-World Example

Spring's AOP (Aspect-Oriented Programming) is a Proxy pattern application. In Spring AOP, aspects can be seen as proxies that add extra behavior (logging, transaction management, etc.) before and after target object method calls. These aspects are typically implemented via dynamic proxies.

## Definition

> **Proxy Pattern**: Provide a surrogate or placeholder for another object to **control access** to it.

The Proxy pattern wraps an existing interface and returns the same interface type to the caller, enhancing functionality without changing client code.

Common use cases:
- **Remote Proxy**: Represent an object in a different address space.
- **Virtual Proxy**: Create expensive objects on demand.
- **Protection Proxy**: Control access to the original object.
- **Smart Reference**: Perform additional actions when accessing an object.

## Roles

1. **Subject (Target Interface)**: The interface expected by the client.
2. **RealSubject**: The actual object that performs the real work.
3. **Proxy**: Implements the Subject interface, holds a reference to the RealSubject, and controls access to it.

## Example Code

### Static Proxy

```java
interface Target {
    void request();
}

class RealObject implements Target {
    @Override
    public void request() {
        System.out.println("RealObject is handling the request.");
    }
}

class ProxyObject implements Target {
    private RealObject realObject;

    public ProxyObject() {
        this.realObject = new RealObject();
    }

    @Override
    public void request() {
        System.out.println("ProxyObject is preparing for the request.");
        realObject.request();
        System.out.println("ProxyObject is finishing the request.");
    }
}

public class Client {
    public static void main(String[] args) {
        Target target = new ProxyObject();
        target.request();
    }
}
```

### Dynamic Proxy (JDK)

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

interface Target {
    void request();
}

class RealObject implements Target {
    @Override
    public void request() {
        System.out.println("RealObject is handling the request.");
    }
}

class DynamicProxyHandler implements InvocationHandler {
    private Object realObject;

    public DynamicProxyHandler(Object realObject) {
        this.realObject = realObject;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("DynamicProxyHandler is preparing for the request.");
        Object result = method.invoke(realObject, args);
        System.out.println("DynamicProxyHandler is finishing the request.");
        return result;
    }
}

public class Client {
    public static void main(String[] args) {
        RealObject realObject = new RealObject();
        Target proxy = (Target) Proxy.newProxyInstance(
            RealObject.class.getClassLoader(),
            RealObject.class.getInterfaces(),
            new DynamicProxyHandler(realObject)
        );
        proxy.request();
    }
}
```

> **Note**: JDK dynamic proxy requires the target class to implement an interface. For classes without interfaces, use **CGLib** (Code Generation Library), which creates proxies by subclassing the target class.

## Summary

- **Static Proxy**: Proxy class is created at compile time. Simple but leads to code duplication and class explosion when many proxies are needed.
- **Dynamic Proxy**: Proxy class is created at runtime. More flexible and scalable.

The Proxy pattern allows adding extra behavior without modifying the original object, but may slow down request processing, especially in network environments.
