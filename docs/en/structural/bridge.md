---
title: Bridge Pattern
description: Decouple an abstraction from its implementation so that the two can vary independently, avoiding class explosion from multi-dimensional variation.
---

# Bridge Pattern

::: tip Definition
Decouple an **abstraction** from its **implementation** so that the two can vary independently. The Bridge pattern uses **composition** over **inheritance** to handle multi-dimensional variation and prevent class explosion.
:::

## 1. Intent

**What problem does it solve?**
*   When a class has two or more independently varying dimensions, using inheritance results in a Cartesian product explosion of subclasses.
*   Example: A notification system with **message urgency** (normal, urgent, scheduled) and **delivery channel** (SMS, email, push notification, Slack) — 3 × 4 = 12 subclasses.

**Example scenarios**
*   ✅ Scenario A: Cross-platform UI rendering — widget types (Button, TextBox) × platform implementations (Windows, macOS, Linux).
*   ✅ Scenario B: Notification system — message urgency × delivery channel, two dimensions that grow independently.
*   ❌ Anti-pattern: If only one dimension varies, use Strategy or simple inheritance instead.

## 2. Structure

### UML Class Diagram

> ![Bridge](../images/image-20240616133105881.png)

### Roles & Responsibilities
| Role | Name | Responsibility |
| :--- | :--- | :--- |
| **Abstraction** | Abstraction | Defines the high-level business interface; holds a reference to an Implementor. |
| **RefinedAbstraction** | Refined Abstraction | Extends Abstraction with specific business logic. |
| **Implementor** | Implementor | Defines the interface for implementation classes. |
| **ConcreteImplementor** | Concrete Implementor | Provides the actual low-level operations. |

### Collaboration Flow
1. Client creates a ConcreteImplementor (e.g., `SmsSender`).
2. Injects it into a RefinedAbstraction (e.g., `UrgentMessage`).
3. Calls the abstraction's method, which delegates to the implementor for the actual work.

## 3. Code Example

> **Scenario**: A **notification system** — message types (normal, urgent) × delivery channels (SMS, Slack).

::: code-group

```cs [C#]
// Implementor — delivery channel
public interface IMessageSender
{
    void Send(string recipient, string content);
}

// ConcreteImplementor A — SMS
public class SmsSender : IMessageSender
{
    public void Send(string recipient, string content)
        => Console.WriteLine($"[SMS] -> {recipient}: {content}");
}

// ConcreteImplementor B — Slack
public class SlackSender : IMessageSender
{
    public void Send(string recipient, string content)
        => Console.WriteLine($"[Slack] -> #{recipient}: {content}");
}

// Abstraction
public abstract class Message
{
    protected IMessageSender Sender;
    protected Message(IMessageSender sender) => Sender = sender;
    public abstract void Notify(string recipient, string content);
}

// RefinedAbstraction A — Normal message
public class NormalMessage : Message
{
    public NormalMessage(IMessageSender sender) : base(sender) { }
    public override void Notify(string recipient, string content)
        => Sender.Send(recipient, content);
}

// RefinedAbstraction B — Urgent message (repeated + tagged)
public class UrgentMessage : Message
{
    public UrgentMessage(IMessageSender sender) : base(sender) { }
    public override void Notify(string recipient, string content)
    {
        Sender.Send(recipient, $"[URGENT] {content}");
        Sender.Send(recipient, $"[URGENT-RETRY] {content}");
    }
}
```

```java [Java]
// Implementor — delivery channel
public interface MessageSender {
    void send(String recipient, String content);
}

// ConcreteImplementor A — SMS
public class SmsSender implements MessageSender {
    @Override
    public void send(String recipient, String content) {
        System.out.printf("[SMS] -> %s: %s%n", recipient, content);
    }
}

// ConcreteImplementor B — Slack
public class SlackSender implements MessageSender {
    @Override
    public void send(String recipient, String content) {
        System.out.printf("[Slack] -> #%s: %s%n", recipient, content);
    }
}

// Abstraction
public abstract class Message {
    protected MessageSender sender;
    protected Message(MessageSender sender) { this.sender = sender; }
    public abstract void notify(String recipient, String content);
}

// RefinedAbstraction A — Normal message
public class NormalMessage extends Message {
    public NormalMessage(MessageSender sender) { super(sender); }
    @Override
    public void notify(String recipient, String content) {
        sender.send(recipient, content);
    }
}

// RefinedAbstraction B — Urgent message
public class UrgentMessage extends Message {
    public UrgentMessage(MessageSender sender) { super(sender); }
    @Override
    public void notify(String recipient, String content) {
        sender.send(recipient, "[URGENT] " + content);
        sender.send(recipient, "[URGENT-RETRY] " + content);
    }
}
```

:::

Client usage:

::: code-group

```cs [C#]
Message msg = new NormalMessage(new SmsSender());
msg.Notify("+1234567890", "Your order has shipped.");

msg = new UrgentMessage(new SlackSender());
msg.Notify("oncall-alerts", "Production DB connection pool exhausted!");
```

```java [Java]
Message msg = new NormalMessage(new SmsSender());
msg.notify("+1234567890", "Your order has shipped.");

msg = new UrgentMessage(new SlackSender());
msg.notify("oncall-alerts", "Production DB connection pool exhausted!");
```

:::

## 4. Pros & Cons

### Pros
1. **Avoids class explosion**: M abstractions + N implementations = M + N classes, not M × N.
2. **Open/Closed Principle**: Adding new message types or channels doesn't affect existing code.
3. **Composition over inheritance**: Implementations can be swapped at runtime.

### Cons
1. **Design complexity**: Requires identifying independent dimensions early — demands strong design skills.
2. **Comprehension cost**: The separation between abstraction and implementation adds indirection.

## 5. Related Patterns

| Pattern | Similarity | Key Difference |
| :--- | :--- | :--- |
| **Adapter** | Both involve interface separation | Adapter is a retrofit for compatibility; Bridge is designed upfront for independent variation. |
| **Strategy** | Both use composition over inheritance | Strategy swaps algorithms; Bridge separates two independently varying dimensions. |
| **Abstract Factory** | Often used together | Abstract Factory can create the concrete implementors used in Bridge. |

## 6. Summary

**Core Idea**

*   The Bridge pattern is about **separating dimensions of variation** — when a system has multiple independent axes of change, use composition to decouple them so each can evolve independently.

**Real-World Applications**

*   **JDBC**: `DriverManager` (abstraction) and vendor `Driver` implementations form a bridge — applications use unified JDBC interfaces to access MySQL, PostgreSQL, etc.
*   **.NET MAUI / Xamarin**: Cross-platform UI rendering is a classic bridge — the abstraction layer defines `Button`, `Label` APIs, while each platform (Android, iOS, Windows) provides concrete rendering.
*   **Logging Frameworks**: SLF4J's Abstraction + Binding architecture is essentially a Bridge pattern.
