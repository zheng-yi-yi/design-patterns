# Design Patterns

A comprehensive guide to **design patterns** — concepts, Java code examples, and best practices for writing maintainable software.

Built with [VitePress](https://vitepress.dev/).

## Content

### Creational Patterns

| Pattern | Description |
|---------|-------------|
| Simple Factory | Encapsulates object creation in a static method |
| Factory Method | Defers instantiation to subclasses |
| Abstract Factory | Creates families of related objects |
| Singleton | Ensures a class has only one instance |
| Prototype | Creates objects by cloning an existing instance |
| Builder | Separates construction from representation |

### Structural Patterns

| Pattern | Description |
|---------|-------------|
| Facade | Provides a unified interface to a subsystem |
| Adapter | Converts one interface into another |
| Composite | Composes objects into tree structures |
| Proxy | Controls access to another object |
| Bridge | Decouples abstraction from implementation |
| Decorator | Dynamically adds responsibilities to an object |
| Flyweight | Shares objects to support large quantities efficiently |

### Behavioral Patterns

| Pattern | Description |
|---------|-------------|
| Strategy | Encapsulates interchangeable algorithms |
| Template Method | Defines algorithm skeleton, defers steps to subclasses |
| Mediator | Centralizes complex communication between objects |
| Observer | Notifies dependents of state changes |
| Iterator | Sequentially accesses elements without exposing internals |
| Memento | Captures and restores object state |
| State | Alters behavior when internal state changes |
| Command | Encapsulates a request as an object |
| Chain of Responsibility | Passes requests along a handler chain |
| Visitor | Defines new operations without changing element classes |
| Interpreter | Interprets sentences in a defined grammar |

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run docs:dev

# Build for production
npm run docs:build
```

## License

MIT
