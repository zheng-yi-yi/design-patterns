---
title: 简单工厂模式
description: 通过一个中心化的工厂类，根据参数决定创建哪种具体产品，将对象的创建逻辑集中管理。
---

# 简单工厂模式

::: tip 定义
简单工厂模式不属于 GoF 23 种经典设计模式，但它是创建型模式的基础。**它通过一个工厂类，根据传入的参数决定创建哪种具体产品**，将散落在各处的 `new` 操作集中到一个地方管理。
:::

## 1. 模式意图

**解决了什么问题？**
*   当系统中有多种产品需要创建，而客户端不应该关心具体的实例化逻辑时，简单工厂将这些逻辑集中到一个工厂类中，避免创建代码散落在各处。
*   例如：电商系统需要支持多种支付方式（信用卡、支付宝、微信支付），如果每个调用方都自己写 `if/else` 来决定创建哪种支付处理器，新增支付方式时需要修改几十个文件。

**应用场景举例**
*   ✅ 支付渠道选择：根据字符串参数返回不同的支付处理器。
*   ✅ 日志系统：根据配置返回文件日志、数据库日志等不同实现。
*   ✅ 编码/解码器：如 `Encoding.GetEncoding("utf-8")` 返回对应编码对象。
*   ❌ 产品种类频繁变化且数量庞大时不适用——每次新增产品都要修改工厂类，违反开闭原则。

## 2. 模式结构

### UML 类图

![简单工厂结构图](../images/5968a8a58e4e0cda5b4acfe05bf71414.png)

### 角色与职责
| 角色 | 名称 | 职责描述 |
| :--- | :--- | :--- |
| **Factory** | 工厂 | 核心角色，包含判断逻辑，根据参数决定创建哪个具体产品。 |
| **Product** | 抽象产品 | 具体产品的父类或接口，定义产品的公共行为规范。 |
| **ConcreteProduct** | 具体产品 | 实现抽象产品接口的实际对象，由工厂创建并返回。 |

### 协作流程
1. 客户端调用工厂的静态方法，传入类型参数。
2. 工厂根据参数判断应创建哪种具体产品。
3. 工厂实例化对应的具体产品并返回给客户端（以抽象产品类型返回）。

## 3. 代码实现

> **代码场景**：以日志系统为例，根据类型参数创建文件日志或数据库日志。

::: code-group
```cs [C#]
// 抽象产品
public interface ILogger
{
    void Log(string message);
}

// 具体产品 A
public class FileLogger : ILogger
{
    public void Log(string message) => Console.WriteLine($"[File] {message}");
}

// 具体产品 B
public class DatabaseLogger : ILogger
{
    public void Log(string message) => Console.WriteLine($"[DB] {message}");
}

// 简单工厂
public static class LoggerFactory
{
    public static ILogger CreateLogger(string type) => type.ToUpper() switch
    {
        "FILE" => new FileLogger(), // [!code highlight]
        "DB" => new DatabaseLogger(), // [!code highlight]
        _ => throw new ArgumentException("Invalid type")
    };
}
```

```java [Java]
// 抽象产品
interface Logger {
    void log(String message);
}

// 具体产品 A
class FileLogger implements Logger {
    public void log(String message) {
        System.out.println("Logging to file: " + message);
    }
}

// 具体产品 B
class DatabaseLogger implements Logger {
    public void log(String message) {
        System.out.println("Logging to database: " + message);
    }
}

// 简单工厂
class LoggerFactory {
    public static Logger createLogger(String type) {
        if ("FILE".equalsIgnoreCase(type)) { // [!code highlight]
            return new FileLogger(); // [!code highlight]
        } else if ("DB".equalsIgnoreCase(type)) { // [!code highlight]
            return new DatabaseLogger(); // [!code highlight]
        }
        throw new IllegalArgumentException("Unknown logger type");
    }
}
```
:::

客户端调用：

::: code-group
```cs [C#]
ILogger logger = LoggerFactory.CreateLogger("FILE");
logger.Log("系统启动完成");
```

```java [Java]
Logger logger = LoggerFactory.createLogger("FILE");
logger.log("系统启动完成");
```
:::

## 4. 优缺点分析

### 优点
1. **职责集中**：对象创建逻辑集中在工厂类中，客户端无需了解具体产品类名。
2. **使用简单**：客户端只需传入参数即可获取所需产品，降低了使用门槛。

### 缺点
1. **违反开闭原则**：每新增一种产品，都需要修改工厂类的判断逻辑。
2. **工厂类职责过重**：当产品种类增多时，工厂类变得臃肿，不利于维护。

## 5. 相关模式对比

| 模式名称 | 相似点 | 核心区别 |
| :--- | :--- | :--- |
| **工厂方法模式** | 都封装了对象创建 | 工厂方法通过子类化将创建逻辑分散到各个具体工厂，符合开闭原则；简单工厂集中在一个类中。 |
| **抽象工厂模式** | 都涉及工厂概念 | 抽象工厂创建的是**产品族**（一系列相关产品），简单工厂只创建单一产品。 |
| **策略模式** | 都根据参数选择不同实现 | 策略模式侧重于算法的可替换性，简单工厂侧重于对象的创建。 |

## 6. 总结与思考

**核心思想**

*   简单工厂的"魂"在于**集中化**：把散落在系统各处的 `new` 操作收拢到一个地方，让客户端与具体产品类解耦。它是最朴素的创建型模式，牺牲了开闭原则换取了实现的简洁。

**实际应用**

*   **JDK**：`java.util.Calendar.getInstance()` 根据时区和语言环境返回不同的日历子类。
*   **.NET**：`System.Text.Encoding.GetEncoding("utf-8")` 根据名称返回对应的编码实现。
*   **Web 框架**：路由引擎本质上是简单工厂——收到请求路径 `/users/123`，"制造"出对应的 `UserController`。
*   **Spring**：`BeanFactory.getBean("dataSource")` 根据名称返回对应的 Bean 实例，核心思想与简单工厂一脉相承。
