---
title: Composite Pattern
description: Compose objects into tree structures to represent part-whole hierarchies, letting clients treat individual and composite objects uniformly.
---

# Composite Pattern

::: tip Definition
Compose objects into **tree structures** to represent part-whole hierarchies. The Composite pattern lets clients treat individual objects and compositions of objects **uniformly**.
:::

## 1. Intent

**What problem does it solve?**
*   Systems contain tree-like hierarchies (org charts, permission menus, file systems), and clients need to traverse and operate on leaf and container nodes uniformly.
*   Without the pattern, client code is littered with `if-else` type checks to distinguish between leaves and containers.

**Example scenarios**
*   ✅ Scenario A: A **permission menu tree** in an admin dashboard — menu groups (can contain sub-menus) and menu items (leaves, mapping to pages) share a common interface.
*   ✅ Scenario B: An e-commerce **product category hierarchy** — "Electronics > Phones > Foldable Phones"; any level can compute total product count.
*   ❌ Anti-pattern: If the structure is a flat list rather than a tree, Composite adds unnecessary complexity.

## 2. Structure

### UML Class Diagram

> ![Composite](../images/a057f74449982952b54ba4ffb561acfb.png)

### Roles & Responsibilities
| Role | Name | Responsibility |
| :--- | :--- | :--- |
| **Component** | Component Interface | Declares a unified operation interface for both leaves and composites. |
| **Leaf** | Leaf Node | End node with no children; implements actual business logic. |
| **Composite** | Composite Node | Holds a collection of child Components; delegates operations recursively. |

### Collaboration Flow
1. Client invokes an operation through the Component interface.
2. If it's a Leaf, execute directly.
3. If it's a Composite, iterate over children and recursively invoke the same operation on each.

## 3. Code Example

> **Scenario**: An **enterprise org chart** — a company has departments, departments have teams or employees. We need to recursively count headcount and print the org tree.

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

// Leaf — Employee
public class Employee : OrgComponent
{
    public string Role { get; }
    public Employee(string name, string role) : base(name) => Role = role;

    public override int GetHeadCount() => 1;
    public override void Print(string indent = "")
        => Console.WriteLine($"{indent}👤 {Name} ({Role})");
}

// Composite — Department
public class Department : OrgComponent
{
    private readonly List<OrgComponent> _children = new();
    public Department(string name) : base(name) { }

    public override void Add(OrgComponent component) => _children.Add(component);
    public override void Remove(OrgComponent component) => _children.Remove(component);

    public override int GetHeadCount() => _children.Sum(c => c.GetHeadCount());

    public override void Print(string indent = "")
    {
        Console.WriteLine($"{indent}📁 {Name} (headcount: {GetHeadCount()})");
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

// Leaf — Employee
public class Employee extends OrgComponent {
    private String role;
    public Employee(String name, String role) {
        super(name);
        this.role = role;
    }

    @Override public int getHeadCount() { return 1; }

    @Override
    public void print(String indent) {
        System.out.printf("%s👤 %s (%s)%n", indent, name, role);
    }
}

// Composite — Department
public class Department extends OrgComponent {
    private List<OrgComponent> children = new ArrayList<>();
    public Department(String name) { super(name); }

    @Override public void add(OrgComponent component) { children.add(component); }
    @Override public void remove(OrgComponent component) { children.remove(component); }

    @Override
    public int getHeadCount() {
        return children.stream().mapToInt(OrgComponent::getHeadCount).sum();
    }

    @Override
    public void print(String indent) {
        System.out.printf("%s📁 %s (headcount: %d)%n", indent, name, getHeadCount());
        for (OrgComponent child : children) {
            child.print(indent + "  ");
        }
    }
}
```

:::

Client usage:

::: code-group

```cs [C#]
var company = new Department("Acme Corp");

var techDept = new Department("Engineering");
techDept.Add(new Employee("Alice", "Backend Engineer"));
techDept.Add(new Employee("Bob", "Frontend Engineer"));

var aiTeam = new Department("AI Team");
aiTeam.Add(new Employee("Charlie", "ML Engineer"));
aiTeam.Add(new Employee("Diana", "Data Engineer"));
techDept.Add(aiTeam);

var hrDept = new Department("Human Resources");
hrDept.Add(new Employee("Eve", "HRBP"));

company.Add(techDept);
company.Add(hrDept);

company.Print();
// 📁 Acme Corp (headcount: 5)
//   📁 Engineering (headcount: 4)
//     👤 Alice (Backend Engineer)
//     👤 Bob (Frontend Engineer)
//     📁 AI Team (headcount: 2)
//       👤 Charlie (ML Engineer)
//       👤 Diana (Data Engineer)
//   📁 Human Resources (headcount: 1)
//     👤 Eve (HRBP)
```

```java [Java]
Department company = new Department("Acme Corp");

Department techDept = new Department("Engineering");
techDept.add(new Employee("Alice", "Backend Engineer"));
techDept.add(new Employee("Bob", "Frontend Engineer"));

Department aiTeam = new Department("AI Team");
aiTeam.add(new Employee("Charlie", "ML Engineer"));
aiTeam.add(new Employee("Diana", "Data Engineer"));
techDept.add(aiTeam);

Department hrDept = new Department("Human Resources");
hrDept.add(new Employee("Eve", "HRBP"));

company.add(techDept);
company.add(hrDept);

company.print("");
```

:::

## 4. Pros & Cons

### Pros
1. **Uniform interface**: Clients don't need to distinguish between leaves and composites.
2. **Easy to extend**: Adding new node types (e.g., "Contractor Team") only requires implementing the Component interface.
3. **Natural recursive fit**: Traversal, aggregation, and rendering of tree data becomes clean and elegant.

### Cons
1. **Weak type constraints**: In the transparent approach, leaves expose inappropriate `add/remove` methods, requiring runtime exceptions.
2. **Over-generalization**: Forcing Composite on non-tree structures adds unnecessary complexity.

## 5. Related Patterns

| Pattern | Similarity | Key Difference |
| :--- | :--- | :--- |
| **Decorator** | Both use recursive composition | Decorator adds responsibilities dynamically; Composite builds part-whole tree structures. |
| **Iterator** | Often used together | Iterator can traverse the tree structure built by Composite. |
| **Visitor** | Often used together | Visitor can perform different operations on different node types in a Composite tree. |

## 6. Summary

**Core Idea**

*   The Composite pattern is about **recursive trees + uniform interface** — clients don't care whether they're dealing with a single leaf or an entire subtree; they treat both the same way.

**Real-World Applications**

*   **React / Vue Component Tree**: Frontend component models are essentially Composite — a component can contain child components or plain DOM elements, and the rendering engine recursively traverses the virtual DOM tree.
*   **ASP.NET Core Middleware Pipeline**: Middleware can be nested and composed into a processing pipeline.
*   **MyBatis `SqlNode`**: Dynamic SQL tags (`<if>`, `<foreach>`, `<choose>`) are parsed into a `SqlNode` tree — `MixedSqlNode` is the Composite, `TextSqlNode` is the Leaf.
