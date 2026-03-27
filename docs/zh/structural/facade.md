---
title: 外观模式
description: 为子系统中的一组接口提供一个统一的高层接口，降低子系统使用的复杂度。
---

# 外观模式

::: tip 定义
为子系统中的一组接口提供一个统一的**高层接口**。外观模式定义了一个更方便的入口，使子系统更容易使用。
:::

## 1. 模式意图

**解决了什么问题？**
*   客户端需要与多个子系统交互才能完成一个业务流程，调用关系复杂、耦合度高。
*   每当子系统变化时，所有直接依赖它的客户端都需要修改。

**应用场景举例**
*   ✅ 场景 A：电商**一键下单** —— 一次点击背后需要调用库存服务、优惠券服务、支付服务、物流服务、通知服务等多个子系统。
*   ✅ 场景 B：微服务架构中的 **API 网关** —— 对外暴露统一 REST 端点，内部路由到数十个后端微服务。
*   ❌ 反例：如果客户端只需与单一服务交互，无需引入外观层，否则只是增加了无意义的间接调用。

## 2. 模式结构

### UML 类图

> ![外观](../images/154ff000ea6e6bdc85dd92b8b40d66a9.png)

### 角色与职责
| 角色 | 名称 | 职责描述 |
| :--- | :--- | :--- |
| **Facade** | 外观 | 提供统一的高层接口，编排子系统调用流程。 |
| **Subsystem** | 子系统类 | 实现各自的具体功能，不感知外观的存在。 |

### 协作流程
1. 客户端调用 Facade 的单一方法。
2. Facade 按照业务流程依次调用各子系统。
3. 将子系统的结果聚合后返回给客户端。

## 3. 代码实现

> **代码场景**：以**电商一键下单**为例 —— `OrderFacade.PlaceOrder()` 封装了库存扣减、优惠计算、支付扣款、物流下单等子系统调用。

::: code-group

```cs [C#]
// 子系统 A — 库存服务
public class InventoryService
{
    public bool Reserve(string sku, int qty)
    {
        Console.WriteLine($"[库存] 锁定 {sku} x{qty}");
        return true;
    }
}

// 子系统 B — 优惠券服务
public class CouponService
{
    public decimal Apply(string couponCode, decimal total)
    {
        decimal discount = couponCode == "VIP20" ? total * 0.2m : 0;
        Console.WriteLine($"[优惠] 优惠码 {couponCode}, 减免 {discount:F2}");
        return total - discount;
    }
}

// 子系统 C — 支付服务
public class PaymentService
{
    public bool Charge(string userId, decimal amount)
    {
        Console.WriteLine($"[支付] 用户 {userId} 扣款 {amount:F2}");
        return true;
    }
}

// 子系统 D — 物流服务
public class ShippingService
{
    public string CreateShipment(string orderId, string address)
    {
        string trackingNo = "SF" + orderId;
        Console.WriteLine($"[物流] 订单 {orderId} -> {address}, 运单号: {trackingNo}");
        return trackingNo;
    }
}

// Facade — 下单外观
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
            throw new Exception("库存不足");

        decimal total = _coupon.Apply(couponCode, price * qty);

        if (!_payment.Charge(userId, total))
            throw new Exception("支付失败");

        string trackingNo = _shipping.CreateShipment(orderId, address);

        Console.WriteLine($"✅ 下单成功! 订单号: {orderId}, 运单号: {trackingNo}");
        return orderId;
    }
}
```

