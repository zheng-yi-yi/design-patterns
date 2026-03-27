---
title: 单例模式
description: 确保一个类只有一个实例，并提供一个访问它的全局访问点。
---

# 单例模式

::: tip 定义
**单例模式**：确保一个类**只有一个实例**，并提供一个**全局访问点**来访问该实例。它主要用于控制共享资源的访问，避免重复创建和数据不一致。
:::

## 1. 模式意图

**解决了什么问题？**
*   当多个模块需要访问同一个共享资源（如日志文件、数据库连接池、应用配置），且该资源只应存在一份实例时。如果各自创建，会导致资源浪费、句柄冲突或数据不一致。
*   需要一个全局协调点来管理状态或资源的场景。

**应用场景举例**
*   ✅ 日志系统：多个模块共享同一个日志文件句柄，避免写入冲突。
*   ✅ 数据库连接池：全局唯一的连接池，避免连接数超限。
*   ✅ 应用配置中心：启动时读取一次配置，全局共享。
*   ❌ 无状态工具类不需要单例——直接用静态方法即可。
*   ❌ 实例化成本低且无共享状态时，单例是过度设计。

## 2. 模式结构

### UML 类图

![单例模式](../images/4a98103b10a6c704d36c55f00006677b.png)

### 角色与职责
| 角色 | 名称 | 职责描述 |
| :--- | :--- | :--- |
| **Singleton** | 单例类 | 持有自身唯一实例的私有静态变量；提供公有静态方法作为全局访问入口；私有化构造函数防止外部 `new`。 |

### 协作流程
1. 客户端通过 `Singleton.getInstance()`（或属性 `Singleton.Instance`）请求实例。
2. 单例类检查实例是否已创建：
   - 若未创建，则创建并缓存。
   - 若已创建，直接返回缓存实例。
3. 所有调用方获得同一个对象引用。

### 实现要点
*   **私有构造函数**：防止外部 `new`。
*   **私有静态成员**：持有唯一实例。
*   **公有静态方法/属性**：全局访问入口。
*   **线程安全**：多线程环境下必须保证实例的唯一性。

## 3. 代码实现

> **代码场景**：以全局单例为例，展示线程安全的懒加载实现。

::: code-group
```cs [C#]
// 使用 Lazy<T> 的线程安全单例
public sealed class Singleton
{
    private static readonly Lazy<Singleton> _instance = 
        new Lazy<Singleton>(() => new Singleton());

    private Singleton() { }

    public static Singleton Instance => _instance.Value; // [!code highlight]

    public void DoWork() => Console.WriteLine("单例正在运行。");
}
```

```java [Java]
// 双重检查锁定 (Double-Checked Locking) 实现
public class Singleton {
    private volatile static Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton(); // [!code highlight]
                }
            }
        }
        return instance;
    }
}
```
:::

客户端调用：

::: code-group
```cs [C#]
Singleton.Instance.DoWork(); // 输出：单例正在运行。

// 验证唯一性
var a = Singleton.Instance;
var b = Singleton.Instance;
Console.WriteLine(ReferenceEquals(a, b)); // True
```

```java [Java]
Singleton.getInstance().doWork();

// 验证唯一性
Singleton a = Singleton.getInstance();
Singleton b = Singleton.getInstance();
System.out.println(a == b); // true
```
:::

## 4. 优缺点分析

### 优点
1. **资源共享**：确保共享资源只有一份实例，避免重复创建和数据不一致。
2. **全局访问**：提供统一的访问入口，使用方便。
3. **延迟初始化**：可以在首次使用时才创建实例，节省启动时间。

### 缺点
1. **隐式依赖**：全局访问点让依赖关系不显式，增加了代码的耦合度和测试难度。
2. **违反单一职责**：单例类同时负责业务逻辑和自身生命周期管理。
3. **多线程风险**：实现不当可能导致线程安全问题。

## 5. 相关模式对比

| 模式名称 | 相似点 | 核心区别 |
| :--- | :--- | :--- |
| **工厂方法** | 都涉及对象的创建控制 | 工厂方法侧重于**创建不同类型对象**；单例侧重于**限制实例数量为一个**。 |
| **原型模式** | 都涉及实例管理 | 原型用于**批量克隆**对象；单例用于**限制唯一**实例。 |
| **静态类** | 都提供全局访问 | 静态类无法实现接口、不能延迟初始化、不支持多态；单例本质是一个普通对象，可以参与 DI 和多态。 |

## 6. 总结与思考

**核心思想**

*   单例的"魂"在于**唯一性保障**：它确保系统中某个关键资源只存在一份，从根本上避免了多实例带来的冲突和浪费。但在现代开发中，手写单例已逐渐被 DI 容器取代。

**实际应用**

*   **Spring**：默认 Bean scope 为 `singleton`，由 IoC 容器管理唯一实例，无需手写单例代码。
*   **.NET Core**：`services.AddSingleton<T>()` 将服务注册为单例生命周期，由 DI 容器保证唯一性。
*   **Java Runtime**：`Runtime.getRuntime()` 返回 JVM 的唯一 `Runtime` 实例。
*   **数据库连接池**：HikariCP、Druid 等连接池通常以单例形式存在，由框架或 DI 容器托管。
