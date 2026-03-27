---
title: 工厂方法模式
description: 了解工厂方法模式如何通过将实例化延迟到子类来提高系统的可扩展性。
---

# 工厂方法模式

工厂方法模式引入了抽象工厂和具体工厂。每个具体工厂只负责创建一种特定的产品（重写抽象工厂定义的抽象方法）。这样一来，增加新的产品类只需要增加新的工厂类，而无需修改现有的工厂代码。这支持了扩展并符合开闭原则。

![工厂方法模式](../images/5968a8a58e4e0cda5b4acfe05bf71414.png)

::: info 定义
**工厂方法模式 (Factory Method Pattern)**：定义一个用于创建对象的接口，但是**让子类决定将哪一个类实例化**。工厂方法模式**使一个类的实例化延迟到其子类**。
:::

## 现代应用案例

1. **日志框架 (Serilog / Log4j)**：在 Serilog 或 Log4j 等日志系统中，`ILogger` 或 `Logger` 实例通常是通过工厂方法创建的。例如，你可以定义一个 `LoggerConfiguration`（抽象）并配置不同的接收器（Sink，具体工厂），它们负责创建日志记录器的特定实例。
2. **依赖注入 (DI) 容器 (ASP.NET Core / Spring Boot)**：现代 Web 框架大量使用工厂模式。在 ASP.NET Core 或 Spring Boot 中，你可以注册一个“工厂方法”或“工厂 Bean”，DI 容器会调用该方法来生成服务实例（例如 `AddScoped<IMyService>(sp => new MyService())`），这实质上是将具体实例化代码从业务逻辑中解耦出来。

## 核心角色

- **抽象工厂 (Abstract Factory)**：定义创建产品对象的抽象工厂方法。
- **抽象产品 (Abstract Product)**：描述产品的共同行为。
- **具体工厂 (Concrete Factory)**：实现抽象方法以创建具体产品。
- **具体产品 (Concrete Product)**：由工厂创建的实际产品对象。

## 示例代码

::: code-group
```cs [C#]
// 抽象产品
public interface ITelevision
{
    void Play();
}

// 具体产品
public class HaierTelevision : ITelevision
{
    public void Play() => Console.WriteLine("正在播放海尔电视");
}

public class XiaomiTelevision : ITelevision
{
    public void Play() => Console.WriteLine("正在播放小米电视");
}

// 抽象工厂
public interface ITelevisionFactory
{
    ITelevision CreateTelevision();
}

// 具体工厂
public class HaierTelevisionFactory : ITelevisionFactory
{
    public ITelevision CreateTelevision() => new HaierTelevision(); // [!code highlight]
}

public class XiaomiTelevisionFactory : ITelevisionFactory
{
    public ITelevision CreateTelevision() => new XiaomiTelevision(); // [!code highlight]
}
```

```java [Java]
// 抽象产品 - 电视机
interface Television {
    void play();
}

// 具体产品 - 海尔电视机
class HaierTelevision implements Television {
    public void play() {
        System.out.println("正在播放海尔电视");
    }
}

// 具体产品 - 小米电视机
class XiaomiTelevision implements Television {
    public void play() {
        System.out.println("正在播放小米电视");
    }
}

// 抽象工厂 - 电视工厂
interface TelevisionFactory {
    Television createTelevision();
}

// 具体工厂 - 海尔电视工厂
class HaierTelevisionFactory implements TelevisionFactory {
    @Override
    public Television createTelevision() {
        return new HaierTelevision(); // [!code highlight]
    }
}

// 具体工厂 - 小米电视工厂
class XiaomiTelevisionFactory implements TelevisionFactory {
    @Override
    public Television createTelevision() {
        return new XiaomiTelevision(); // [!code highlight]
    }
}
```
:::

## 总结

::: tip 核心洞察
“在工厂方法模式中，父类决定实例生成的具体方式，但不决定要生成的具体类。具体的处理完全交给子类。这实现了生成实例的框架与实际生成实例的类之间的解耦。”
:::

工厂方法模式将对象的创建封装在抽象类（或接口）中，并让子类决定实例化哪一个类。客户端只需调用工厂方法即可获得产品——“我想要个东西，你给我一个就行。”