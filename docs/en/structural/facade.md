---
title: Facade Pattern
description: Provide a unified interface to a set of interfaces in a subsystem, making the subsystem easier to use.
---

# Facade Pattern

::: tip Definition
Provide a unified interface to a set of interfaces in a subsystem. The Facade defines a **higher-level interface** that makes the subsystem easier to use.
:::

## 1. Intent

**What problem does it solve?**
*   Clients must interact with multiple subsystems to complete a single business flow, leading to complex coupling.
*   Any change in a subsystem ripples out to all clients that depend on it directly.

**Example scenarios**
*   ✅ Scenario A: E-commerce **one-click checkout** — a single click triggers inventory reservation, coupon calculation, payment processing, shipping creation, and notification — multiple subsystems behind one call.
*   ✅ Scenario B: An **API gateway** in microservice architecture — exposes unified REST endpoints externally while routing to dozens of backend services internally.
*   ❌ Anti-pattern: If the client only interacts with one service, a facade layer just adds unnecessary indirection.

## 2. Structure

### UML Class Diagram

> ![Facade](../images/154ff000ea6e6bdc85dd92b8b40d66a9.png)

### Roles & Responsibilities
| Role | Name | Responsibility |
| :--- | :--- | :--- |
| **Facade** | Facade | Provides a unified high-level interface; orchestrates subsystem calls. |
| **Subsystem** | Subsystem Classes | Implement individual functionality; unaware of the facade's existence. |

### Collaboration Flow
1. Client calls a single method on the Facade.
2. Facade orchestrates calls to subsystems in the correct business order.
3. Aggregates results and returns to the client.

## 3. Code Example

> **Scenario**: An **e-commerce one-click checkout** — `OrderFacade.PlaceOrder()` encapsulates inventory, coupons, payment, and shipping.

::: code-group

```cs [C#]
// Subsystem A — Inventory
public class InventoryService
{
    public bool Reserve(string sku, int qty)
    {
        Console.WriteLine($"[Inventory] Reserved {sku} x{qty}");
        return true;
    }
}

// Subsystem B — Coupon
public class CouponService
{
    public decimal Apply(string couponCode, decimal total)
    {
        decimal discount = couponCode == "VIP20" ? total * 0.2m : 0;
        Console.WriteLine($"[Coupon] Code {couponCode}, discount {discount:F2}");
        return total - discount;
    }
}

// Subsystem C — Payment
public class PaymentService
{
    public bool Charge(string userId, decimal amount)
    {
        Console.WriteLine($"[Payment] Charged {userId}: {amount:F2}");
        return true;
    }
}

// Subsystem D — Shipping
public class ShippingService
{
    public string CreateShipment(string orderId, string address)
    {
        string trackingNo = "TRK-" + orderId;
        Console.WriteLine($"[Shipping] {orderId} -> {address}, tracking: {trackingNo}");
        return trackingNo;
    }
}

// Facade
public class OrderFacade
{
    private readonly InventoryService _inventory = new();
    private readonly CouponService _coupon = new();
    private readonly PaymentService _payment = new();
    private readonly ShippingService _shipping = new();

    public string PlaceOrder(string userId, string sku, int qty,
                              decimal price, string couponCode, string address)
    {
        string orderId = $"ORD-{DateTime.Now:yyyyMMddHHmmss}";

        if (!_inventory.Reserve(sku, qty))
            throw new Exception("Out of stock");

        decimal total = _coupon.Apply(couponCode, price * qty);

        if (!_payment.Charge(userId, total))
            throw new Exception("Payment failed");

        string trackingNo = _shipping.CreateShipment(orderId, address);

        Console.WriteLine($"✅ Order placed! OrderId: {orderId}, Tracking: {trackingNo}");
        return orderId;
    }
}
```

