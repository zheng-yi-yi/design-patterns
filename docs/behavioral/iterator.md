# Iterator Pattern

## Real-World Example

Java's collection framework widely applies the Iterator pattern. The `Iterator` interface defines three methods: `hasNext()`, `next()`, and `remove()`. All collection classes (`ArrayList`, `HashSet`, `LinkedList`, etc.) implement the `Iterable` interface, which provides an `iterator()` method to traverse elements without exposing internal structure.

## Definition

> **Iterator Pattern**: Provide a way to access the elements of an aggregate object **sequentially without exposing its underlying representation**.

Use cases:
- When you want to traverse a complex data structure while hiding its internal details.
- When you want a unified interface for traversing different data structures.

## Roles

1. **Iterator**: An interface defining methods for accessing and traversing elements (`hasNext()`, `next()`, etc.).
2. **Concrete Iterator**: Implements the Iterator interface, holding a reference to the aggregate to traverse it.
3. **Aggregate**: An interface providing a method that returns an Iterator.
4. **Concrete Aggregate**: Implements the Aggregate interface, returning a concrete Iterator.

## Example Code

```java
import java.util.Iterator;

interface Aggregate {
    Iterator<String> createIterator();
}

class ConcreteAggregate implements Aggregate {
    private final String[] items;

    public ConcreteAggregate(String[] items) {
        this.items = items;
    }

    @Override
    public Iterator<String> createIterator() {
        return new ConcreteIterator();
    }

    private class ConcreteIterator implements Iterator<String> {
        private int index = 0;

        @Override
        public boolean hasNext() {
            return index < items.length;
        }

        @Override
        public String next() {
            return hasNext() ? items[index++] : null;
        }
    }
}

public class Client {
    public static void main(String[] args) {
        String[] items = {"Apple", "Banana", "Cherry"};
        Aggregate aggregate = new ConcreteAggregate(items);
        Iterator<String> iterator = aggregate.createIterator();
        while (iterator.hasNext()) {
            System.out.println(iterator.next());
        }
    }
}
```

## Summary

The Iterator pattern provides a way to sequentially access aggregate elements without exposing the internal representation. It abstracts the traversal process so clients don't need to know the data structure's internal construction. When the internal representation changes, only the concrete iterator needs updating — client code remains unchanged.
