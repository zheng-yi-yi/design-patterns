---
title: 代理模式
description: 为另一个对象提供代理或占位符，以控制对该对象的访问。
---

# 代理模式

::: tip 定义
为其他对象提供一种**代理**以控制对这个对象的**访问**。代理对象与真实对象实现相同接口，客户端无法感知差异。
:::

## 1. 模式意图

**解决了什么问题？**
*   需要在访问某个对象时添加额外的控制逻辑（权限校验、延迟加载、日志审计等），但又不想修改原对象的代码。
*   真实对象创建成本高昂（如大文件、远程连接），需要按需创建或缓存访问结果。

**应用场景举例**
*   ✅ 场景 A：**图片/视频懒加载** —— 页面初始化时用占位符代理，用户滚动到可视区域时才加载真实资源。
*   ✅ 场景 B：**API 调用缓存代理** —— 对第三方 API 的调用结果进行缓存，避免重复请求和超出限额。
*   ✅ 场景 C：**数据库访问权限代理** —— 在执行查询前校验当前用户是否有该表/字段的读取权限。
*   ❌ 反例：如果对象创建成本极低且无需任何访问控制，引入代理只是增加间接层，没有实际价值。

## 2. 模式结构

### UML 类图

> ![代理](../images/35274f1b008b4da2b1632bc2b9da3e8d.png)

### 角色与职责
| 角色 | 名称 | 职责描述 |
| :--- | :--- | :--- |
| **Subject** | 抽象主题 | 定义真实对象和代理的公共接口。 |
| **RealSubject** | 真实主题 | 实际执行业务逻辑的对象。 |
| **Proxy** | 代理 | 持有 RealSubject 的引用，在调用前后添加控制逻辑。 |

### 常见代理类型
| 类型 | 说明 |
| :--- | :--- |
| **远程代理** | 为不同地址空间的对象提供本地代表（如 gRPC Stub）。 |
| **虚拟代理** | 延迟创建开销大的对象，按需实例化。 |
| **保护代理** | 控制对原始对象的访问权限。 |
| **缓存代理** | 缓存请求结果，避免重复计算或远程调用。 |

### 协作流程
1. 客户端通过 Subject 接口调用方法。
2. Proxy 拦截请求，执行额外逻辑（权限检查 / 缓存查找 / 延迟初始化）。
3. 若通过检查或缓存未命中，委托给 RealSubject 执行实际操作。
4. Proxy 可对结果进行后处理（记录日志 / 写入缓存）后返回。

## 3. 代码实现

> **代码场景**：以**第三方 API 缓存代理**为例 —— 对外部天气 API 的调用进行缓存，避免频繁请求。

::: code-group

```cs [C#]
// Subject
public interface IWeatherService
{
    string GetForecast(string city);
}

// RealSubject — 真实的外部 API 调用
public class ExternalWeatherService : IWeatherService
{
    public string GetForecast(string city)
    {
        // 模拟耗时的外部 API 调用
        Console.WriteLine($"  🌐 [远程调用] 正在查询 {city} 的天气...");
        Thread.Sleep(1000);
        return $"{city}: 晴, 26°C";
    }
}

// Proxy — 缓存代理
public class CachingWeatherProxy : IWeatherService
{
    private readonly IWeatherService _realService;
    private readonly Dictionary<string, (string result, DateTime expiry)> _cache = new();
    private readonly TimeSpan _ttl;

    public CachingWeatherProxy(IWeatherService realService, TimeSpan ttl)
    {
        _realService = realService;
        _ttl = ttl;
    }

    public string GetForecast(string city)
    {
        if (_cache.TryGetValue(city, out var entry) && entry.expiry > DateTime.UtcNow)
        {
            Console.WriteLine($"  ⚡ [缓存命中] {city}");
            return entry.result;
        }

        Console.WriteLine($"  💨 [缓存未命中] {city}");
        var result = _realService.GetForecast(city);
        _cache[city] = (result, DateTime.UtcNow.Add(_ttl));
        return result;
    }
}
```

