# Singleton Pattern

## Real-World Example

In the Spring framework, Beans are singletons by default. When a Bean is defined in the Spring configuration, the container creates the instance at startup. Each subsequent call to `ApplicationContext.getBean()` returns the same instance.

## Definition

In development, there are special classes that must have only one instance in the system. Every use of the class must use the same instance. Such a class is called a singleton class, and the pattern is called the Singleton pattern.

> **Singleton Pattern**: Ensure a class has **only one instance**, and provide a **global access point** to that instance.

The Singleton pattern is mainly used for scenarios where only one instance is needed, such as configuration managers, thread pools, caches, and loggers. It controls the number of instances and conserves system resources.

## Roles

There is only one role in the Singleton pattern:

- **Singleton**: A class that contains a single instance and can create it itself.

Three key points:

- **Private constructor**: Prevents external code from using `new` to create instances.
- **Private static member variable**: Holds the class's unique instance.
- **Public static method**: Provides external access to the singleton instance.

## Example Code

### 1. Eager Initialization

```java
public class Singleton {
    private static Singleton instance = new Singleton();

    private Singleton() {}

    public static Singleton getInstance() {
        return instance;
    }
}
```

### 2. Lazy Initialization

```java
public class Singleton {
    private static Singleton instance;

    private Singleton() {}

    public static synchronized Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

### 3. Double-Checked Locking

```java
public class Singleton {
    private volatile static Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

### 4. Static Inner Class

```java
public class Singleton {
    private static class SingletonHolder {
        private static final Singleton INSTANCE = new Singleton();
    }

    private Singleton() {}

    public static Singleton getInstance() {
        return SingletonHolder.INSTANCE;
    }
}
```

## Summary

The Singleton pattern primarily solves resource sharing and access control problems. It ensures that a certain class has only one instance so all other objects access the same instance, keeping data synchronized and saving system resources.

Note that the Singleton pattern is not suitable for all scenarios. If the instantiated object uses few resources and does not need frequent access, the Singleton pattern offers little advantage and may lead to over-engineering.
