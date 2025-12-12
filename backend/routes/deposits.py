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
    
    @deposit_bp.route('/summary/by-bank-holder', methods=['GET'])
    def get_summary_by_bank_holder():
        """Get deposit summary grouped by bank and account holder with deposit type breakdown"""
        try:
            from flask import request
            user_id = getattr(request, 'user_id', None)
            
            if not user_id:
                return jsonify({'message': 'Unauthorized'}), 401
            
            result, status_code = deposit_service.get_deposit_summary_by_bank_and_holder(user_id)
            return jsonify(result), status_code
            
        except Exception as e:
            return jsonify({'message': f'Error: {str(e)}'}), 500
    
    @deposit_bp.route('/debug/deposit-types', methods=['GET'])
    def get_deposit_types_debug():
        """Debug endpoint to see what deposit types and investment types exist in database"""
        try:
            from flask import request
            from bson import ObjectId
            user_id = getattr(request, 'user_id', None)
            
            if not user_id:
                return jsonify({'message': 'Unauthorized'}), 401
            
            # Get all unique deposit_type values
            deposit_types = deposits_collection.distinct('deposit_type', {'user_id': ObjectId(user_id)})
            investment_types = deposits_collection.distinct('investment_account_type', {'user_id': ObjectId(user_id)})
            
            # Get sample deposits to see data structure
            samples = list(deposits_collection.find(
                {'user_id': ObjectId(user_id)}, 
                {'deposit_type': 1, 'investment_account_type': 1, 'bank': 1, 'account_holder': 1, 'deposit_amount': 1}
            ).limit(5))
            
            # Format samples for JSON
            for sample in samples:
                sample['_id'] = str(sample['_id'])
                sample['user_id'] = str(sample['user_id'])
            
            return jsonify({
                'deposit_types': deposit_types,
                'investment_account_types': investment_types,
                'sample_deposits': samples
            }), 200
            
        except Exception as e:
            return jsonify({'message': f'Error: {str(e)}'}), 500
    
    return deposit_bp
