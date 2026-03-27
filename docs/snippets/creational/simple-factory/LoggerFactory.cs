// Abstract Product
public interface ILogger
{
    void Log(string message);
}

// Concrete Product A
public class FileLogger : ILogger
{
    public void Log(string message) => Console.WriteLine($"[File] {message}");
}

// Concrete Product B
public class DatabaseLogger : ILogger
{
    public void Log(string message) => Console.WriteLine($"[DB] {message}");
}

// Simple Factory
public static class LoggerFactory
{
    public static ILogger CreateLogger(string type) => type.ToUpper() switch
    {
        "FILE" => new FileLogger(), // [!code highlight]
        "DB" => new DatabaseLogger(), // [!code highlight]
        _ => throw new ArgumentException("Invalid type")
    };
}
