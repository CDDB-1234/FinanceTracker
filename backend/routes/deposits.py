"""
Routes for deposit management
"""
from flask import Blueprint, request, jsonify
from services.deposit_service import DepositService

deposit_bp = Blueprint('deposits', __name__, url_prefix='/api/deposits')

def create_deposit_routes(deposits_collection, matured_deposits_collection=None):
    """Create deposit routes"""
    deposit_service = DepositService(deposits_collection, matured_deposits_collection)
    
    @deposit_bp.route('', methods=['POST'])
    def create_deposit():
        """Create a new deposit"""
        try:
            from flask import request
            user_id = getattr(request, 'user_id', None)
            user_name = getattr(request, 'user_name', 'System')
            
            if not user_id:
                return jsonify({'message': 'Unauthorized'}), 401
            
            data = request.get_json()
            
            if not data:
                return jsonify({'message': 'No data provided'}), 400
            
            result, status_code = deposit_service.create_deposit(user_id, data, user_name)
            return jsonify(result), status_code
            
        except Exception as e:
            return jsonify({'message': f'Error: {str(e)}'}), 500
    
    @deposit_bp.route('/<deposit_id>', methods=['GET'])
    def get_deposit(deposit_id):
        """Get a single deposit"""
        try:
            from flask import request
            user_id = getattr(request, 'user_id', None)
            
            if not user_id:
                return jsonify({'message': 'Unauthorized'}), 401
            
            result, status_code = deposit_service.get_deposit(user_id, deposit_id)
            return jsonify(result), status_code
            
        except Exception as e:
            return jsonify({'message': f'Error: {str(e)}'}), 500
    
    @deposit_bp.route('', methods=['GET'])
    def get_all_deposits():
        """Get all deposits for user with optional filters"""
        try:
            from flask import request
            user_id = getattr(request, 'user_id', None)
            
            if not user_id:
                return jsonify({'message': 'Unauthorized'}), 401
            
            page = request.args.get('page', 1, type=int)
            limit = request.args.get('limit', 10, type=int)
            
            # Get filter parameters
            filters = {
                'investment_account_type': request.args.get('investment_account_type'),
                'bank': request.args.get('bank'),
                'account_status': request.args.get('account_status'),
                'account_holder': request.args.get('account_holder'),
                'start_date': request.args.get('start_date'),
                'maturity_date': request.args.get('maturity_date')
            }
            
            result, status_code = deposit_service.get_all_deposits_with_filters(user_id, page, limit, filters)
            return jsonify(result), status_code
            
        except Exception as e:
            return jsonify({'message': f'Error: {str(e)}'}), 500
    
    @deposit_bp.route('/filter/options', methods=['GET'])
    def get_filter_options():
        """Get available filter options"""
        try:
            from flask import request
            user_id = getattr(request, 'user_id', None)
            
            if not user_id:
                return jsonify({'message': 'Unauthorized'}), 401
            
            result, status_code = deposit_service.get_filter_options(user_id)
            return jsonify(result), status_code
            
        except Exception as e:
            return jsonify({'message': f'Error: {str(e)}'}), 500
    
    @deposit_bp.route('/<deposit_id>', methods=['PUT'])
    def update_deposit(deposit_id):
        """Update a deposit"""
        try:
            from flask import request
            user_id = getattr(request, 'user_id', None)
            user_name = getattr(request, 'user_name', 'System')
            
            if not user_id:
                return jsonify({'message': 'Unauthorized'}), 401
            
            data = request.get_json()
            
            if not data:
                return jsonify({'message': 'No data provided'}), 400
            
            result, status_code = deposit_service.update_deposit(user_id, deposit_id, data, user_name)
            return jsonify(result), status_code
            
        except Exception as e:
            return jsonify({'message': f'Error: {str(e)}'}), 500
    
    @deposit_bp.route('/<deposit_id>', methods=['DELETE'])
    def delete_deposit(deposit_id):
        """Delete a deposit"""
        try:
            from flask import request
            user_id = getattr(request, 'user_id', None)
            
            if not user_id:
                return jsonify({'message': 'Unauthorized'}), 401
            
            result, status_code = deposit_service.delete_deposit(user_id, deposit_id)
            return jsonify(result), status_code
            
        except Exception as e:
            return jsonify({'message': f'Error: {str(e)}'}), 500
    
    @deposit_bp.route('/summary', methods=['GET'])
    def get_summary():
        """Get deposit summary"""
        try:
            from flask import request
            user_id = getattr(request, 'user_id', None)
            
            if not user_id:
                return jsonify({'message': 'Unauthorized'}), 401
            
            result, status_code = deposit_service.get_deposit_summary(user_id)
            return jsonify(result), status_code
            
        except Exception as e:
            return jsonify({'message': f'Error: {str(e)}'}), 500
    
    @deposit_bp.route('/summary/by-holder', methods=['GET'])
    def get_summary_by_holder():
        """Get deposit summary grouped by account holder"""
        try:
            from flask import request
            user_id = getattr(request, 'user_id', None)
            
            if not user_id:
                return jsonify({'message': 'Unauthorized'}), 401
            
            result, status_code = deposit_service.get_deposit_summary_by_holder(user_id)
            return jsonify(result), status_code
            
        except Exception as e:
            return jsonify({'message': f'Error: {str(e)}'}), 500
    
    return deposit_bp
