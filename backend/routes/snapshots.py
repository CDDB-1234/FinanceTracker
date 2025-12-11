"""
Routes for snapshot management
"""
from flask import Blueprint, request, jsonify
from services.snapshot_service import SnapshotService

snapshot_bp = Blueprint('snapshots', __name__, url_prefix='/api/snapshots')

def create_snapshot_routes(snapshots_collection, deposits_collection):
    """Create snapshot routes"""
    snapshot_service = SnapshotService(snapshots_collection, deposits_collection)
    
    @snapshot_bp.route('', methods=['POST'])
    def create_snapshot():
        """Create a new snapshot"""
        try:
            user_id = getattr(request, 'user_id', None)
            user_name = getattr(request, 'user_name', 'System')
            
            if not user_id:
                return jsonify({'message': 'Unauthorized'}), 401
            
            result, status_code = snapshot_service.create_snapshot(user_id, user_name)
            return jsonify(result), status_code
            
        except Exception as e:
            return jsonify({'message': f'Error: {str(e)}'}), 500
    
    @snapshot_bp.route('', methods=['GET'])
    def get_snapshots():
        """Get all snapshots for the user"""
        try:
            user_id = getattr(request, 'user_id', None)
            
            if not user_id:
                return jsonify({'message': 'Unauthorized'}), 401
            
            limit = request.args.get('limit', 50, type=int)
            skip = request.args.get('skip', 0, type=int)
            
            result, status_code = snapshot_service.get_snapshots(user_id, limit, skip)
            return jsonify(result), status_code
            
        except Exception as e:
            return jsonify({'message': f'Error: {str(e)}'}), 500
    
    @snapshot_bp.route('/<snapshot_id>', methods=['GET'])
    def get_snapshot(snapshot_id):
        """Get a single snapshot"""
        try:
            user_id = getattr(request, 'user_id', None)
            
            if not user_id:
                return jsonify({'message': 'Unauthorized'}), 401
            
            result, status_code = snapshot_service.get_snapshot(user_id, snapshot_id)
            return jsonify(result), status_code
            
        except Exception as e:
            return jsonify({'message': f'Error: {str(e)}'}), 500
    
    @snapshot_bp.route('/<snapshot_id>', methods=['DELETE'])
    def delete_snapshot(snapshot_id):
        """Delete a snapshot"""
        try:
            user_id = getattr(request, 'user_id', None)
            
            if not user_id:
                return jsonify({'message': 'Unauthorized'}), 401
            
            result, status_code = snapshot_service.delete_snapshot(user_id, snapshot_id)
            return jsonify(result), status_code
            
        except Exception as e:
            return jsonify({'message': f'Error: {str(e)}'}), 500
    
    return snapshot_bp