```java [Java]
// Subsystem A — Inventory
public class InventoryService {
    public boolean reserve(String sku, int qty) {
        System.out.printf("[Inventory] Reserved %s x%d%n", sku, qty);
        return true;
    }
}

// Subsystem B — Coupon
public class CouponService {
    public BigDecimal apply(String couponCode, BigDecimal total) {
        BigDecimal discount = "VIP20".equals(couponCode)
            ? total.multiply(new BigDecimal("0.2")) : BigDecimal.ZERO;
        System.out.printf("[Coupon] Code %s, discount %s%n", couponCode, discount);
        return total.subtract(discount);
    }
}

// Subsystem C — Payment
public class PaymentService {
    public boolean charge(String userId, BigDecimal amount) {
        System.out.printf("[Payment] Charged %s: %s%n", userId, amount);
        return true;
    }
}

// Subsystem D — Shipping
public class ShippingService {
    public String createShipment(String orderId, String address) {
        String trackingNo = "TRK-" + orderId;
        System.out.printf("[Shipping] %s -> %s, tracking: %s%n", orderId, address, trackingNo);
        return trackingNo;
    }
}

// Facade
public class OrderFacade {
    private final InventoryService inventory = new InventoryService();
    private final CouponService coupon = new CouponService();
    private final PaymentService payment = new PaymentService();
    private final ShippingService shipping = new ShippingService();

    public String placeOrder(String userId, String sku, int qty,
                              BigDecimal price, String couponCode, String address) {
        String orderId = "ORD-" + System.currentTimeMillis();

        if (!inventory.reserve(sku, qty))
            throw new RuntimeException("Out of stock");

        BigDecimal total = coupon.apply(couponCode, price.multiply(BigDecimal.valueOf(qty)));

        if (!payment.charge(userId, total))
            throw new RuntimeException("Payment failed");

        String trackingNo = shipping.createShipment(orderId, address);

        System.out.printf("✅ Order placed! OrderId: %s, Tracking: %s%n", orderId, trackingNo);
        return orderId;
    }
}
```

:::

Client usage:

::: code-group

```cs [C#]
var facade = new OrderFacade();
facade.PlaceOrder("user_001", "SKU-iPhone16", 1, 999m, "VIP20", "123 Main St, NYC");
```

```java [Java]
OrderFacade facade = new OrderFacade();
facade.placeOrder("user_001", "SKU-iPhone16", 1,
    new BigDecimal("999"), "VIP20", "123 Main St, NYC");
```

:::

## 4. Pros & Cons

### Pros
1. **Simplified usage**: Client faces a single entry point; no need to understand subsystem internals.
2. **Decoupling**: Subsystem changes (e.g., swapping payment provider) only affect the Facade internally.
3. **Clean layering**: Facade serves as a business orchestration layer, naturally separated from technical details.

### Cons
1. **Violates Open/Closed Principle**: Adding subsystems or changing orchestration often requires modifying the Facade.
2. **Risk of "God class"**: If the Facade accumulates too much logic, it becomes a hard-to-maintain monolith.

## 5. Related Patterns

| Pattern | Similarity | Key Difference |
| :--- | :--- | :--- |
| **Adapter** | Both provide an indirect layer | Adapter converts an existing interface for compatibility; Facade provides a brand-new simplified interface. |
| **Mediator** | Both reduce direct coupling | Mediator coordinates bidirectional communication between peers; Facade is a one-way simplified entry point. |
| **Abstract Factory** | Can be combined | Abstract Factory can hide subsystem object creation details, complementing Facade. |

## 6. Summary

**Core Idea**

*   The Facade pattern is about **simplification** — building a clean entry point over complex subsystems so clients can accomplish tasks with minimal cognitive overhead.

**Real-World Applications**

*   **Spring Boot Starters**: Each Starter is essentially a facade — wrapping auto-configuration, dependency management, and bean registration into "add one dependency and it works."
*   **AWS SDK High-Level APIs**: `TransferManager` wraps S3 multipart upload, retry, and parallel transfer into a single `upload()` call.
*   **.NET `HttpClient`**: Encapsulates DNS resolution, TCP connection pooling, TLS handshake, and retry policies behind simple `GetAsync()` / `PostAsync()` methods.
