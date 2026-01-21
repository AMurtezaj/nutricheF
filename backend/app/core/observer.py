"""
Observer pattern implementation for event management.

This module demonstrates the Observer design pattern by providing
an event system where observers can subscribe to and be notified of events.
"""
from typing import Dict, List, Callable, Any
from abc import ABC, abstractmethod
from threading import Lock


class Observer(ABC):
    """
    Abstract Observer interface.
    
    Design Pattern: Observer
    Purpose: Defines the interface for objects that should be notified
             of changes in a subject.
    """
    
    @abstractmethod
    def update(self, event_type: str, data: Any) -> None:
        """
        Called when the observed subject changes.
        
        Args:
            event_type: Type of event that occurred
            data: Event data
        """
        pass


class EventManager:
    """
    Event manager implementing the Observer pattern.
    
    Design Pattern: Observer (Subject)
    Purpose: Manages observers and notifies them of events.
             Allows loose coupling between components.
    
    Benefits:
    - Loose coupling: Publishers don't need to know about subscribers
    - Dynamic relationships: Observers can subscribe/unsubscribe at runtime
    - Broadcast communication: One event can notify multiple observers
    
    Usage:
        event_manager = EventManager()
        event_manager.subscribe("meal_rated", my_observer)
        event_manager.notify("meal_rated", {"meal_id": 1, "rating": 5})
    """
    
    _instance = None
    _lock: Lock = Lock()
    
    def __new__(cls):
        """Implement Singleton pattern for EventManager."""
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(EventManager, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        """Initialize the event manager."""
        if not hasattr(self, '_initialized'):
            self._observers: Dict[str, List[Callable]] = {}
            self._initialized = True
    
    def subscribe(self, event_type: str, observer: Callable[[str, Any], None]) -> None:
        """
        Subscribe an observer to an event type.
        
        Args:
            event_type: Type of event to subscribe to
            observer: Callable that will be notified (can be function or Observer.update)
        """
        if event_type not in self._observers:
            self._observers[event_type] = []
        
        if observer not in self._observers[event_type]:
            self._observers[event_type].append(observer)
    
    def unsubscribe(self, event_type: str, observer: Callable[[str, Any], None]) -> None:
        """
        Unsubscribe an observer from an event type.
        
        Args:
            event_type: Type of event to unsubscribe from
            observer: Observer to remove
        """
        if event_type in self._observers:
            if observer in self._observers[event_type]:
                self._observers[event_type].remove(observer)
    
    def notify(self, event_type: str, data: Any = None) -> None:
        """
        Notify all observers of an event.
        
        Args:
            event_type: Type of event that occurred
            data: Optional event data to pass to observers
        """
        if event_type in self._observers:
            for observer in self._observers[event_type]:
                try:
                    observer(event_type, data)
                except Exception as e:
                    # Log error but continue notifying other observers
                    print(f"Error notifying observer: {e}")
    
    def get_observer_count(self, event_type: str) -> int:
        """
        Get the number of observers for an event type.
        
        Args:
            event_type: Event type to check
            
        Returns:
            Number of observers subscribed to this event
        """
        return len(self._observers.get(event_type, []))
    
    def clear_observers(self, event_type: str = None) -> None:
        """
        Clear observers for a specific event type or all events.
        
        Args:
            event_type: Event type to clear, or None to clear all
        """
        if event_type:
            self._observers[event_type] = []
        else:
            self._observers = {}


class MealRatingObserver(Observer):
    """
    Concrete observer for meal rating events.
    
    Example implementation of the Observer pattern.
    This observer updates meal statistics when ratings change.
    """
    
    def update(self, event_type: str, data: Any) -> None:
        """
        Handle meal rating events.
        
        Args:
            event_type: Should be "meal_rated"
            data: Dictionary with meal_id, user_id, rating
        """
        if event_type == "meal_rated":
            meal_id = data.get("meal_id")
            rating = data.get("rating")
            print(f"MealRatingObserver: Meal {meal_id} rated {rating}")
            # In a real implementation, this would update analytics, cache, etc.


class NotificationObserver(Observer):
    """
    Concrete observer for sending notifications.
    
    Example implementation that could send emails or push notifications.
    """
    
    def update(self, event_type: str, data: Any) -> None:
        """
        Handle notification events.
        
        Args:
            event_type: Type of event
            data: Event data
        """
        print(f"NotificationObserver: Event '{event_type}' occurred with data: {data}")
        # In a real implementation, this would send actual notifications


# Export observer components
__all__ = [
    "Observer",
    "EventManager",
    "MealRatingObserver",
    "NotificationObserver"
]
