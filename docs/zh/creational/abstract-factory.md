---
title: 抽象工厂模式
description: 提供一个创建一系列相关或相互依赖对象的接口，而无需指定它们具体的类。
---

# 抽象工厂模式

::: tip 定义
**抽象工厂模式**：提供一个创建**一系列相关或相互依赖对象**的接口，而无需指定它们具体的类。它确保同一产品族中的对象始终配套使用。
:::

## 1. 模式意图

**解决了什么问题？**
*   当系统需要创建多个相互关联的产品（产品族），并且必须保证这些产品之间的兼容性时。工厂方法只能创建单一产品，而抽象工厂将一组相关产品的创建封装在同一个工厂中，从结构上杜绝了跨族混用。
*   例如：游戏 UI 主题系统中，奇幻风按钮必须搭配奇幻风血条，不能与科幻风混用。

**应用场景举例**
*   ✅ 跨平台 UI 工具包：Windows/macOS/Linux 各有一套按钮、文本框、下拉框，必须配套使用。
*   ✅ 游戏主题系统：奇幻风/科幻风的 UI 元素必须保持视觉一致。
*   ✅ 数据库访问层：不同数据库（MySQL/PostgreSQL/SQLite）的 Connection、Command、DataReader 必须配套。
*   ❌ 当只有一种产品（非产品族）时，使用工厂方法即可，无需抽象工厂。

## 2. 模式结构

### UML 类图

![抽象工厂模式](../images/image-20240605185157189.png)

### 角色与职责
| 角色 | 名称 | 职责描述 |
| :--- | :--- | :--- |
| **AbstractFactory** | 抽象工厂 | 声明创建产品族中各个产品的方法，每个方法对应一种抽象产品。 |
| **ConcreteFactory** | 具体工厂 | 实现抽象工厂的创建方法，生产同一品牌/主题下的全套产品。 |
| **AbstractProduct** | 抽象产品 | 定义产品族中某一类产品的公共接口。可存在多个抽象产品。 |
| **ConcreteProduct** | 具体产品 | 实现抽象产品接口，属于特定品牌/主题的具体实现。 |

### 协作流程
1. 客户端选择一个具体工厂（如 `HaierFactory`），通过抽象工厂接口持有。
2. 客户端调用工厂的各个创建方法（`createTelevision()`、`createAirConditioner()`）。
3. 工厂返回同一品牌下的配套产品，客户端面向抽象产品编程。
4. 切换品牌只需替换工厂实例，客户端代码无需任何改动。

## 3. 代码实现

> **代码场景**：以家电品牌为例，不同品牌的电视和空调必须配套使用。

::: code-group
```cs [C#]
// 抽象产品
public interface ITelevision { void Play(); }
public interface IAirConditioner { void Adjust(); }

// 具体产品 (海尔品牌)
public class HaierTelevision : ITelevision 
{ 
    public void Play() => Console.WriteLine("正在播放海尔电视"); 
}
public class HaierAirConditioner : IAirConditioner 
{ 
    public void Adjust() => Console.WriteLine("正在调节海尔空调温度"); 
}

// 具体产品 (小米品牌)
public class XiaomiTelevision : ITelevision 
{ 
    public void Play() => Console.WriteLine("正在播放小米电视"); 
}
public class XiaomiAirConditioner : IAirConditioner 
{ 
    public void Adjust() => Console.WriteLine("正在调节小米空调温度"); 
}

// 抽象工厂
public interface IApplianceFactory
{
    ITelevision CreateTelevision();
    IAirConditioner CreateAirConditioner();
}

// 具体工厂 (海尔)
public class HaierFactory : IApplianceFactory
{
    public ITelevision CreateTelevision() => new HaierTelevision(); // [!code highlight]
    public IAirConditioner CreateAirConditioner() => new HaierAirConditioner(); // [!code highlight]
}

// 具体工厂 (小米)
public class XiaomiFactory : IApplianceFactory
{
    public ITelevision CreateTelevision() => new XiaomiTelevision(); // [!code highlight]
    public IAirConditioner CreateAirConditioner() => new XiaomiAirConditioner(); // [!code highlight]
}
```