```java [Java]
// 子系统 A — 库存服务
public class InventoryService {
    public boolean reserve(String sku, int qty) {
        System.out.printf("[库存] 锁定 %s x%d%n", sku, qty);
        return true;
    }
}

// 子系统 B — 优惠券服务
public class CouponService {
    public BigDecimal apply(String couponCode, BigDecimal total) {
        BigDecimal discount = "VIP20".equals(couponCode)
            ? total.multiply(new BigDecimal("0.2")) : BigDecimal.ZERO;
        System.out.printf("[优惠] 优惠码 %s, 减免 %s%n", couponCode, discount);
        return total.subtract(discount);
    }
}

// 子系统 C — 支付服务
public class PaymentService {
    public boolean charge(String userId, BigDecimal amount) {
        System.out.printf("[支付] 用户 %s 扣款 %s%n", userId, amount);
        return true;
    }
}

// 子系统 D — 物流服务
public class ShippingService {
    public String createShipment(String orderId, String address) {
        String trackingNo = "SF" + orderId;
        System.out.printf("[物流] 订单 %s -> %s, 运单号: %s%n", orderId, address, trackingNo);
        return trackingNo;
    }
}

// Facade — 下单外观
public class OrderFacade {
    private final InventoryService inventory = new InventoryService();
    private final CouponService coupon = new CouponService();
    private final PaymentService payment = new PaymentService();
    private final ShippingService shipping = new ShippingService();

    public String placeOrder(String userId, String sku, int qty,
                              BigDecimal price, String couponCode, String address) {
        String orderId = "ORD-" + System.currentTimeMillis();

        if (!inventory.reserve(sku, qty))
            throw new RuntimeException("库存不足");

        BigDecimal total = coupon.apply(couponCode, price.multiply(BigDecimal.valueOf(qty)));

        if (!payment.charge(userId, total))
            throw new RuntimeException("支付失败");

        String trackingNo = shipping.createShipment(orderId, address);

        System.out.printf("✅ 下单成功! 订单号: %s, 运单号: %s%n", orderId, trackingNo);
        return orderId;
    }
}
```

:::

客户端调用：

::: code-group

```cs [C#]
var facade = new OrderFacade();
facade.PlaceOrder("user_001", "SKU-iPhone16", 1, 7999m, "VIP20", "北京市海淀区中关村");
// [库存] 锁定 SKU-iPhone16 x1
// [优惠] 优惠码 VIP20, 减免 1599.80
// [支付] 用户 user_001 扣款 6399.20
// [物流] 订单 ORD-20260327... -> 北京市海淀区中关村, 运单号: SFORD-20260327...
// ✅ 下单成功!
```

```java [Java]
OrderFacade facade = new OrderFacade();
facade.placeOrder("user_001", "SKU-iPhone16", 1,
    new BigDecimal("7999"), "VIP20", "北京市海淀区中关村");
```

:::

## 4. 优缺点分析

### 优点
1. **简化调用**：客户端只需面对一个入口方法，无需了解内部子系统交互细节。
2. **解耦**：子系统的变更（如更换支付渠道）只影响 Facade 内部，客户端无感。
3. **分层清晰**：外观作为业务编排层，天然与子系统的技术细节分离。

### 缺点
1. **违反开闭原则**：新增子系统或修改编排流程时，通常需要修改 Facade 类。
2. **可能成为"上帝类"**：如果 Facade 承担过多编排逻辑，会变成难以维护的巨型类。

## 5. 相关模式对比

| 模式名称 | 相似点 | 核心区别 |
| :--- | :--- | :--- |
| **适配器模式** | 都提供了间接层 | 适配器转换接口使其兼容；外观为子系统提供全新的简化接口。 |
| **中介者模式** | 都减少了对象间的直接耦合 | 中介者协调同级对象的双向通信；外观是单向的简化入口。 |
| **抽象工厂** | 可配合使用 | 抽象工厂可隐藏子系统类的创建细节，与外观模式互补。 |

## 6. 总结与思考

**核心思想**

*   外观模式的"魂"是**化繁为简** —— 在复杂子系统之上建立一个简洁的入口，让客户端以最低认知成本完成业务操作。

**实际应用**

*   **Spring Boot Starter**：每个 Starter 本质上是一个外观，将自动配置、依赖管理、Bean 注册等复杂流程封装为 "引入一个依赖即可用"。
*   **AWS SDK 高层 API**：如 `TransferManager`，将 S3 分片上传、重试、并行传输等复杂机制封装为一个 `upload()` 调用。
*   **.NET `HttpClient`**：封装了 DNS 解析、TCP 连接池、TLS 握手、重试策略等底层网络细节，对外暴露简洁的 `GetAsync()` / `PostAsync()`。
