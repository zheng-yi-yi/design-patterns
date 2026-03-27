---
title: Adapter Pattern
description: Convert the interface of a class into another interface clients expect, enabling incompatible interfaces to work together.
---

# Adapter Pattern

::: tip Definition
Convert the interface of a class into another interface clients expect. The Adapter pattern lets classes work together that couldn't otherwise because of incompatible interfaces. Also known as the **Wrapper** pattern.
:::

## 1. Intent

**What problem does it solve?**
*   You need to integrate third-party services or legacy modules whose interfaces don't match your system's expected interface.
*   You can't modify the third-party or legacy source code, but need to use them through a unified interface.

**Example scenarios**
*   ✅ Scenario A: Integrating multiple payment gateways (Stripe, PayPal, WeChat Pay) — each SDK has a completely different API signature, but your system needs a unified `IPaymentGateway` interface.
*   ✅ Scenario B: Migrating from REST to gRPC — legacy clients still call REST endpoints, requiring an adapter layer to forward REST requests as gRPC calls.
*   ❌ Anti-pattern: If you control both sides and the interface gap is small, refactoring the interface directly is simpler than introducing an adapter.

## 2. Structure

### UML Class Diagram

> ![Adapter](../images/ea3ed016429ba85226bb10268dfe4c18.png)

### Roles & Responsibilities
| Role | Name | Responsibility |
| :--- | :--- | :--- |
| **Target** | Target Interface | The unified interface the client expects. |
| **Adaptee** | Adaptee | The existing class with an incompatible interface (e.g., third-party SDK). |
| **Adapter** | Adapter | Implements the Target interface, holds an Adaptee reference, and translates calls. |

### Collaboration Flow
1. The client invokes a method through the Target interface.
2. The Adapter receives the request, converts parameters, and delegates to the Adaptee's method.
3. The Adaptee executes the actual logic; the Adapter converts the result back to the Target-expected format.

## 3. Code Example

> **Scenario**: A **unified payment gateway** — the system must support both Stripe and PayPal, adapted to a common `PaymentGateway` interface.

::: code-group

```cs [C#]
// Target interface
public interface IPaymentGateway
{
    PaymentResult Pay(string orderId, decimal amount);
}

// Adaptee A — Stripe SDK (interface we don't control)
public class StripeClient
{
    public StripeCharge CreateCharge(string idempotencyKey, long amountInCents, string currency)
    {
        Console.WriteLine($"[Stripe] Charge: {idempotencyKey}, {amountInCents} cents ({currency})");
        return new StripeCharge { Id = "ch_" + idempotencyKey, Status = "succeeded" };
    }
}

// Adaptee B — PayPal SDK
public class PayPalClient
{
    public PayPalOrder CreateOrder(string referenceId, string amount, string currencyCode)
    {
        Console.WriteLine($"[PayPal] Order: {referenceId}, {amount} {currencyCode}");
        return new PayPalOrder { OrderId = "PP_" + referenceId, State = "COMPLETED" };
    }
}

// Adapter A — Stripe
public class StripeAdapter : IPaymentGateway
{
    private readonly StripeClient _client;
    public StripeAdapter(StripeClient client) => _client = client;

    public PaymentResult Pay(string orderId, decimal amount)
    {
        long cents = (long)(amount * 100);
        var charge = _client.CreateCharge(orderId, cents, "usd");
        return new PaymentResult
        {
            Success = charge.Status == "succeeded",
            TransactionId = charge.Id
        };
    }
}

// Adapter B — PayPal
public class PayPalAdapter : IPaymentGateway
{
    private readonly PayPalClient _client;
    public PayPalAdapter(PayPalClient client) => _client = client;

    public PaymentResult Pay(string orderId, decimal amount)
    {
        var order = _client.CreateOrder(orderId, amount.ToString("F2"), "USD");
        return new PaymentResult
        {
            Success = order.State == "COMPLETED",
            TransactionId = order.OrderId
        };
    }
}
```

