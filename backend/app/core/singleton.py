"""
Singleton pattern implementation for database session management.

This module demonstrates the Singleton design pattern by ensuring only
one instance of the DatabaseSessionManager exists throughout the application.
"""
from typing import Optional
from sqlalchemy.orm import Session
from threading import Lock


class DatabaseSessionManager:
    """
    Singleton class for managing database sessions.
    
    Design Pattern: Singleton
    Purpose: Ensures only one instance of the session manager exists,
             providing a global point of access to database session management.
    
    Benefits:
    - Controlled access: Single instance manages all database sessions
    - Resource efficiency: Prevents multiple session managers
    - Thread-safe: Uses locking mechanism for thread safety
    
    Usage:
        manager = DatabaseSessionManager()
        session = manager.get_session()
    """
    
    _instance: Optional['DatabaseSessionManager'] = None
    _lock: Lock = Lock()
    _initialized: bool = False
    
    def __new__(cls):
        """
        Override __new__ to implement Singleton pattern.
        
        This ensures that only one instance of DatabaseSessionManager
        is created, even when called multiple times.
        """
        if cls._instance is None:
            with cls._lock:
                # Double-checked locking pattern
                if cls._instance is None:
                    cls._instance = super(DatabaseSessionManager, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        """
        Initialize the DatabaseSessionManager.
        
        Only runs once due to Singleton pattern.
        """
        # Prevent re-initialization
        if DatabaseSessionManager._initialized:
            return
        
        with DatabaseSessionManager._lock:
            if not DatabaseSessionManager._initialized:
                self._session: Optional[Session] = None
                self._connection_count: int = 0
                DatabaseSessionManager._initialized = True
    
    def set_session(self, session: Session) -> None:
        """
        Set the current database session.
        
        Args:
            session: SQLAlchemy session to manage
        """
        self._session = session
        self._connection_count += 1
    
    def get_session(self) -> Optional[Session]:
        """
        Get the current database session.
        
        Returns:
            Current SQLAlchemy session or None
        """
        return self._session
    
    def close_session(self) -> None:
        """Close the current database session."""
        if self._session:
            self._session.close()
            self._session = None
    
    def get_connection_count(self) -> int:
        """
        Get the total number of connections made.
        
        Returns:
            Total connection count
        """
        return self._connection_count
    
    @classmethod
    def reset_instance(cls) -> None:
        """
        Reset the singleton instance.
        
        WARNING: This should only be used for testing purposes.
        """
        with cls._lock:
            cls._instance = None
            cls._initialized = False


class ConfigurationManager:
    """
    Singleton class for managing application configuration.
    
    Design Pattern: Singleton
    Purpose: Provides a single point of access to application configuration.
    
    This is another example of the Singleton pattern in the application.
    """
    
    _instance: Optional['ConfigurationManager'] = None
    _lock: Lock = Lock()
    _initialized: bool = False
    
    def __new__(cls):
        """Implement Singleton pattern."""
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(ConfigurationManager, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        """Initialize configuration manager."""
        if ConfigurationManager._initialized:
            return
        
        with ConfigurationManager._lock:
            if not ConfigurationManager._initialized:
                self._config: dict = {}
                ConfigurationManager._initialized = True
    
    def set_config(self, key: str, value: any) -> None:
        """Set a configuration value."""
        self._config[key] = value
    
    def get_config(self, key: str, default: any = None) -> any:
        """Get a configuration value."""
        return self._config.get(key, default)
    
    def get_all_config(self) -> dict:
        """Get all configuration values."""
        return self._config.copy()
    
    @classmethod
    def reset_instance(cls) -> None:
        """Reset singleton instance (for testing)."""
        with cls._lock:
            cls._instance = None
            cls._initialized = False


# Export singletons
__all__ = ["DatabaseSessionManager", "ConfigurationManager"]
