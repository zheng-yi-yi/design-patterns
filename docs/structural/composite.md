# Composite Pattern

## Real-World Example

In Java, the `File` class can represent either a file or a directory. For directories, `listFiles()` returns all contained files and subdirectories as `File` objects. This hierarchical design is a typical Composite pattern.

## Definition

Tree structures are ubiquitous in software: OS file systems, application menus, organizational hierarchies, etc. The Composite pattern organizes objects into tree structures to represent part-whole relationships.

> **Composite Pattern**: Compose objects into **tree structures** to represent part-whole hierarchies. The Composite pattern lets clients treat individual objects and compositions of objects **uniformly**.

## Roles

1. **Component**: The common interface for all objects in the composition, defining shared behavior.
2. **Leaf**: Represents leaf nodes with no children. Implements the Component interface.
3. **Composite**: Represents branch nodes that contain children. Stores child components and implements child-related operations.

## Transparent Composite

In the transparent approach, the Component declares all management methods (`add()`, `remove()`, etc.). Leaf nodes either throw exceptions or provide empty implementations for these methods.

```java
import java.util.ArrayList;
import java.util.List;

abstract class Component {
    protected String name;

    public Component(String name) {
        this.name = name;
    }

    protected abstract void operation();

    protected void add(Component c) {
        throw new UnsupportedOperationException("Unsupported Operation");
    }
}

class Leaf extends Component {
    public Leaf(String name) {
        super(name);
    }

    @Override
    protected void operation() {
        System.out.println("Leaf: " + name);
    }
}

class Composite extends Component {
    protected List<Component> components;

    public Composite(String name) {
        super(name);
        components = new ArrayList<>();
    }

    @Override
    public void add(Component c) {
        components.add(c);
    }

    @Override
    protected void operation() {
        System.out.println("Composite: " + name);
        for (Component c : components) {
            c.operation();
        }
    }
}
```

## Safe Composite

In the safe approach, management methods are only declared in the `Composite` class, not in `Component`. This prevents leaf nodes from having inappropriate methods.

```java
import java.util.ArrayList;
import java.util.List;

interface Component {
    void operation();
}

class Leaf implements Component {
    private String name;

    public Leaf(String name) {
        this.name = name;
    }

    @Override
    public void operation() {
        System.out.println("Leaf: " + name);
    }
}

class Composite implements Component {
    private String name;
    private List<Component> components;

    public Composite(String name) {
        this.name = name;
        components = new ArrayList<>();
    }

    public void add(Component component) {
        components.add(component);
    }

    public void remove(Component component) {
        components.remove(component);
    }

    @Override
    public void operation() {
        System.out.println("Composite: " + name);
        for (Component component : components) {
            component.operation();
        }
    }
}
```

## Summary

Key points:

- **Unified interface**: Both leaf and composite nodes implement the same Component interface, allowing clients to treat them uniformly.
- **Recursive composition**: Composite nodes contain child collections, enabling recursive traversal of the entire structure.
- **Transparent vs. Safe**:
  - **Transparent**: Management methods in Component — simpler client code, but leaf nodes need dummy implementations.
  - **Safe**: Management methods only in Composite — type-safe, but clients must distinguish between leaves and composites.
