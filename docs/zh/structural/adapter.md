---
title: 适配器模式
description: 将一个类的接口转换成客户期望的另一个接口，使接口不兼容的类可以协同工作。
---

# 适配器模式

::: tip 定义
将一个类的接口转换成客户期望的另一个接口。适配器模式让那些接口不兼容的类可以协同工作，又称为**包装器（Wrapper）**模式。
:::

## 1. 模式意图

**解决了什么问题？**
*   系统需要集成第三方服务或遗留模块，但它们的接口与现有系统不一致。
*   你无法修改第三方或遗留代码的源码，却需要在统一的接口下使用它们。

**应用场景举例**
*   ✅ 场景 A：对接多家支付渠道（微信支付、Stripe、PayPal），各自 SDK 接口签名完全不同，需要统一为系统内部的 `IPaymentGateway` 接口。
*   ✅ 场景 B：系统从 REST API 迁移到 gRPC，旧客户端仍通过 REST 调用，需要一个适配层将 REST 请求转发为 gRPC 调用。
*   ❌ 反例：如果你能控制双方代码且接口差异很小，直接重构接口比引入适配器更简洁。

## 2. 模式结构

### UML 类图

> ![适配器](../images/ea3ed016429ba85226bb10268dfe4c18.png)

### 角色与职责
| 角色 | 名称 | 职责描述 |
| :--- | :--- | :--- |
| **Target** | 目标接口 | 客户端所期望的统一接口。 |
| **Adaptee** | 被适配者 | 已有的、接口不兼容的类（如第三方 SDK）。 |
| **Adapter** | 适配器 | 实现 Target 接口，内部持有 Adaptee 引用，将调用转换为 Adaptee 的方法。 |

### 协作流程
1. 客户端通过 Target 接口发起调用。
2. Adapter 接收请求，将参数转换后委托给 Adaptee 的方法。
3. Adaptee 执行实际逻辑，Adapter 将结果转换为 Target 接口预期的格式返回给客户端。

## 3. 代码实现

> **代码场景**：以**统一支付网关**为例 —— 系统需要同时对接微信支付和 Stripe，将它们适配为统一的 `IPaymentGateway` 接口。

::: code-group

```cs [C#]
// 目标接口
public interface IPaymentGateway
{
    PaymentResult Pay(string orderId, decimal amount);
}

// 被适配者 A — 微信支付 SDK（接口不受我们控制）
public class WeChatPaySdk
{
    public WeChatResponse UnifiedOrder(string outTradeNo, int totalFenAmount)
    {
        Console.WriteLine($"[微信支付] 下单: {outTradeNo}, 金额: {totalFenAmount} 分");
        return new WeChatResponse { Code = "SUCCESS", PrepayId = "wx_" + outTradeNo };
    }
}

// 被适配者 B — Stripe SDK
public class StripeClient
{
    public StripeCharge CreateCharge(string idempotencyKey, long amountInCents, string currency)
    {
        Console.WriteLine($"[Stripe] Charge: {idempotencyKey}, {amountInCents} cents ({currency})");
        return new StripeCharge { Id = "ch_" + idempotencyKey, Status = "succeeded" };
    }
}

// 适配器 A — 微信支付适配器
public class WeChatPayAdapter : IPaymentGateway
{
    private readonly WeChatPaySdk _sdk;
    public WeChatPayAdapter(WeChatPaySdk sdk) => _sdk = sdk;

    public PaymentResult Pay(string orderId, decimal amount)
    {
        int fen = (int)(amount * 100);
        var resp = _sdk.UnifiedOrder(orderId, fen);
        return new PaymentResult
        {
            Success = resp.Code == "SUCCESS",
            TransactionId = resp.PrepayId
        };
    }
}

// 适配器 B — Stripe 适配器
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
```

