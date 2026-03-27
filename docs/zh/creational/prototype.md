---
title: 原型模式
description: 用原型实例指定创建对象的种类，并且通过拷贝这些原型创建新的对象。
---

# 原型模式

::: tip 定义
**原型模式**：用原型实例指定创建对象的种类，并且通过**拷贝（克隆）**这些原型创建新的对象。当对象的创建成本较高时，克隆比从头构建更高效。
:::

## 1. 模式意图

**解决了什么问题？**
*   当对象初始化需要大量资源（数据库查询、文件读取、网络请求）时，每次 `new` 都重复高昂的初始化成本。原型模式通过克隆已有对象来避免重复初始化。
*   当需要大量结构相似、仅少数属性不同的对象时，以一个"基准对象"为原型进行克隆和微调，比从头创建更高效。

**应用场景举例**
*   ✅ 游戏中大量敌人刷新：以原型克隆代替每次读数据库初始化。
*   ✅ 配置管理：基准服务器配置克隆后微调端口、标签等字段。
*   ✅ 文档模板：从模板克隆新文档，无需重建所有样式和格式。
*   ❌ 对象创建成本低且结构简单时，直接 `new` 更清晰，无需引入克隆。

## 2. 模式结构

### UML 类图

![原型模式](../images/image-20240605211858384.png)

### 角色与职责
| 角色 | 名称 | 职责描述 |
| :--- | :--- | :--- |
| **Prototype** | 抽象原型 | 声明 `clone()` 方法接口。 |
| **ConcretePrototype** | 具体原型 | 实现 `clone()` 方法，返回自身的拷贝。 |
| **Client** | 客户端 | 通过调用原型的 `clone()` 方法创建新对象。 |

### 协作流程
1. 客户端持有一个原型对象的引用。
2. 需要新对象时，调用原型的 `clone()` 方法。
3. 原型返回自身的拷贝（浅拷贝或深拷贝）。
4. 客户端对克隆体进行个性化修改。

### 浅拷贝 vs 深拷贝

| 特性 | 浅拷贝 | 深拷贝 |
| :--- | :--- | :--- |
| **值类型** | 按值复制 | 按值复制 |
| **引用类型** | 仅复制引用（内存地址） | 创建一个新对象并复制其内容 |
| **独立性** | 共享子对象 | 完全独立 |

::: warning
如果对象包含可变的引用类型成员，必须使用**深拷贝**，否则原始对象和克隆对象会共享内部状态，导致意外的数据篡改。
:::

## 3. 代码实现

> **代码场景**：以服务器配置克隆为例，从基准配置克隆后微调。

::: code-group
```csharp [C#]
using System;
using System.Collections.Generic;

public class ServerConfig : ICloneable
{
    public string OS { get; set; }
    public int Port { get; set; }
    public List<string> Tags { get; set; } = new();

    public object Clone()
    {
        // 浅拷贝
        var clone = (ServerConfig)this.MemberwiseClone(); // [!code highlight]
        
        // 为 List 手动进行深拷贝
        clone.Tags = new List<string>(this.Tags); // [!code highlight]
        
        return clone;
    }

    public override string ToString() => $"OS={OS}, Port={Port}, Tags=[{string.Join(", ", Tags)}]";
}
```

```java [Java]
import java.util.ArrayList;
import java.util.List;

public class ServerConfig implements Cloneable {
    private String os;
    private int port;
    private List<String> tags = new ArrayList<>();

    public void setOs(String os) { this.os = os; }
    public void setPort(int port) { this.port = port; }
    public List<String> getTags() { return tags; }

    @Override
    public ServerConfig clone() {
        try {
            ServerConfig copy = (ServerConfig) super.clone(); // [!code highlight]
            // 手动处理可变成员的深拷贝
            copy.tags = new ArrayList<>(this.tags); // [!code highlight]
            return copy;
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }
}
```
:::

客户端调用：

::: code-group
```csharp [C#]
var baseConfig = new ServerConfig { OS = "Linux", Port = 80, Tags = { "web" } };

var instance1 = (ServerConfig)baseConfig.Clone();
instance1.Port = 8080;
instance1.Tags.Add("api");

Console.WriteLine(baseConfig);  // OS=Linux, Port=80, Tags=[web]
Console.WriteLine(instance1);   // OS=Linux, Port=8080, Tags=[web, api]
```

```java [Java]
ServerConfig baseConfig = new ServerConfig();
baseConfig.setOs("Linux");
baseConfig.setPort(80);
baseConfig.getTags().add("web");

ServerConfig instance1 = baseConfig.clone();
instance1.setPort(8080);
instance1.getTags().add("api");

// baseConfig 的 tags 不受影响（深拷贝）
```
:::

## 4. 优缺点分析

### 优点
1. **性能优越**：克隆对象比重新初始化（数据库读取、文件解析）快得多。
2. **简化创建过程**：隐藏了对象初始化的复杂细节，客户端只需调用 `clone()`。
3. **动态获取对象**：运行时可以根据不同的原型动态生成不同的对象。

### 缺点
1. **深拷贝实现复杂**：当对象包含多层嵌套引用时，需要逐层手动实现深拷贝。
2. **违反封装性**：克隆需要访问对象的内部状态，可能暴露私有细节。

## 5. 相关模式对比

| 模式名称 | 相似点 | 核心区别 |
| :--- | :--- | :--- |
| **工厂方法** | 都用于创建对象 | 工厂方法通过工厂类**从头创建**新对象；原型通过**克隆已有对象**创建新对象。 |
| **建造者模式** | 都能创建复杂对象 | 建造者**分步从零构建**；原型**一次性复制**已有对象再微调。 |
| **单例模式** | 都涉及实例管理 | 单例确保**唯一实例**；原型用于**批量复制**实例。 |

## 6. 总结与思考

**核心思想**

*   原型模式的"魂"在于**以克隆代替创建**：当 `new` 的代价太高时，找一个现成的对象"复印"一份，再做微调。它将"如何初始化对象"的复杂性封装在原型内部，对外只暴露一个 `clone()` 接口。

**实际应用**

*   **Java**：`Object.clone()` 是语言内置的原型支持。Spring 中 scope 为 `prototype` 的 Bean，每次 `getBean()` 返回新实例，底层可能涉及原型思想。
*   **.NET**：`ICloneable` 接口和 `MemberwiseClone()` 方法是原型模式的标准实现基础。
*   **JavaScript**：`Object.create(proto)` 直接以已有对象为原型创建新对象，原型链是语言核心机制。
*   **游戏引擎**：Unity 的 `Instantiate(prefab)` 本质上是原型克隆——预制体（Prefab）就是原型，每次实例化都是一次克隆。
