"""
Simple caching service for recommendations.
Uses in-memory cache with TTL.
"""

from typing import Optional, Any
from datetime import datetime, timedelta
from functools import wraps
import hashlib
import json

# Simple in-memory cache
_cache = {}
_cache_ttl = timedelta(minutes=30)  # Cache for 30 minutes


def get_cache_key(*args, **kwargs) -> str:
    """Generate cache key from function arguments."""
    key_data = {
        'args': args,
        'kwargs': kwargs
    }
    key_str = json.dumps(key_data, sort_keys=True, default=str)
    return hashlib.md5(key_str.encode()).hexdigest()


def cached(ttl_seconds: int = 1800):
    """
    Decorator for caching function results.
    
    Args:
        ttl_seconds: Time to live in seconds (default: 30 minutes)
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = f"{func.__name__}:{get_cache_key(*args, **kwargs)}"
            
            # Check cache
            if cache_key in _cache:
                cached_value, cached_time = _cache[cache_key]
                age = datetime.now() - cached_time
                
                if age.total_seconds() < ttl_seconds:
                    return cached_value
            
            # Call function and cache result
            result = func(*args, **kwargs)
            _cache[cache_key] = (result, datetime.now())
            
            return result
        
        return wrapper
    return decorator


def clear_cache(pattern: Optional[str] = None):
    """
    Clear cache entries.
    
    Args:
        pattern: Optional pattern to match keys (if None, clears all)
    """
    if pattern:
        keys_to_remove = [key for key in _cache.keys() if pattern in key]
        for key in keys_to_remove:
            del _cache[key]
        return len(keys_to_remove)
    else:
        count = len(_cache)
        _cache.clear()
        return count


def get_cache_stats() -> dict:
    """Get cache statistics."""
    return {
        'size': len(_cache),
        'keys': list(_cache.keys())[:10]  # First 10 keys as sample
    }

