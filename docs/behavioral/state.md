# State Pattern

## Real-World Example

In Java's `Thread` class, thread states (New, Runnable, Running, Blocked, Terminated) are managed through the State pattern. State transitions are controlled automatically by the system — you just call methods like `start()`, `join()`, `sleep()`, etc.

## Definition

> **State Pattern**: Allow an object to **alter its behavior when its internal state changes**. The object will appear to change its class.

When an object's behavior depends on dynamically changing properties (states), and the object transitions between predefined states in response to external events, the State pattern is useful.

Example: A bank account can be in Normal, Overdrawn, or Restricted states. Deposit and withdrawal operations behave differently depending on the current state, and the account transitions between states accordingly.

## Roles

1. **Context**: Defines the client interface and maintains a reference to the current State instance.
2. **State (Abstract)**: Defines an interface encapsulating behavior associated with a particular state.
3. **Concrete State**: Implements state-specific behavior.

## Example Code

```java
interface TrafficLightState {
    void handle(TrafficLight trafficLight);
}

class RedLightState implements TrafficLightState {
    @Override
    public void handle(TrafficLight trafficLight) {
        System.out.println("Red light — stop");
        trafficLight.setState(new YellowLightState());
    }
}

class YellowLightState implements TrafficLightState {
    @Override
    public void handle(TrafficLight trafficLight) {
        System.out.println("Yellow light — prepare");
        trafficLight.setState(new GreenLightState());
    }
}

class GreenLightState implements TrafficLightState {
    @Override
    public void handle(TrafficLight trafficLight) {
        System.out.println("Green light — go");
        trafficLight.setState(new RedLightState());
    }
}

class TrafficLight {
    private TrafficLightState state;

    public TrafficLight() {
        this.state = new RedLightState();
    }

    public void setState(TrafficLightState state) {
        this.state = state;
    }

    public void request() {
        state.handle(this);
    }
}

public class Client {
    public static void main(String[] args) {
        TrafficLight trafficLight = new TrafficLight();
        for (int i = 0; i < 3; i++) {
            trafficLight.request();
        }
    }
}
```

## Summary

The State pattern encapsulates transition rules and enumerates possible states, making them visible in the class structure. It organizes state-specific code effectively and avoids large conditional statements.

Downsides: Many states can lead to a large number of state classes, increasing system complexity.
