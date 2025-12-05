"""
Authentication module for user registration and login
"""
from bson import ObjectId
from datetime import datetime
import bcrypt
import jwt
import os

class AuthService:
    def __init__(self, users_collection, secret_key):
        self.users_collection = users_collection
        self.secret_key = secret_key
    
    @staticmethod
    def hash_password(password):
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt)
    
    @staticmethod
    def verify_password(password, hashed_password):
        """Verify password against hashed password"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password)
    
    def generate_token(self, user_id):
        """Generate JWT token"""
        payload = {
            'user_id': str(user_id),
            'iat': datetime.utcnow()
        }
        token = jwt.encode(payload, self.secret_key, algorithm='HS256')
        return token
    
    def verify_token(self, token):
        """Verify JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
            return payload.get('user_id')
        except jwt.InvalidTokenError:
            return None
    
    def register_user(self, name, email, password):
        """Register a new user"""
        # Check if user already exists
        if self.users_collection.find_one({'email': email}):
            return {'success': False, 'message': 'User already exists'}, 409
        
        # Create new user
        hashed_password = self.hash_password(password)
        user = {
            'name': name,
            'email': email,
            'password': hashed_password,
            'created_at': datetime.utcnow()
        }
        
        result = self.users_collection.insert_one(user)
        user_id = result.inserted_id
        
        # Generate token
        token = self.generate_token(user_id)
        
        return {
            'success': True,
            'token': token,
            'user': {
                'id': str(user_id),
                'name': name,
                'email': email
            }
        }, 201
    
    def login_user(self, email, password):
        """Login user"""
        # Find user
        user = self.users_collection.find_one({'email': email})
        
        if not user:
            return {'success': False, 'message': 'Invalid email or password'}, 401
        
        # Verify password
        if not self.verify_password(password, user['password']):
            return {'success': False, 'message': 'Invalid email or password'}, 401
        
        # Generate token
        token = self.generate_token(user['_id'])
        
        return {
            'success': True,
            'token': token,
            'user': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email']
            }
        }, 200
    
    def get_user_by_id(self, user_id):
        """Get user by ID"""
        try:
            user = self.users_collection.find_one({'_id': ObjectId(user_id)})
            if user:
                return {
                    'id': str(user['_id']),
                    'name': user['name'],
                    'email': user['email'],
                    'created_at': user.get('created_at')
                }
            return None
        except Exception as e:
            print(f"Error getting user: {e}")
            return None
