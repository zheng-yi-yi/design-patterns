---
title: 享元模式
description: 运用共享技术有效地支持大量细粒度对象的复用，减少内存开销。
---

# 享元模式

::: tip 定义
运用**共享技术**有效地支持大量细粒度对象。通过将对象的内部状态（可共享）与外部状态（不可共享）分离，极大减少内存中的对象数量。
:::

## 1. 模式意图

**解决了什么问题？**
*   系统中需要创建大量相似对象，它们之间仅有少量属性不同，导致内存占用过高。
*   例如：在线文档中数万个字符各有字体、颜色等属性，但大部分字符共享相同的样式。

**应用场景举例**
*   ✅ 场景 A：**在线地图应用** —— 地图上数十万个 POI 图标（餐厅、加油站、停车场），图标样式是共享内部状态，经纬度坐标是外部状态。
*   ✅ 场景 B：**游戏中的粒子系统** —— 成千上万的子弹/粒子，纹理和模型数据共享，位置和速度各自独立。
*   ❌ 反例：如果对象数量不多或每个对象的状态差异很大，享元模式带来的复杂度不值得。

## 2. 模式结构

### UML 类图

> ![享元](../images/40696759ff6063e88b4672e7e916b5b2.png)

### 角色与职责
| 角色 | 名称 | 职责描述 |
| :--- | :--- | :--- |
| **Flyweight** | 享元接口 | 声明接受外部状态的操作方法。 |
| **ConcreteFlyweight** | 具体享元 | 存储内部状态（可共享），实现享元接口。 |
| **UnsharedConcreteFlyweight** | 非共享享元 | 不被共享的对象，保存所有状态。 |
| **FlyweightFactory** | 享元工厂 | 管理享元池，确保相同内部状态的对象被复用。 |

### 内部状态 vs 外部状态
*   **内部状态（Intrinsic）**：存储在享元内部，不随环境改变，可以共享。如：图标的图片、颜色。
*   **外部状态（Extrinsic）**：由客户端传入，随使用场景变化。如：图标在地图上的经纬度坐标。

### 协作流程
1. 客户端向 FlyweightFactory 请求一个享元对象（传入内部状态的 key）。
2. 工厂检查池中是否已存在 —— 存在则直接返回，否则创建新对象加入池中。
3. 客户端在调用时传入外部状态，享元对象结合内部 + 外部状态完成操作。

## 3. 代码实现

> **代码场景**：以**在线地图 POI 图标渲染**为例 —— 地图上有大量标记点（餐厅、加油站等），图标样式共享，坐标各不相同。

::: code-group

```cs [C#]
// Flyweight — POI 图标
public interface IPoiIcon
{
    void Render(double lat, double lng); // 外部状态：坐标
}

// ConcreteFlyweight — 具体图标（内部状态：类型名 + 图片资源）
public class PoiIcon : IPoiIcon
{
    public string Type { get; }        // 内部状态
    public string ImagePath { get; }   // 内部状态

    public PoiIcon(string type, string imagePath)
    {
        Type = type;
        ImagePath = imagePath;
        Console.WriteLine($"  [创建图标] {type} -> {imagePath}");
    }

    public void Render(double lat, double lng)
        => Console.WriteLine($"  📍 [{Type}] 坐标({lat}, {lng}) 使用图标 {ImagePath}");
}

// FlyweightFactory — 图标池
public class PoiIconFactory
{
    private readonly Dictionary<string, IPoiIcon> _pool = new();

    public IPoiIcon GetIcon(string type)
    {
        if (!_pool.TryGetValue(type, out var icon))
        {
            icon = new PoiIcon(type, $"/icons/{type}.png");
            _pool[type] = icon;
        }
        return icon;
    }

    public int PoolSize => _pool.Count;
}
```