```java [Java]
// 抽象产品
interface Television { void play(); }
interface AirConditioner { void adjust(); }

// 具体产品 (海尔)
class HaierTelevision implements Television {
    public void play() { System.out.println("海尔电视正在播放..."); }
}
class HaierAirConditioner implements AirConditioner {
    public void adjust() { System.out.println("海尔空调正在调节温度..."); }
}

// 具体产品 (TCL)
class TCLTelevision implements Television {
    public void play() { System.out.println("TCL 电视正在播放..."); }
}
class TCLAirConditioner implements AirConditioner {
    public void adjust() { System.out.println("TCL 空调正在调节温度..."); }
}

// 抽象工厂
interface ApplianceFactory {
    Television createTelevision();
    AirConditioner createAirConditioner();
}

// 具体工厂 (海尔)
class HaierFactory implements ApplianceFactory {
    @Override
    public Television createTelevision() { return new HaierTelevision(); } // [!code highlight]
    @Override
    public AirConditioner createAirConditioner() { return new HaierAirConditioner(); } // [!code highlight]
}

// 具体工厂 (TCL)
class TCLFactory implements ApplianceFactory {
    @Override
    public Television createTelevision() { return new TCLTelevision(); } // [!code highlight]
    @Override
    public AirConditioner createAirConditioner() { return new TCLAirConditioner(); } // [!code highlight]
}
```
:::

客户端调用：

::: code-group
```cs [C#]
IApplianceFactory factory = new HaierFactory();
ITelevision tv = factory.CreateTelevision();
IAirConditioner ac = factory.CreateAirConditioner();
tv.Play();    // 输出：正在播放海尔电视
ac.Adjust();  // 输出：正在调节海尔空调温度
```

```java [Java]
ApplianceFactory factory = new HaierFactory();
Television tv = factory.createTelevision();
AirConditioner ac = factory.createAirConditioner();
tv.play();    // 输出：海尔电视正在播放...
ac.adjust();  // 输出：海尔空调正在调节温度...
```
:::

## 4. 优缺点分析

### 优点
1. **产品族一致性**：工厂从结构上保证了同族产品的配套使用，不可能出现跨族混用。
2. **符合开闭原则**：新增产品族只需新增具体工厂和具体产品类，无需修改已有代码。
3. **解耦客户端与具体产品**：客户端只依赖抽象接口，切换产品族只需更换工厂实例。

### 缺点
1. **新增产品类型困难**：如果产品族中要新增一种产品（如新增洗衣机），需要修改抽象工厂接口及所有具体工厂——这被称为"开闭原则的倾斜性"。
2. **类的数量膨胀**：每个产品族都需要一整套工厂和产品类，系统复杂度较高。

## 5. 相关模式对比

| 模式名称 | 相似点 | 核心区别 |
| :--- | :--- | :--- |
| **工厂方法** | 都通过工厂接口创建对象 | 工厂方法创建**单一产品**；抽象工厂创建**产品族**（多种相关产品）。 |
| **建造者模式** | 都封装了复杂对象的创建 | 建造者侧重于**一个复杂对象的分步构建**；抽象工厂侧重于**一组相关对象的批量创建**。 |
| **原型模式** | 都能创建新对象 | 原型通过**克隆**已有对象创建；抽象工厂通过**工厂方法**创建全新对象。 |

## 6. 总结与思考

**核心思想**

*   抽象工厂的"魂"在于**产品族约束**：它不仅封装了"创建什么"，更约束了"哪些东西必须一起创建"。通过将整个产品族的创建集中在一个工厂中，从编译期就杜绝了跨族混用的可能。

**实际应用**

*   **Java AWT/Swing**：`java.awt.Toolkit` 是经典的抽象工厂——不同平台（Windows/macOS/Linux）返回各自的按钮、文本框等原生控件，保证同一平台的 UI 控件风格一致。
*   **ADO.NET**：`DbProviderFactory`（如 `SqlClientFactory`、`MySqlClientFactory`）为不同数据库提供配套的 Connection、Command、DataAdapter。
*   **Spring Framework**：`BeanFactory` 接口的不同实现（`XmlBeanFactory`、`AnnotationConfigApplicationContext`）根据配置方式创建不同风格的 Bean 体系。
