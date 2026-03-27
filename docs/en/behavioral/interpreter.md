# Interpreter Pattern

## Real-World Example

Java's regular expression processing embodies the Interpreter pattern. The `Pattern` class compiles a regex into an abstract syntax tree, and the `Matcher` class acts as an interpreter that matches strings based on that tree.

## Definition

> **Interpreter Pattern**: Given a language, **define a representation for its grammar** along with an interpreter that uses the representation to **interpret sentences** in the language.

Use cases:
- When a language needs to be interpreted, and sentences can be represented as an abstract syntax tree.
- When the grammar is simple and suitable for straightforward implementation.

## Roles

- **Abstract Expression**: Declares an `interpret()` method that all concrete expressions implement.
- **Terminal Expression**: Implements interpretation for terminal symbols (leaves of the syntax tree).
- **Nonterminal Expression**: Implements interpretation for grammar rules (operators, keywords, etc.).
- **Context**: Contains global information external to the interpreter.

## Example Code

```java
import java.util.HashMap;
import java.util.Map;

class Context {
    private final Map<String, Integer> variables;

    public Context() {
        variables = new HashMap<>();
    }

    public int get(String name) {
        return variables.get(name);
    }

    public void set(String name, int value) {
        variables.put(name, value);
    }
}

interface Expression {
    int interpret(Context context);
}

// Terminal Expression
class Number implements Expression {
    private final String name;

    public Number(String name) {
        this.name = name;
    }

    public int interpret(Context context) {
        return context.get(name);
    }
}

// Nonterminal Expression - Addition
class Add implements Expression {
    private final Expression left;
    private final Expression right;

    public Add(Expression left, Expression right) {
        this.left = left;
        this.right = right;
    }

    public int interpret(Context context) {
        return left.interpret(context) + right.interpret(context);
    }
}

// Nonterminal Expression - Subtraction
class Subtract implements Expression {
    private final Expression left;
    private final Expression right;

    public Subtract(Expression left, Expression right) {
        this.left = left;
        this.right = right;
    }

    public int interpret(Context context) {
        return left.interpret(context) - right.interpret(context);
    }
}

public class Client {
    public static void main(String[] args) {
        Context context = new Context();
        context.set("a", 5);
        context.set("b", 3);

        Expression addExpr = new Add(new Number("a"), new Number("b"));
        System.out.println("a + b = " + addExpr.interpret(context));

        Expression subExpr = new Subtract(new Number("a"), new Number("b"));
        System.out.println("a - b = " + subExpr.interpret(context));
    }
}
```

Output:

```
a + b = 8
a - b = 2
```

## Summary

The Interpreter pattern is best suited for simple grammars. For complex grammars, the class hierarchy becomes unwieldy — parser generators are a better choice. It may also cause class proliferation due to the number of expression classes needed. Use it when efficiency is not critical and the grammar can be easily changed or extended with minimal cost.