```java [Java]
// Flyweight — POI 图标
public interface PoiIcon {
    void render(double lat, double lng); // 外部状态：坐标
}

// ConcreteFlyweight
public class ConcretePoiIcon implements PoiIcon {
    private final String type;       // 内部状态
    private final String imagePath;  // 内部状态

    public ConcretePoiIcon(String type, String imagePath) {
        this.type = type;
        this.imagePath = imagePath;
        System.out.printf("  [创建图标] %s -> %s%n", type, imagePath);
    }

    @Override
    public void render(double lat, double lng) {
        System.out.printf("  📍 [%s] 坐标(%.4f, %.4f) 使用图标 %s%n", type, lat, lng, imagePath);
    }
}

// FlyweightFactory — 图标池
public class PoiIconFactory {
    private final Map<String, PoiIcon> pool = new HashMap<>();

    public PoiIcon getIcon(String type) {
        return pool.computeIfAbsent(type,
            t -> new ConcretePoiIcon(t, "/icons/" + t + ".png"));
    }

    public int getPoolSize() { return pool.size(); }
}
```

:::

客户端调用：

::: code-group

```cs [C#]
var factory = new PoiIconFactory();

// 模拟地图上的 10000 个 POI 标记，但只有几种图标类型
var poiData = new (string type, double lat, double lng)[]
{
    ("restaurant", 39.9042, 116.4074),
    ("gas_station", 39.9142, 116.4174),
    ("restaurant", 31.2304, 121.4737),
    ("parking",    31.2404, 121.4837),
    ("restaurant", 22.5431, 114.0579),
    ("gas_station", 22.5531, 114.0679),
};

foreach (var (type, lat, lng) in poiData)
{
    IPoiIcon icon = factory.GetIcon(type);  // 复用已有图标
    icon.Render(lat, lng);
}

Console.WriteLine($"\nPOI 总数: {poiData.Length}, 图标对象数: {factory.PoolSize}");
// POI 总数: 6, 图标对象数: 3  (restaurant, gas_station, parking 各一个)
```

```java [Java]
PoiIconFactory factory = new PoiIconFactory();

String[][] poiData = {
    {"restaurant",  "39.9042", "116.4074"},
    {"gas_station", "39.9142", "116.4174"},
    {"restaurant",  "31.2304", "121.4737"},
    {"parking",     "31.2404", "121.4837"},
    {"restaurant",  "22.5431", "114.0579"},
    {"gas_station", "22.5531", "114.0679"},
};

for (String[] poi : poiData) {
    PoiIcon icon = factory.getIcon(poi[0]);
    icon.render(Double.parseDouble(poi[1]), Double.parseDouble(poi[2]));
}

System.out.printf("%nPOI 总数: %d, 图标对象数: %d%n", poiData.length, factory.getPoolSize());
```

:::

## 4. 优缺点分析

### 优点
1. **大幅减少内存占用**：成千上万的对象可能只需要少量享元实例。
2. **集中管理共享状态**：内部状态由工厂统一维护，避免重复创建。

### 缺点
1. **代码复杂度增加**：需要将状态拆分为内部和外部，增加了设计难度。
2. **线程安全**：多线程环境下享元池的并发访问需要额外处理。
3. **外部状态管理成本**：客户端需要自行维护和传递外部状态。

## 5. 相关模式对比

| 模式名称 | 相似点 | 核心区别 |
| :--- | :--- | :--- |
| **单例模式** | 都控制实例数量 | 单例保证全局唯一实例；享元根据 key 管理多个共享实例。 |
| **对象池模式** | 都复用对象 | 对象池的对象是可变的、借出后独占使用；享元是不可变的共享对象。 |
| **组合模式** | 常配合使用 | 组合模式的叶子节点可以用享元实现，减少大量叶子节点的内存开销。 |

## 6. 总结与思考

**核心思想**

*   享元模式的"魂"是**共享不变、隔离变化** —— 把对象中不变的部分抽取出来共享，把变化的部分交由外部管理，从而在海量对象场景下实现极致的内存优化。

**实际应用**

*   **Java String 常量池**：JVM 通过字符串驻留（interning）共享相同内容的字符串，`"hello" == "hello"` 为 `true`。
*   **Integer 缓存**：Java 的 `Integer.valueOf()` 在 -128 ~ 127 范围内返回缓存对象。
*   **游戏引擎（Unity / Unreal）**：纹理、材质、Mesh 资源被大量 GameObject 共享引用，避免重复加载。
*   **浏览器 DOM**：CSS 样式对象在多个 DOM 节点间共享，而非为每个节点创建独立样式副本。
