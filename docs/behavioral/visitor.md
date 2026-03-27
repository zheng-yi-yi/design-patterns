# Visitor Pattern

## Real-World Example

`java.nio.file.Files.walkFileTree()` is a Visitor pattern application. It accepts a starting path and a `FileVisitor` implementation. The `FileVisitor` interface defines four operations: pre-visit file, post-visit file, visit-file-failed, and post-visit directory — allowing custom file/directory handling without modifying the `Files` class.

## Definition

> **Visitor Pattern**: Represent an operation to be performed on the elements of an object structure. Visitor lets you **define a new operation without changing the classes** of the elements on which it operates.

Use cases:
- When you want to add new operations to a data structure without modifying the element classes.
- When multiple unrelated operations need to be performed on a complex object structure, and you want to keep them separate from the element classes.

## Roles

1. **Visitor (Abstract)**: An interface defining `visit` methods for each element type.
2. **Concrete Visitor**: Implements the Visitor interface with specific operations for each element type.
3. **Element (Abstract)**: An interface defining an `accept` method that takes a Visitor.
4. **Concrete Element**: Implements `accept` by calling the visitor's corresponding `visit` method, passing itself as an argument.
5. **Object Structure**: A collection of elements that provides a method for visitors to traverse all elements.

## Example Code

```java
import java.util.ArrayList;
import java.util.List;

interface Visitor {
    void visit(ConcreteElementA element);
    void visit(ConcreteElementB element);
}

class ConcreteVisitorA implements Visitor {
    @Override
    public void visit(ConcreteElementA element) {
        System.out.println("ConcreteVisitorA visiting ConcreteElementA");
        element.operationA();
    }

    @Override
    public void visit(ConcreteElementB element) {
        System.out.println("ConcreteVisitorA visiting ConcreteElementB");
        element.operationB();
    }
}

class ConcreteVisitorB implements Visitor {
    @Override
    public void visit(ConcreteElementA element) {
        System.out.println("ConcreteVisitorB visiting ConcreteElementA");
        element.operationA();
    }

    @Override
    public void visit(ConcreteElementB element) {
        System.out.println("ConcreteVisitorB visiting ConcreteElementB");
        element.operationB();
    }
}

interface Element {
    void accept(Visitor visitor);
}

class ConcreteElementA implements Element {
    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    public void operationA() {
        System.out.println("OperationA...");
    }
}

class ConcreteElementB implements Element {
    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

    public void operationB() {
        System.out.println("OperationB...");
    }
}

class ObjectStructure {
    private final List<Element> elements = new ArrayList<>();

    public void add(Element element) { elements.add(element); }
    public void remove(Element element) { elements.remove(element); }

    public void accept(Visitor visitor) {
        for (Element element : elements) {
            element.accept(visitor);
        }
    }
}

public class Client {
    public static void main(String[] args) {
        ObjectStructure structure = new ObjectStructure();
        structure.add(new ConcreteElementA());
        structure.add(new ConcreteElementB());

        Visitor visitorA = new ConcreteVisitorA();
        structure.accept(visitorA);

        System.out.println("=====================================");

        Visitor visitorB = new ConcreteVisitorB();
        structure.accept(visitorB);
    }
}
```

## Summary

The Visitor pattern separates data operations from data structures, allowing new operations to be added without modifying element classes. This provides high flexibility for adding operations, but if the data structure changes frequently, the Visitor pattern may not be ideal — all visitors would need to be updated for each structural change.
