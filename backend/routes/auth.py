"""
Routes for authentication endpoints
"""
from flask import Blueprint, request, jsonify
from services.auth_service import AuthService

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

def create_auth_routes(users_collection, secret_key):
    """Create authentication routes"""
    auth_service = AuthService(users_collection, secret_key)
    
    @auth_bp.route('/register', methods=['POST'])
    def register():
        """Register a new user"""
        try:
            data = request.get_json()
            
            # Validate input
            if not data.get('name') or not data.get('email') or not data.get('password'):
                return jsonify({'message': 'Missing required fields'}), 400
            
            if len(data['password']) < 6:
                return jsonify({'message': 'Password must be at least 6 characters'}), 400
            
            result, status_code = auth_service.register_user(
                data['name'],
                data['email'],
                data['password']
            )
            
            return jsonify(result), status_code
            
        except Exception as e:
            return jsonify({'message': f'Error: {str(e)}'}), 500
    
    @auth_bp.route('/login', methods=['POST'])
    def login():
        """Login user"""
        try:
            data = request.get_json()
            
            # Validate input
            if not data.get('email') or not data.get('password'):
                return jsonify({'message': 'Missing email or password'}), 400
            
            result, status_code = auth_service.login_user(
                data['email'],
                data['password']
            )
            
            return jsonify(result), status_code
            
        except Exception as e:
            return jsonify({'message': f'Error: {str(e)}'}), 500
    
    @auth_bp.route('/verify', methods=['GET'])
    def verify():
        """Verify token"""
        try:
            token = request.headers.get('Authorization')
            
            if not token:
                return jsonify({'message': 'Token is missing'}), 401
            
            try:
                token = token.split(' ')[1]
            except IndexError:
                return jsonify({'message': 'Invalid token format'}), 401
            
            user_id = auth_service.verify_token(token)
            if not user_id:
                return jsonify({'message': 'Invalid token'}), 401
            
            user = auth_service.get_user_by_id(user_id)
            if user:
                return jsonify({'user': user}), 200
            
            return jsonify({'message': 'User not found'}), 404
        except Exception as e:
            return jsonify({'message': f'Error: {str(e)}'}), 500
    
    return auth_bp
