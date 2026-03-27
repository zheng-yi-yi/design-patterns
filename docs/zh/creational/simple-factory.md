---
title: 简单工厂
description: 学习如何使用简单工厂模式封装对象创建逻辑。
---

# 简单工厂模式

简单工厂模式（Simple Factory Pattern）并不属于 GoF 的 23 种经典设计模式，但它作为创建型模式的基础，在实际应用中极其广泛。它通过一个中心化的工厂类，封装了具体产品的创建逻辑。

::: info 维度与广度：为什么需要简单工厂？
从设计原则的高度来看，简单工厂模式的核心价值在于**解耦（Decoupling）**和**封装（Encapsulation）**。

1.  **屏蔽实例化细节**：对象的创建可能涉及复杂的初始化配置、依赖注入或资源申请。通过工厂，客户端不再关心这些细节，只需“按需索取”。
2.  **职责分离**：将“使用对象”的逻辑与“创建对象”的逻辑分离。客户端只负责业务逻辑，而工厂负责生存周期管理。
3.  **技术演进的起点**：它是工厂方法（Factory Method）和抽象工厂（Abstract Factory）的简化雏形。在系统初期，过度设计往往是不必要的，简单工厂提供了恰到好处的灵活性。
:::

## 结构图

![简单工厂结构图](../images/5968a8a58e4e0cda5b4acfe05bf71414.png)

## 核心角色

-   **Factory (工厂)**：核心部分，含有一定的商业逻辑和判断逻辑，根据外界给定的信息决定创建哪个具体产品。
-   **Product (抽象产品)**：具体产品的父类或接口，定义了产品的规范。
-   **ConcreteProduct (具体产品)**：被创建的实例对象。

## 示例


::: code-group
```cs [C#]
// Abstract Product
public interface ILogger
{
    void Log(string message);
}

// Concrete Product A
public class FileLogger : ILogger
{
    public void Log(string message) => Console.WriteLine($"[File] {message}");
}

// Concrete Product B
public class DatabaseLogger : ILogger
{
    public void Log(string message) => Console.WriteLine($"[DB] {message}");
}

// Simple Factory
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
// Abstract Product
interface Logger {
    void log(String message);
}

// Concrete Product A
class FileLogger implements Logger {
    public void log(String message) {
        System.out.println("Logging to file: " + message);
    }
}

// Concrete Product B
class DatabaseLogger implements Logger {
    public void log(String message) {
        System.out.println("Logging to database: " + message);
    }
}

// Simple Factory
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

## 应用举例

-   **JDK**: `java.util.Calendar.getInstance()` 根据时区和语言环境返回不同的日历子类。
-   **NET**: `System.Text.Encoding.GetEncoding("utf-8")` 根据编码名称创建不同的编码对象。
-   **Web Frameworks**: 许多路由引擎本质上是简单工厂，根据 URL 路径（参数）“制造”不同的处理器（Controller）。

## 局限性与思考

::: warning 违反开闭原则
虽然简单工厂方便，但它违背了**开闭原则（Open/Closed Principle）**：每增加一个新产品，都必须修改工厂类的内部逻辑。
:::

**何时使用？**
-   当产品对象较少，且创建逻辑相对固定时。
-   当客户端只关心如何获取对象，而不关心对象如何诞生。
-   作为快速原型开发或中小型项目的首选。
