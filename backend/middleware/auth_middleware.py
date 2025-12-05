"""
Middleware for authentication
"""
from functools import wraps
from flask import request, jsonify
import jwt

def token_required(secret_key):
    """Decorator to verify JWT token"""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = request.headers.get('Authorization')
            
            if not token:
                return jsonify({'message': 'Token is missing'}), 401
            
            try:
                token = token.split(' ')[1]
            except IndexError:
                return jsonify({'message': 'Invalid token format'}), 401
            
            try:
                payload = jwt.decode(token, secret_key, algorithms=['HS256'])
                request.user_id = payload.get('user_id')
            except jwt.InvalidTokenError:
                return jsonify({'message': 'Invalid token'}), 401
            
            return f(*args, **kwargs)
        
        return decorated
    return decorator