```java [Java]
// Target interface
public interface PaymentGateway {
    PaymentResult pay(String orderId, BigDecimal amount);
}

// Adaptee A — Stripe SDK
public class StripeClient {
    public StripeCharge createCharge(String idempotencyKey, long amountInCents, String currency) {
        System.out.printf("[Stripe] Charge: %s, %d cents (%s)%n", idempotencyKey, amountInCents, currency);
        return new StripeCharge("ch_" + idempotencyKey, "succeeded");
    }
}

// Adaptee B — PayPal SDK
public class PayPalClient {
    public PayPalOrder createOrder(String referenceId, String amount, String currencyCode) {
        System.out.printf("[PayPal] Order: %s, %s %s%n", referenceId, amount, currencyCode);
        return new PayPalOrder("PP_" + referenceId, "COMPLETED");
    }
}

// Adapter A — Stripe
public class StripeAdapter implements PaymentGateway {
    private final StripeClient client;
    public StripeAdapter(StripeClient client) { this.client = client; }

    @Override
    public PaymentResult pay(String orderId, BigDecimal amount) {
        long cents = amount.multiply(BigDecimal.valueOf(100)).longValue();
        StripeCharge charge = client.createCharge(orderId, cents, "usd");
        return new PaymentResult("succeeded".equals(charge.status()), charge.id());
    }
}

// Adapter B — PayPal
public class PayPalAdapter implements PaymentGateway {
    private final PayPalClient client;
    public PayPalAdapter(PayPalClient client) { this.client = client; }

    @Override
    public PaymentResult pay(String orderId, BigDecimal amount) {
        PayPalOrder order = client.createOrder(orderId, amount.toPlainString(), "USD");
        return new PaymentResult("COMPLETED".equals(order.state()), order.orderId());
    }
}
```

:::

Client usage:

::: code-group

```cs [C#]
IPaymentGateway gateway = new StripeAdapter(new StripeClient());
var result = gateway.Pay("ORDER-001", 99.99m);
Console.WriteLine($"Result: {result.Success}, TxnId: {result.TransactionId}");

// Switch to PayPal — client code unchanged
gateway = new PayPalAdapter(new PayPalClient());
result = gateway.Pay("ORDER-002", 49.99m);
Console.WriteLine($"Result: {result.Success}, TxnId: {result.TransactionId}");
```

```java [Java]
PaymentGateway gateway = new StripeAdapter(new StripeClient());
PaymentResult result = gateway.pay("ORDER-001", new BigDecimal("99.99"));
System.out.printf("Result: %s, TxnId: %s%n", result.success(), result.transactionId());

// Switch to PayPal — client code unchanged
gateway = new PayPalAdapter(new PayPalClient());
result = gateway.pay("ORDER-002", new BigDecimal("49.99"));
System.out.printf("Result: %s, TxnId: %s%n", result.success(), result.transactionId());
```

:::

## 4. Pros & Cons

### Pros
1. **Open/Closed Principle**: Adding a new payment provider requires only a new adapter — no changes to existing code.
2. **Decouples third-party dependencies**: Business logic depends only on the Target interface; SDK API changes only affect the corresponding adapter.
3. **Reuses existing classes**: Integrates legacy or third-party code without modification.

### Cons
1. **Added indirection**: Each external system requires its own adapter class, increasing class count.
2. **Adapter proliferation**: Too many adapters may indicate the architecture itself needs redesign.

## 5. Related Patterns

| Pattern | Similarity | Key Difference |
| :--- | :--- | :--- |
| **Bridge** | Both separate interface from implementation | Bridge is designed upfront for independent variation; Adapter is a retrofit to make incompatible interfaces work. |
| **Decorator** | Both use wrapping/delegation | Decorator preserves the interface and adds behavior; Adapter changes the interface for compatibility. |
| **Facade** | Both simplify access to complex systems | Facade provides a new simplified interface for a subsystem; Adapter makes an existing interface compatible with a target. |

## 6. Summary

**Core Idea**

*   The Adapter pattern is about **interface translation** — bridging incompatible interfaces through an intermediate layer without modifying existing code. It's one of the most commonly used patterns for third-party integration.

**Real-World Applications**

*   **Spring Framework**: `HandlerAdapter` adapts various controller types (annotation-based, functional) into a unified interface callable by `DispatcherServlet`.
*   **SLF4J**: The entire framework is a giant adapter, unifying Log4j, Logback, and java.util.logging behind a single SLF4J API.
*   **.NET**: The `DbDataAdapter` family adapts different database providers (SQL Server, MySQL, PostgreSQL) into a unified `DataSet`-filling interface.
