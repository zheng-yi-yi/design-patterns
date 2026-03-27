---
title: 装饰器模式
description: 动态地给对象添加额外的职责，同时不改变其接口，是继承的一种灵活替代方案。
---

# 装饰器模式

::: tip 定义
动态地给一个对象添加一些额外的职责。就扩展功能而言，装饰器模式比子类继承更加灵活，且不改变原有接口。
:::

## 1. 模式意图

**解决了什么问题？**
*   需要在不修改原有类代码的情况下，为对象**动态叠加**新的行为或职责。
*   使用继承来扩展功能会导致子类膨胀，而且继承是静态的，无法在运行时自由组合。

**应用场景举例**
*   ✅ 场景 A：HTTP 请求管道 —— 在核心处理逻辑外层层包裹日志记录、身份认证、请求限流、响应压缩等横切关注点。
*   ✅ 场景 B：SaaS 订阅计费 —— 基础套餐 + 可选附加功能（高级分析、API 扩容、专属客服），每个附加功能都是一个装饰器。
*   ❌ 反例：如果功能组合是固定的且数量极少，直接写几个子类更简单，不必引入装饰器。

## 2. 模式结构

### UML 类图

> ![装饰器](../images/8335a62e6bd3a59e7d75b2d0462af31f.png)

### 角色与职责
| 角色 | 名称 | 职责描述 |
| :--- | :--- | :--- |
| **Component** | 组件接口 | 定义对象的核心接口，装饰器和被装饰者都实现此接口。 |
| **ConcreteComponent** | 具体组件 | 被装饰的原始对象，包含核心业务逻辑。 |
| **Decorator** | 装饰器抽象 | 持有 Component 引用，将调用委托给被包装的对象。 |
| **ConcreteDecorator** | 具体装饰器 | 在委托前后添加额外行为（新职责）。 |

### 协作流程
1. 客户端创建 ConcreteComponent。
2. 用一个或多个 ConcreteDecorator 依次包装它。
3. 调用最外层装饰器的方法，装饰器逐层执行附加逻辑并向内委托，形成**洋葱模型**。

## 3. 代码实现

> **代码场景**：以**HTTP 请求处理管道**为例 —— 核心处理器外层叠加日志、认证、限流装饰器。

::: code-group

```cs [C#]
// Component
public interface IHttpHandler
{
    string Handle(string request);
}

// ConcreteComponent — 核心业务处理
public class BusinessHandler : IHttpHandler
{
    public string Handle(string request)
        => $"[Response] 已处理请求: {request}";
}

// Decorator 抽象
public abstract class HttpHandlerDecorator : IHttpHandler
{
    protected readonly IHttpHandler Inner;
    protected HttpHandlerDecorator(IHttpHandler inner) => Inner = inner;
    public virtual string Handle(string request) => Inner.Handle(request);
}

// ConcreteDecorator A — 日志
public class LoggingDecorator : HttpHandlerDecorator
{
    public LoggingDecorator(IHttpHandler inner) : base(inner) { }

    public override string Handle(string request)
    {
        Console.WriteLine($"[LOG] 收到请求: {request}");
        var response = Inner.Handle(request);
        Console.WriteLine($"[LOG] 返回响应: {response}");
        return response;
    }
}

// ConcreteDecorator B — 认证
public class AuthDecorator : HttpHandlerDecorator
{
    public AuthDecorator(IHttpHandler inner) : base(inner) { }

    public override string Handle(string request)
    {
        if (!request.Contains("token=valid"))
            return "[Error] 401 Unauthorized";
        return Inner.Handle(request);
    }
}

// ConcreteDecorator C — 限流
public class RateLimitDecorator : HttpHandlerDecorator
{
    private int _remaining;
    public RateLimitDecorator(IHttpHandler inner, int limit) : base(inner)
        => _remaining = limit;

    public override string Handle(string request)
    {
        if (_remaining <= 0)
            return "[Error] 429 Too Many Requests";
        _remaining--;
        return Inner.Handle(request);
    }
}
```

