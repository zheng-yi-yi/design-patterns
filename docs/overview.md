
# Overview

## What Are Design Patterns?

As developers gain experience, they naturally develop **common code structures and problem-solving approaches** — these are known as **patterns**, reusable solutions to recurring problems.

In 1995, **Erich Gamma, Richard Helm, Ralph Johnson, and John Vlissides** — collectively known as the **Gang of Four (GoF)** — compiled these practices into the seminal book *"Design Patterns: Elements of Reusable Object-Oriented Software"*, which documents **23 classic design patterns**.

> *"A pattern is a **solution** to a problem in a **context**."*

**Design patterns are proven, catalogued solutions to common software design problems.** They promote code reuse, improve readability, and ensure reliability. They are not finished code, but templates for solving problems in specific contexts.

## Classification

Design patterns are categorized by **purpose** into three groups:

- **Creational Patterns**: Focus on object creation mechanisms, separating creation from use.
- **Structural Patterns**: Deal with how classes and objects are composed to form larger structures.
- **Behavioral Patterns**: Focus on communication and responsibility distribution between objects.

### Creational Patterns

Creational patterns focus on **object creation mechanisms**, separating object creation from usage to reduce coupling.

> Decoupling means reducing dependencies between components. If modifying one module forces changes in many others, coupling is too high. Creational patterns provide structured ways to manage object instantiation.

| Pattern | Description | Diagram |
|---------|-------------|---------|
| [Factory Method](/creational/factory-method) | Define an interface for creating objects; let subclasses decide which class to instantiate. | ![Factory Method](./images/5968a8a58e4e0cda5b4acfe05bf71414.png) |
| [Abstract Factory](/creational/abstract-factory) | Provide an interface for creating families of related objects without specifying concrete classes. | ![Abstract Factory](./images/image-20240605185157189.png) |
| [Singleton](/creational/singleton) | Ensure a class has only one instance with a global access point. | ![Singleton](./images/4a98103b10a6c704d36c55f00006677b.png) |
| [Prototype](/creational/prototype) | Create new objects by cloning an existing instance. | ![Prototype](./images/image-20240605211858384.png) |
| [Builder](/creational/builder) | Separate the construction of a complex object from its representation. | ![Builder](./images/84e1311ac13c1ab1ed6395a437376fcc-17175962994103.png) |

### Structural Patterns

Structural patterns deal with **how classes and objects are composed to form larger structures**, improving modularity and flexibility through inheritance and association.

| Pattern | Description | Diagram |
|---------|-------------|---------|
| [Facade](/structural/facade) | Provide a unified interface to a set of interfaces in a subsystem. | ![Facade](./images/154ff000ea6e6bdc85dd92b8b40d66a9.png) |
| [Adapter](/structural/adapter) | Convert one interface into another that clients expect. | ![Adapter](./images/ea3ed016429ba85226bb10268dfe4c18.png) |
| [Composite](/structural/composite) | Compose objects into tree structures to represent part-whole hierarchies. | ![Composite](./images/a057f74449982952b54ba4ffb561acfb.png) |
| [Proxy](/structural/proxy) | Provide a surrogate to control access to another object. | ![Proxy](./images/35274f1b008b4da2b1632bc2b9da3e8d.png) |
| [Bridge](/structural/bridge) | Decouple an abstraction from its implementation so both can vary independently. | ![Bridge](./images/image-20240616133105881.png) |
| [Decorator](/structural/decorator) | Dynamically attach additional responsibilities to an object. | ![Decorator](./images/8335a62e6bd3a59e7d75b2d0462af31f.png) |
| [Flyweight](/structural/flyweight) | Use sharing to efficiently support large numbers of fine-grained objects. | ![Flyweight](./images/40696759ff6063e88b4672e7e916b5b2.png) |

### Behavioral Patterns

Behavioral patterns focus on **communication and responsibility distribution between objects**, abstracting common interaction patterns for efficient collaboration.

| Pattern | Description | Diagram |
|---------|-------------|---------|
| [Strategy](/behavioral/strategy) | Define a family of algorithms, encapsulate each one, and make them interchangeable. | ![Strategy](./images/c6138b428f0852ec54fd73682d266351.png) |
| [Template Method](/behavioral/template-method) | Define the skeleton of an algorithm, deferring some steps to subclasses. | ![Template Method](./images/392b6d69d3ff8b7cd45939889efba6d4.png) |
| [Mediator](/behavioral/mediator) | Encapsulate object interactions via a mediator to promote loose coupling. | ![Mediator](./images/ff40ab045ec8b7efe1f9014a17badac7.png) |
| [Observer](/behavioral/observer) | Define a one-to-many dependency so that when one object changes state, all dependents are notified. | ![Observer](./images/4a207cfbdde883ff33a53c20f67eff19.png) |
| [Iterator](/behavioral/iterator) | Provide a way to access elements of an aggregate without exposing its internal representation. | ![Iterator](./images/image-20240616214143738.png) |
| [Memento](/behavioral/memento) | Capture and externalize an object's internal state so it can be restored later. | ![Memento](./images/b9e267a6f34767837e7790c35a78a82b.png) |
| [State](/behavioral/state) | Allow an object to alter its behavior when its internal state changes. | ![State](./images/69bd2b0b479326d4a03cdfc5af616163.png) |
| [Command](/behavioral/command) | Encapsulate a request as an object, enabling parameterization, queuing, and undo. | ![Command](./images/28683190e902b3555dd0baf89a5f8696.png) |
| [Chain of Responsibility](/behavioral/chain-of-responsibility) | Pass a request along a chain of handlers until one handles it. | ![Chain of Responsibility](./images/85b7f1888bb77a1ca09850a6b0c67341.png) |
| [Visitor](/behavioral/visitor) | Define new operations on elements without changing their classes. | ![Visitor](./images/56c68cd139f91d465d814c677cbb3e2a.png) |
| [Interpreter](/behavioral/interpreter) | Define a grammar representation and an interpreter that processes sentences in the language. | ![Interpreter](./images/2ceb6b487ffe30db942d5c843a254202.png) |

## Scope: Class vs. Object Patterns

Patterns can also be classified by **scope**:

### Class Patterns

Class patterns focus on **static relationships** between classes and subclasses, using inheritance and static methods to share behavior. Relationships are determined at **compile time**.

- **Pros**: Clear structure, easy to understand; enables code reuse via inheritance.
- **Cons**: Deep inheritance hierarchies can become complex; inheritance is static and inflexible.

### Object Patterns

Object patterns focus on **dynamic relationships** between objects, using interfaces, composition, and delegation. Relationships are determined at **runtime**.

- **Pros**: Greater flexibility and extensibility; reduced coupling between objects.
- **Cons**: May increase complexity with more object relationships; dynamic composition can impact performance.

## Why Learn Design Patterns?

- **Code reuse**: Proven solutions reduce redundant work and improve development efficiency.
- **Maintainability**: Well-structured code is easier to understand, modify, and extend.
- **Communication**: Patterns provide a shared vocabulary for developers to discuss design decisions.
- **Flexibility**: Pattern-based designs adapt more easily to changing requirements.
- **Deeper understanding**: Studying patterns deepens your grasp of object-oriented principles.

> Design patterns help developers see code from a new perspective — building software that is easier to reuse, extend, and maintain.