```java [Java]
// Subject
public interface WeatherService {
    String getForecast(String city);
}

// RealSubject — 真实的外部 API 调用
public class ExternalWeatherService implements WeatherService {
    @Override
    public String getForecast(String city) {
        System.out.printf("  🌐 [远程调用] 正在查询 %s 的天气...%n", city);
        try { Thread.sleep(1000); } catch (InterruptedException ignored) {}
        return city + ": 晴, 26°C";
    }
}

// Proxy — 缓存代理
public class CachingWeatherProxy implements WeatherService {
    private final WeatherService realService;
    private final Map<String, CacheEntry> cache = new HashMap<>();
    private final long ttlMillis;

    public CachingWeatherProxy(WeatherService realService, long ttlMillis) {
        this.realService = realService;
        this.ttlMillis = ttlMillis;
    }

    @Override
    public String getForecast(String city) {
        CacheEntry entry = cache.get(city);
        if (entry != null && entry.expiry > System.currentTimeMillis()) {
            System.out.printf("  ⚡ [缓存命中] %s%n", city);
            return entry.result;
        }

        System.out.printf("  💨 [缓存未命中] %s%n", city);
        String result = realService.getForecast(city);
        cache.put(city, new CacheEntry(result, System.currentTimeMillis() + ttlMillis));
        return result;
    }

    private record CacheEntry(String result, long expiry) {}
}
```

:::

客户端调用：

::: code-group

```cs [C#]
IWeatherService service = new CachingWeatherProxy(
    new ExternalWeatherService(),
    ttl: TimeSpan.FromMinutes(10));

// 第一次调用 — 缓存未命中，走远程 API
Console.WriteLine(service.GetForecast("北京"));
// 第二次调用 — 缓存命中，瞬间返回
Console.WriteLine(service.GetForecast("北京"));
// 不同城市 — 缓存未命中
Console.WriteLine(service.GetForecast("上海"));
```

```java [Java]
WeatherService service = new CachingWeatherProxy(
    new ExternalWeatherService(),
    10 * 60 * 1000); // 10 分钟 TTL

System.out.println(service.getForecast("北京"));
System.out.println(service.getForecast("北京"));  // 缓存命中
System.out.println(service.getForecast("上海"));
```

:::

## 4. 优缺点分析

### 优点
1. **职责分离**：访问控制逻辑与业务逻辑解耦，真实对象保持单一职责。
2. **透明性**：客户端通过同一接口访问，无需知道是代理还是真实对象。
3. **按需延伸**：可轻松叠加缓存、日志、权限等横切关注点。

### 缺点
1. **增加延迟**：代理层的额外逻辑可能带来性能开销（尤其是动态代理的反射调用）。
2. **调试困难**：间接层使得调用链变长，排查问题时需要穿透代理层。

## 5. 相关模式对比

| 模式名称 | 相似点 | 核心区别 |
| :--- | :--- | :--- |
| **装饰器模式** | 都持有目标对象引用并包装调用 | 装饰器叠加职责且可多层嵌套；代理侧重访问控制，通常只有一层。 |
| **适配器模式** | 都封装了对另一个对象的调用 | 适配器改变接口；代理不改变接口，只增加控制。 |
| **外观模式** | 都简化了客户端的调用 | 外观针对一组子系统提供新接口；代理针对单一对象提供相同接口。 |

## 6. 总结与思考

**核心思想**

*   代理模式的"魂"是**控制访问** —— 在客户端与真实对象之间设置一道关卡，让你有机会在不修改真实对象的情况下注入任何前置/后置逻辑。

**实际应用**

*   **Spring AOP**：通过 JDK 动态代理或 CGLIB 在方法执行前后注入事务管理、日志记录、权限校验等切面逻辑。
*   **MyBatis Mapper**：`@Mapper` 接口没有实现类，MyBatis 通过动态代理在运行时生成实现，将方法调用映射为 SQL 执行。
*   **Nginx 反向代理**：客户端请求到达 Nginx（代理），由 Nginx 转发到后端真实服务器，并可附加负载均衡、SSL 终止、缓存等逻辑。
*   **ES Module Lazy Import**：`const module = await import('./heavy-module.js')` 本质上是虚拟代理 —— 模块在需要时才加载。
