---
title: 组合模式
description: 将对象组合成树形结构以表示"部分-整体"的层次关系，使客户端可以统一处理单个对象和组合对象。
---

# 组合模式

::: tip 定义
将对象组合成**树形结构**以表示"部分-整体"的层次关系。组合模式使客户端对单个对象和组合对象的使用具有**一致性**。
:::

## 1. 模式意图

**解决了什么问题？**
*   系统中存在树状层级结构（如组织架构、权限菜单、文件系统），客户端需要递归遍历并统一处理叶子节点和容器节点。
*   如果区别对待叶子和容器，客户端代码将充斥大量 `if-else` 类型判断，难以维护。

**应用场景举例**
*   ✅ 场景 A：后台管理系统中的**权限菜单树** —— 菜单目录（可包含子菜单）与菜单项（叶子，对应具体页面）结构一致。
*   ✅ 场景 B：电商平台的**商品分类体系** —— "电子产品 > 手机 > 折叠屏手机"，任意层级都能计算分类下的商品总数。
*   ❌ 反例：如果结构是扁平的列表而非树形层级，使用组合模式徒增复杂度。

## 2. 模式结构

### UML 类图

> ![组合](../images/a057f74449982952b54ba4ffb561acfb.png)

### 角色与职责
| 角色 | 名称 | 职责描述 |
| :--- | :--- | :--- |
| **Component** | 组件接口 | 为叶子和容器声明统一的操作接口。 |
| **Leaf** | 叶子节点 | 树中的最末端对象，无子节点，实现具体业务逻辑。 |
| **Composite** | 容器节点 | 持有子 Component 集合，实现 add/remove 等管理方法，将操作递归委托给子节点。 |

### 协作流程
1. 客户端通过 Component 接口发起操作。
2. 若为 Leaf，直接执行。
3. 若为 Composite，遍历子节点，递归调用每个子节点的同名操作，最终汇总结果。

## 3. 代码实现

> **代码场景**：以**企业组织架构**为例 —— 集团下有部门，部门下有团队或员工，需要递归统计人数和打印组织树。

::: code-group

```cs [C#]
// Component
public abstract class OrgComponent
{
    public string Name { get; }
    protected OrgComponent(string name) => Name = name;
    public abstract int GetHeadCount();
    public abstract void Print(string indent = "");

    public virtual void Add(OrgComponent component)
        => throw new NotSupportedException();
    public virtual void Remove(OrgComponent component)
        => throw new NotSupportedException();
}

// Leaf — 员工
public class Employee : OrgComponent
{
    public string Role { get; }
    public Employee(string name, string role) : base(name) => Role = role;

    public override int GetHeadCount() => 1;
    public override void Print(string indent = "")
        => Console.WriteLine($"{indent}👤 {Name} ({Role})");
}

// Composite — 部门
public class Department : OrgComponent
{
    private readonly List<OrgComponent> _children = new();
    public Department(string name) : base(name) { }

    public override void Add(OrgComponent component) => _children.Add(component);
    public override void Remove(OrgComponent component) => _children.Remove(component);

    public override int GetHeadCount() => _children.Sum(c => c.GetHeadCount());

    public override void Print(string indent = "")
    {
        Console.WriteLine($"{indent}📁 {Name} (人数: {GetHeadCount()})");
        foreach (var child in _children)
            child.Print(indent + "  ");
    }
}
```

```java [Java]
// Component
public abstract class OrgComponent {
    protected String name;
    protected OrgComponent(String name) { this.name = name; }

    public abstract int getHeadCount();
    public abstract void print(String indent);

    public void add(OrgComponent component) {
        throw new UnsupportedOperationException();
    }
    public void remove(OrgComponent component) {
        throw new UnsupportedOperationException();
    }
}

// Leaf — 员工
public class Employee extends OrgComponent {
    private String role;
    public Employee(String name, String role) {
        super(name);
        this.role = role;
    }

    @Override
    public int getHeadCount() { return 1; }

    @Override
    public void print(String indent) {
        System.out.printf("%s👤 %s (%s)%n", indent, name, role);
    }
}

// Composite — 部门
public class Department extends OrgComponent {
    private List<OrgComponent> children = new ArrayList<>();
    public Department(String name) { super(name); }

    @Override
    public void add(OrgComponent component) { children.add(component); }
    @Override
    public void remove(OrgComponent component) { children.remove(component); }

    @Override
    public int getHeadCount() {
        return children.stream().mapToInt(OrgComponent::getHeadCount).sum();
    }

    @Override
    public void print(String indent) {
        System.out.printf("%s📁 %s (人数: %d)%n", indent, name, getHeadCount());
        for (OrgComponent child : children) {
            child.print(indent + "  ");
        }
    }
}
```

