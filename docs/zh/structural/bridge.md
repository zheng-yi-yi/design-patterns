---
title: 桥接模式
description: 将抽象部分与实现部分分离，使它们可以独立变化，避免多维度变化导致的类爆炸。
---

# 桥接模式

::: tip 定义
将抽象部分与它的实现部分分离，使它们都可以独立地变化。桥接模式通过**组合**替代**继承**来处理多维度变化，避免类爆炸问题。
:::

## 1. 模式意图

**解决了什么问题？**
*   当一个类存在两个或多个独立变化的维度时，如果使用继承，子类数量将呈笛卡尔积式爆炸增长。
*   例如：消息系统中，**消息类型**（普通、紧急、定时）和**推送渠道**（短信、邮件、App Push、企业微信）是两个独立维度，3 × 4 = 12 个子类。

**应用场景举例**
*   ✅ 场景 A：跨平台 UI 渲染 —— 控件类型（Button、TextBox）× 平台实现（Windows、macOS、Linux）。
*   ✅ 场景 B：消息通知系统 —— 消息紧急程度 × 发送渠道，两个维度独立扩展。
*   ❌ 反例：如果只有一个维度变化，直接用策略模式或简单继承即可，无需桥接。

## 2. 模式结构

### UML 类图

> ![桥接](../images/image-20240616133105881.png)

### 角色与职责
| 角色 | 名称 | 职责描述 |
| :--- | :--- | :--- |
| **Abstraction** | 抽象类 | 定义高层业务接口，持有 Implementor 的引用。 |
| **RefinedAbstraction** | 扩展抽象 | 扩展 Abstraction，实现具体业务逻辑。 |
| **Implementor** | 实现接口 | 定义底层实现的接口（与抽象接口可以不同）。 |
| **ConcreteImplementor** | 具体实现 | 实现 Implementor 接口，提供真正的底层操作。 |

### 协作流程
1. 客户端创建 ConcreteImplementor（如 SmsSender）。
2. 将其注入 RefinedAbstraction（如 UrgentMessage）。
3. 调用抽象层方法，抽象层委托给实现层完成具体工作。

## 3. 代码实现

> **代码场景**：以**消息通知系统**为例 —— 消息类型（普通、紧急）× 推送渠道（短信、企业微信）。

::: code-group

```cs [C#]
// Implementor — 消息发送渠道
public interface IMessageSender
{
    void Send(string recipient, string content);
}

// ConcreteImplementor A — 短信
public class SmsSender : IMessageSender
{
    public void Send(string recipient, string content)
        => Console.WriteLine($"[短信] -> {recipient}: {content}");
}

// ConcreteImplementor B — 企业微信
public class WeComSender : IMessageSender
{
    public void Send(string recipient, string content)
        => Console.WriteLine($"[企业微信] -> {recipient}: {content}");
}

// Abstraction — 消息
public abstract class Message
{
    protected IMessageSender Sender;
    protected Message(IMessageSender sender) => Sender = sender;
    public abstract void Notify(string recipient, string content);
}

// RefinedAbstraction A — 普通消息
public class NormalMessage : Message
{
    public NormalMessage(IMessageSender sender) : base(sender) { }

    public override void Notify(string recipient, string content)
        => Sender.Send(recipient, content);
}

// RefinedAbstraction B — 紧急消息（重复发送 + 标注）
public class UrgentMessage : Message
{
    public UrgentMessage(IMessageSender sender) : base(sender) { }

    public override void Notify(string recipient, string content)
    {
        Sender.Send(recipient, $"[紧急] {content}");
        Sender.Send(recipient, $"[紧急-重发] {content}");
    }
}
```

```java [Java]
// Implementor — 消息发送渠道
public interface MessageSender {
    void send(String recipient, String content);
}

// ConcreteImplementor A — 短信
public class SmsSender implements MessageSender {
    @Override
    public void send(String recipient, String content) {
        System.out.printf("[短信] -> %s: %s%n", recipient, content);
    }
}

// ConcreteImplementor B — 企业微信
public class WeComSender implements MessageSender {
    @Override
    public void send(String recipient, String content) {
        System.out.printf("[企业微信] -> %s: %s%n", recipient, content);
    }
}

// Abstraction — 消息
public abstract class Message {
    protected MessageSender sender;
    protected Message(MessageSender sender) { this.sender = sender; }
    public abstract void notify(String recipient, String content);
}

// RefinedAbstraction A — 普通消息
public class NormalMessage extends Message {
    public NormalMessage(MessageSender sender) { super(sender); }

    @Override
    public void notify(String recipient, String content) {
        sender.send(recipient, content);
    }
}

// RefinedAbstraction B — 紧急消息
public class UrgentMessage extends Message {
    public UrgentMessage(MessageSender sender) { super(sender); }

    @Override
    public void notify(String recipient, String content) {
        sender.send(recipient, "[紧急] " + content);
        sender.send(recipient, "[紧急-重发] " + content);
    }
}
```

:::

客户端调用：

::: code-group

```cs [C#]
// 普通消息 + 短信
Message msg = new NormalMessage(new SmsSender());
msg.Notify("13800001111", "您的订单已发货");

// 紧急消息 + 企业微信
msg = new UrgentMessage(new WeComSender());
msg.Notify("zhangsan", "生产环境数据库连接池耗尽，请立即处理！");
```

```java [Java]
// 普通消息 + 短信
Message msg = new NormalMessage(new SmsSender());
msg.notify("13800001111", "您的订单已发货");

// 紧急消息 + 企业微信
msg = new UrgentMessage(new WeComSender());
msg.notify("zhangsan", "生产环境数据库连接池耗尽，请立即处理！");
```

:::

## 4. 优缺点分析

### 优点
1. **避免类爆炸**：M 个抽象 + N 个实现 = M + N 个类，而非 M × N。
2. **开闭原则**：新增消息类型或发送渠道互不影响，独立扩展。
3. **组合优于继承**：运行时动态切换实现，灵活性远高于继承方案。

### 缺点
1. **设计复杂度**：需要在设计初期就识别出独立变化的维度，对架构能力要求较高。
2. **理解成本**：抽象层与实现层的分离增加了代码阅读的间接性。

## 5. 相关模式对比

| 模式名称 | 相似点 | 核心区别 |
| :--- | :--- | :--- |
| **适配器模式** | 都涉及接口分离 | 适配器是事后兼容，桥接是事前设计，用于分离多维度变化。 |
| **策略模式** | 都用组合替代继承 | 策略替换的是算法行为；桥接分离的是两个独立变化的维度。 |
| **抽象工厂** | 可配合使用 | 抽象工厂可用来创建桥接模式中的具体实现对象。 |

## 6. 总结与思考

**核心思想**

*   桥接模式的"魂"是**分离变化维度** —— 当系统存在多个独立变化方向时，用组合将它们解耦，让每个维度各自演化，互不牵扯。

**实际应用**

*   **JDBC**：`DriverManager`（抽象）与各数据库厂商的 `Driver`（实现）之间就是桥接关系，应用程序通过统一的 JDBC 接口访问 MySQL、PostgreSQL 等不同数据库。
*   **.NET MAUI / Xamarin**：UI 控件的跨平台渲染就是典型的桥接 —— 抽象层定义 `Button`、`Label` 等控件 API，各平台（Android、iOS、Windows）提供具体渲染实现。
*   **日志框架**：SLF4J 的 Abstraction + Binding 架构本质上也是桥接模式的体现。
