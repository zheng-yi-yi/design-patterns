---
title: 工厂方法模式
description: 定义一个用于创建对象的接口，让子类决定实例化哪一个类，使实例化延迟到子类。
---

# 工厂方法模式

::: tip 定义
**工厂方法模式**：定义一个用于创建对象的接口，但**让子类决定实例化哪一个类**。工厂方法使一个类的实例化延迟到其子类，从而在不修改已有代码的前提下扩展新产品。
:::

## 1. 模式意图

**解决了什么问题？**
*   简单工厂把所有创建逻辑塞进一个工厂类，每次新增产品都要修改该类，违反开闭原则。工厂方法通过为每种产品提供独立的工厂子类，将创建逻辑分散化，新增产品只需新增工厂类。
*   当父类需要控制创建流程（校验 → 创建 → 后处理），但**创建哪种具体对象**由子类决定时。

**应用场景举例**
*   ✅ 跨平台文档导出：导出流程相同，但 PDF/Word/HTML 的序列化方式不同，由子类工厂决定。
*   ✅ 游戏关卡敌人生成：刷怪机制统一，但不同关卡生成不同敌人类型。
*   ✅ 日志框架：核心框架定义日志写入流程，具体输出到文件/数据库/消息队列由工厂子类决定。
*   ❌ 只有一两种产品且不太会变化时，使用简单工厂即可，无需引入工厂方法的额外层级。

## 2. 模式结构

### UML 类图

![工厂方法模式](../images/5968a8a58e4e0cda5b4acfe05bf71414.png)

### 角色与职责
| 角色 | 名称 | 职责描述 |
| :--- | :--- | :--- |
| **Creator** | 抽象工厂 | 声明工厂方法（返回抽象产品），可包含创建流程的模板逻辑。 |
| **ConcreteCreator** | 具体工厂 | 实现工厂方法，返回对应的具体产品实例。 |
| **Product** | 抽象产品 | 定义产品的公共接口和行为规范。 |
| **ConcreteProduct** | 具体产品 | 实现抽象产品接口的实际对象。 |

### 协作流程
1. 客户端创建一个具体工厂实例（如 `HaierTelevisionFactory`）。
2. 客户端通过抽象工厂接口调用 `createProduct()` 方法。
3. 具体工厂内部实例化对应的具体产品并返回。
4. 客户端始终面向抽象产品编程，不依赖任何具体类。

## 3. 代码实现

> **代码场景**：以电视机生产为例，不同品牌有独立的工厂。

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
// 抽象产品
interface Television {
    void play();
}

// 具体产品
class HaierTelevision implements Television {
    public void play() {
        System.out.println("正在播放海尔电视");
    }
}

class XiaomiTelevision implements Television {
    public void play() {
        System.out.println("正在播放小米电视");
    }
}

// 抽象工厂
interface TelevisionFactory {
    Television createTelevision();
}

// 具体工厂
class HaierTelevisionFactory implements TelevisionFactory {
    @Override
    public Television createTelevision() {
        return new HaierTelevision(); // [!code highlight]
    }
}

class XiaomiTelevisionFactory implements TelevisionFactory {
    @Override
    public Television createTelevision() {
        return new XiaomiTelevision(); // [!code highlight]
    }
}
```
:::

客户端调用：

::: code-group
```cs [C#]
ITelevisionFactory factory = new HaierTelevisionFactory();
ITelevision tv = factory.CreateTelevision();
tv.Play(); // 输出：正在播放海尔电视
```

```java [Java]
TelevisionFactory factory = new HaierTelevisionFactory();
Television tv = factory.createTelevision();
tv.play(); // 输出：正在播放海尔电视
```
:::

## 4. 优缺点分析

### 优点
1. **符合开闭原则**：新增产品只需新增具体工厂和具体产品类，无需修改已有代码。
2. **解耦客户端与具体产品**：客户端面向抽象编程，不依赖具体类名。
3. **单一职责**：每个工厂只负责创建一种产品。

### 缺点
1. **类的数量增多**：每新增一种产品就需要新增一个工厂类，系统复杂度上升。
2. **增加抽象层级**：引入了额外的抽象层，对简单场景可能是过度设计。

## 5. 相关模式对比

| 模式名称 | 相似点 | 核心区别 |
| :--- | :--- | :--- |
| **简单工厂** | 都封装了对象创建 | 简单工厂用一个类集中判断；工厂方法用继承将判断分散到子类，符合开闭原则。 |
| **抽象工厂** | 都使用工厂接口 | 工厂方法创建**单一产品**；抽象工厂创建**产品族**（一系列相关产品）。 |
| **模板方法** | 都将部分逻辑延迟到子类 | 模板方法延迟的是**算法步骤**；工厂方法延迟的是**对象创建**。 |

## 6. 总结与思考

**核心思想**

*   工厂方法的"魂"在于**延迟决策**：父类定义"做什么"（创建流程），子类决定"用什么做"（具体产品）。它是简单工厂的升级版，用继承和多态替代了 `if/else`，让系统真正做到对扩展开放、对修改关闭。

**实际应用**

*   **Java Collection 框架**：`Collection.iterator()` 是典型的工厂方法——`ArrayList` 返回 `ArrayList.Itr`，`HashSet` 返回 `HashMap.KeyIterator`，调用方只面向 `Iterator` 接口。
*   **SLF4J**：`ILoggerFactory.getLogger()` 由不同日志框架（Logback、Log4j2）提供具体实现，应用代码只依赖 SLF4J 接口。
*   **ASP.NET Core**：`IServiceProviderFactory<TContainerBuilder>` 允许替换 DI 容器实现（如 Autofac），框架本身不绑定具体容器。