```java [Java]
// Component
public interface HttpHandler {
    String handle(String request);
}

// ConcreteComponent — 核心业务处理
public class BusinessHandler implements HttpHandler {
    @Override
    public String handle(String request) {
        return "[Response] 已处理请求: " + request;
    }
}

// Decorator 抽象
public abstract class HttpHandlerDecorator implements HttpHandler {
    protected final HttpHandler inner;
    protected HttpHandlerDecorator(HttpHandler inner) { this.inner = inner; }

    @Override
    public String handle(String request) { return inner.handle(request); }
}

// ConcreteDecorator A — 日志
public class LoggingDecorator extends HttpHandlerDecorator {
    public LoggingDecorator(HttpHandler inner) { super(inner); }

    @Override
    public String handle(String request) {
        System.out.println("[LOG] 收到请求: " + request);
        String response = inner.handle(request);
        System.out.println("[LOG] 返回响应: " + response);
        return response;
    }
}

// ConcreteDecorator B — 认证
public class AuthDecorator extends HttpHandlerDecorator {
    public AuthDecorator(HttpHandler inner) { super(inner); }

    @Override
    public String handle(String request) {
        if (!request.contains("token=valid"))
            return "[Error] 401 Unauthorized";
        return inner.handle(request);
    }
}

// ConcreteDecorator C — 限流
public class RateLimitDecorator extends HttpHandlerDecorator {
    private int remaining;
    public RateLimitDecorator(HttpHandler inner, int limit) {
        super(inner);
        this.remaining = limit;
    }

    @Override
    public String handle(String request) {
        if (remaining <= 0)
            return "[Error] 429 Too Many Requests";
        remaining--;
        return inner.handle(request);
    }
}
```

:::

客户端调用：

::: code-group

```cs [C#]
// 层层包装：限流 -> 认证 -> 日志 -> 核心处理
IHttpHandler pipeline = new RateLimitDecorator(
    new AuthDecorator(
        new LoggingDecorator(
            new BusinessHandler())),
    limit: 100);

Console.WriteLine(pipeline.Handle("/api/orders?token=valid"));
// [LOG] 收到请求: /api/orders?token=valid
// [LOG] 返回响应: [Response] 已处理请求: /api/orders?token=valid
// [Response] 已处理请求: /api/orders?token=valid

Console.WriteLine(pipeline.Handle("/api/orders"));
// [Error] 401 Unauthorized
```

```java [Java]
// 层层包装：限流 -> 认证 -> 日志 -> 核心处理
HttpHandler pipeline = new RateLimitDecorator(
    new AuthDecorator(
        new LoggingDecorator(
            new BusinessHandler())),
    100);

System.out.println(pipeline.handle("/api/orders?token=valid"));
System.out.println(pipeline.handle("/api/orders"));
```

:::

## 4. 优缺点分析

### 优点
1. **运行时灵活组合**：可以按需叠加任意数量、任意顺序的装饰器，组合方式远超继承。
2. **开闭原则**：新增横切关注点只需新建装饰器类，不修改已有代码。
3. **单一职责**：每个装饰器只关注一项职责（日志、认证、限流），代码清晰。

### 缺点
1. **层层嵌套**：装饰器过多时，构造代码和调试调用栈都变得复杂。
2. **顺序敏感**：装饰器的包装顺序影响执行顺序，使用不当可能导致意外行为。

## 5. 相关模式对比

| 模式名称 | 相似点 | 核心区别 |
| :--- | :--- | :--- |
| **代理模式** | 都持有目标对象的引用并增强行为 | 代理控制**访问**（如延迟加载、权限检查）；装饰器增加**职责**，且可多层叠加。 |
| **组合模式** | 都基于递归结构 | 组合模式构建"部分-整体"树；装饰器构建"核心-包装"链。 |
| **责任链模式** | 都形成调用链 | 责任链中每个处理器可独立决定是否继续传递；装饰器总是向内委托。 |

## 6. 总结与思考

**核心思想**

*   装饰器模式的"魂"是**透明包装、职责叠加** —— 在不改变接口的前提下，用"套娃"的方式为对象动态增加行为。

**实际应用**

*   **Java I/O**：`BufferedInputStream(new FileInputStream(...))` 是教科书级的装饰器链。
*   **ASP.NET Core Middleware**：每个中间件就是一个装饰器，`app.UseAuthentication()`, `app.UseRateLimiter()`, `app.UseResponseCompression()` 构成处理管道。
*   **Spring Security FilterChain**：`SecurityFilterChain` 中的每个 `Filter` 本质上以装饰器模式层层包裹 `HttpServletRequest` 的处理逻辑。
