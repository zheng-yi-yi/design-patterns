// Abstract Product
interface Logger {
    void log(String message);
}

// Concrete Product A
class FileLogger implements Logger {
    public void log(String message) {
        System.out.println("Logging to file: " + message);
    }
}

// Concrete Product B
class DatabaseLogger implements Logger {
    public void log(String message) {
        System.out.println("Logging to database: " + message);
    }
}

// Simple Factory
class LoggerFactory {
    public static Logger createLogger(String type) {
        if ("FILE".equalsIgnoreCase(type)) { // [!code highlight]
            return new FileLogger();
        } else if ("DB".equalsIgnoreCase(type)) { // [!code highlight]
            return new DatabaseLogger();
        }
        throw new IllegalArgumentException("Unknown logger type");
    }
}
