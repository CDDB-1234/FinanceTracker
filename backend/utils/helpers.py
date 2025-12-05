"""
Utility functions for the application
"""
import re
from datetime import datetime

def is_valid_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def is_valid_password(password):
    """Validate password strength"""
    if len(password) < 6:
        return False, "Password must be at least 6 characters"
    if not any(char.isdigit() for char in password):
        return False, "Password must contain at least one digit"
    if not any(char.isupper() for char in password):
        return False, "Password must contain at least one uppercase letter"
    return True, "Password is valid"

def format_date(date):
    """Format date to readable string"""
    if isinstance(date, datetime):
        return date.strftime('%B %d, %Y')
    return str(date)

def get_error_message(error):
    """Extract error message from exception"""
    if hasattr(error, 'args') and error.args:
        return str(error.args[0])
    return str(error)