```java [Java]
// 目标接口
public interface PaymentGateway {
    PaymentResult pay(String orderId, BigDecimal amount);
}

// 被适配者 A — 微信支付 SDK
public class WeChatPaySdk {
    public WeChatResponse unifiedOrder(String outTradeNo, int totalFenAmount) {
        System.out.printf("[微信支付] 下单: %s, 金额: %d 分%n", outTradeNo, totalFenAmount);
        WeChatResponse resp = new WeChatResponse();
        resp.setCode("SUCCESS");
        resp.setPrepayId("wx_" + outTradeNo);
        return resp;
    }
}

// 被适配者 B — Stripe SDK
public class StripeClient {
    public StripeCharge createCharge(String idempotencyKey, long amountInCents, String currency) {
        System.out.printf("[Stripe] Charge: %s, %d cents (%s)%n", idempotencyKey, amountInCents, currency);
        StripeCharge charge = new StripeCharge();
        charge.setId("ch_" + idempotencyKey);
        charge.setStatus("succeeded");
        return charge;
    }
}

// 适配器 A — 微信支付适配器
public class WeChatPayAdapter implements PaymentGateway {
    private final WeChatPaySdk sdk;
    public WeChatPayAdapter(WeChatPaySdk sdk) { this.sdk = sdk; }

    @Override
    public PaymentResult pay(String orderId, BigDecimal amount) {
        int fen = amount.multiply(BigDecimal.valueOf(100)).intValue();
        WeChatResponse resp = sdk.unifiedOrder(orderId, fen);
        return new PaymentResult("SUCCESS".equals(resp.getCode()), resp.getPrepayId());
    }
}

// 适配器 B — Stripe 适配器
public class StripeAdapter implements PaymentGateway {
    private final StripeClient client;
    public StripeAdapter(StripeClient client) { this.client = client; }

    @Override
    public PaymentResult pay(String orderId, BigDecimal amount) {
        long cents = amount.multiply(BigDecimal.valueOf(100)).longValue();
        StripeCharge charge = client.createCharge(orderId, cents, "usd");
        return new PaymentResult("succeeded".equals(charge.getStatus()), charge.getId());
    }
}
```

:::

客户端调用：

::: code-group

```cs [C#]
// 通过依赖注入或工厂选择支付渠道
IPaymentGateway gateway = new WeChatPayAdapter(new WeChatPaySdk());
var result = gateway.Pay("ORDER_20260327001", 99.99m);
Console.WriteLine($"支付结果: {result.Success}, 交易号: {result.TransactionId}");

// 切换为 Stripe，客户端代码无需任何修改
gateway = new StripeAdapter(new StripeClient());
result = gateway.Pay("ORDER_20260327002", 49.99m);
Console.WriteLine($"支付结果: {result.Success}, 交易号: {result.TransactionId}");
```

```java [Java]
// 通过依赖注入或工厂选择支付渠道
PaymentGateway gateway = new WeChatPayAdapter(new WeChatPaySdk());
PaymentResult result = gateway.pay("ORDER_20260327001", new BigDecimal("99.99"));
System.out.printf("支付结果: %s, 交易号: %s%n", result.isSuccess(), result.getTransactionId());

// 切换为 Stripe，客户端代码无需任何修改
gateway = new StripeAdapter(new StripeClient());
result = gateway.pay("ORDER_20260327002", new BigDecimal("49.99"));
System.out.printf("支付结果: %s, 交易号: %s%n", result.isSuccess(), result.getTransactionId());
```

:::

## 4. 优缺点分析

### 优点
1. **开闭原则**：新增支付渠道只需新建适配器，不修改已有代码。
2. **解耦第三方依赖**：业务逻辑仅依赖 Target 接口，第三方 SDK 的 API 变更只影响对应适配器。
3. **复用已有类**：无需修改不可控的遗留代码或第三方库即可完成集成。

### 缺点
1. **增加间接层**：每接入一个外部系统就需要一个适配器类，类数量增多。
2. **过度适配**：如果系统中适配器泛滥，可能说明架构设计本身存在问题，应考虑重构。

## 5. 相关模式对比

| 模式名称 | 相似点 | 核心区别 |
| :--- | :--- | :--- |
| **桥接模式** | 都涉及接口与实现的分离 | 桥接在设计之初就将抽象与实现解耦；适配器是事后补救，用于兼容已有接口。 |
| **装饰器模式** | 都使用了包装/委托 | 装饰器不改变接口、只增加行为；适配器改变接口使其兼容。 |
| **外观模式** | 都简化了对复杂系统的访问 | 外观为一组子系统提供新的简化接口；适配器让已有接口适配目标接口。 |

## 6. 总结与思考

**核心思想**

*   适配器模式的"魂"是**接口转换** —— 在不修改已有代码的前提下，通过一个中间层将不兼容的接口桥接起来。它是集成第三方系统时最常用的模式之一。

**实际应用**

*   **Spring Framework**：`HandlerAdapter` 将各种类型的 Controller（注解式、函数式）统一适配为 `DispatcherServlet` 可调用的接口。
*   **SLF4J**：整个框架本身就是一个巨型适配器，将 Log4j、Logback、java.util.logging 等不同日志实现适配为统一的 SLF4J API。
*   **.NET**：`DbDataAdapter` 家族将不同数据库提供者（SQL Server、MySQL、PostgreSQL）适配到统一的 `DataSet` 填充接口。
