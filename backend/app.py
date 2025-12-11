from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import os
import sys
from datetime import datetime
import jwt
import bcrypt

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=['http://localhost:3000', 'http://localhost:3001'])

# Add after_request handler for CORS headers
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
DB_NAME = os.getenv('DB_NAME', 'finance_tracker')

# MongoDB connection
try:
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    users_collection = db['users']
    transactions_collection = db['transactions']
    deposits_collection = db['deposits']
    matured_deposits_collection = db['maturedDeposits']
    snapshots_collection = db['snapshots']
    users_collection.create_index('email', unique=True)
    print(f"✓ Connected to MongoDB database: {DB_NAME}")
except Exception as e:
    print(f"✗ Error connecting to MongoDB: {e}")
    sys.exit(1)

# Helper functions
def hash_password(password):
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt)

def verify_password(password, hashed_password):
    """Verify password against hashed password"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password)

def generate_token(user_id):
    """Generate JWT token"""
    payload = {
        'user_id': str(user_id),
        'iat': datetime.utcnow()
    }
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    return token

def verify_token(token):
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload.get('user_id')
    except jwt.InvalidTokenError:
        return None

# Middleware to verify token
def token_required(f):
    from functools import wraps
    
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            token = token.split(' ')[1]  # Extract token from "Bearer <token>"
        except IndexError:
            return jsonify({'message': 'Invalid token format'}), 401
        
        user_id = verify_token(token)
        if not user_id:
            return jsonify({'message': 'Invalid token'}), 401
        
        request.user_id = user_id
        return f(*args, **kwargs)
    
    return decorated

# Routes

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate input
        if not data.get('name') or not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Missing required fields'}), 400
        
        # Check if user already exists
        if users_collection.find_one({'email': data['email']}):
            return jsonify({'message': 'User already exists'}), 409
        
        # Create new user
        hashed_password = hash_password(data['password'])
        user = {
            'name': data['name'],
            'email': data['email'],
            'password': hashed_password,
            'created_at': datetime.utcnow()
        }
        
        result = users_collection.insert_one(user)
        user_id = result.inserted_id
        
        # Generate token
        token = generate_token(user_id)
        
        return jsonify({
            'message': 'User registered successfully',
            'token': token,
            'user': {
                'id': str(user_id),
                'name': data['name'],
                'email': data['email']
            }
        }), 201
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        # Validate input
        if not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Missing email or password'}), 400
        
        # Find user
        user = users_collection.find_one({'email': data['email']})
        
        if not user:
            return jsonify({'message': 'Invalid email or password'}), 401
        
        # Verify password
        if not verify_password(data['password'], user['password']):
            return jsonify({'message': 'Invalid email or password'}), 401
        
        # Generate token
        token = generate_token(user['_id'])
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email']
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/auth/verify', methods=['GET'])
@token_required
def verify_auth():
    """Verify if user is authenticated"""
    try:
        user = users_collection.find_one({'_id': ObjectId(request.user_id)})
        if user:
            return jsonify({
                'user': {
                    'id': str(user['_id']),
                    'name': user['name'],
                    'email': user['email']
                }
            }), 200
        return jsonify({'message': 'User not found'}), 404
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# Import and register deposit routes
from routes.deposits import create_deposit_routes
from middleware.auth_middleware import token_required as token_required_middleware

# Apply token middleware to deposit and snapshot routes
@app.before_request
def before_request():
    """Check token for protected routes"""
    # Handle CORS preflight requests
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    
    if request.path.startswith('/api/deposits') or request.path.startswith('/api/snapshots'):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            token = token.split(' ')[1]
        except IndexError:
            return jsonify({'message': 'Invalid token format'}), 401
        
        user_id = verify_token(token)
        if not user_id:
            return jsonify({'message': 'Invalid token'}), 401
        
        # Fetch user details to get the name
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        if user:
            request.user_id = user_id
            request.user_name = user.get('name', 'System')
        else:
            request.user_id = user_id
            request.user_name = 'System'

deposit_bp = create_deposit_routes(deposits_collection, matured_deposits_collection)
app.register_blueprint(deposit_bp)

# Register snapshot routes
from routes.snapshots import create_snapshot_routes
snapshot_bp = create_snapshot_routes(snapshots_collection, deposits_collection)
app.register_blueprint(snapshot_bp)

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'message': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'message': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