:::

客户端调用：

::: code-group

```cs [C#]
var company = new Department("Acme 集团");

var techDept = new Department("技术部");
techDept.Add(new Employee("张三", "后端工程师"));
techDept.Add(new Employee("李四", "前端工程师"));

var aiTeam = new Department("AI 团队");
aiTeam.Add(new Employee("王五", "算法工程师"));
aiTeam.Add(new Employee("赵六", "数据工程师"));
techDept.Add(aiTeam);

var hrDept = new Department("人力资源部");
hrDept.Add(new Employee("孙七", "HRBP"));

company.Add(techDept);
company.Add(hrDept);

company.Print();
// 📁 Acme 集团 (人数: 5)
//   📁 技术部 (人数: 4)
//     👤 张三 (后端工程师)
//     👤 李四 (前端工程师)
//     📁 AI 团队 (人数: 2)
//       👤 王五 (算法工程师)
//       👤 赵六 (数据工程师)
//   📁 人力资源部 (人数: 1)
//     👤 孙七 (HRBP)
```

```java [Java]
Department company = new Department("Acme 集团");

Department techDept = new Department("技术部");
techDept.add(new Employee("张三", "后端工程师"));
techDept.add(new Employee("李四", "前端工程师"));

Department aiTeam = new Department("AI 团队");
aiTeam.add(new Employee("王五", "算法工程师"));
aiTeam.add(new Employee("赵六", "数据工程师"));
techDept.add(aiTeam);

Department hrDept = new Department("人力资源部");
hrDept.add(new Employee("孙七", "HRBP"));

company.add(techDept);
company.add(hrDept);

company.print("");
```

:::

## 4. 优缺点分析

### 优点
1. **统一接口**：客户端无需区分叶子和容器，用同一套代码处理整棵树。
2. **易于扩展**：新增节点类型（如"外包团队"）只需实现 Component 接口，符合开闭原则。
3. **递归结构天然契合**：树状数据的遍历、汇总、渲染等操作代码简洁优雅。

### 缺点
1. **类型约束弱**：透明式组合中叶子节点暴露了 `add/remove` 等不合理方法，需要运行时异常来防御。
2. **过度泛化**：非树形结构强行使用组合模式，反而增加理解和维护成本。

## 5. 相关模式对比

| 模式名称 | 相似点 | 核心区别 |
| :--- | :--- | :--- |
| **装饰器模式** | 都基于递归组合 | 装饰器为对象动态增加职责；组合模式构建"部分-整体"树形结构。 |
| **迭代器模式** | 常搭配使用 | 迭代器可用于遍历组合模式生成的树结构。 |
| **访问者模式** | 常搭配使用 | 访问者可对组合树中的各类节点执行不同操作，避免在 Component 中堆积方法。 |

## 6. 总结与思考

**核心思想**

*   组合模式的"魂"是**树形递归 + 统一接口** —— 让客户端不关心处理的是一个"叶子"还是一整棵"子树"，用同样的方式对待它们。

**实际应用**

*   **React / Vue 组件树**：前端框架的组件模型本质是组合模式 —— 一个组件可以包含子组件或纯 DOM 元素，渲染引擎递归遍历整棵虚拟 DOM 树。
*   **ASP.NET Core Middleware Pipeline**：中间件可嵌套、组合，形成处理管道。
*   **MyBatis `SqlNode`**：动态 SQL 的 `<if>`、`<foreach>`、`<choose>` 等标签被解析为 `SqlNode` 树，`MixedSqlNode` 是 Composite，`TextSqlNode` 是 Leaf。
