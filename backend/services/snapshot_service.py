"""
Snapshot Service - Business logic for financial snapshot/portfolio summaries
"""
from bson import ObjectId
from datetime import datetime
from pymongo import DESCENDING

class SnapshotService:
    def __init__(self, snapshots_collection, deposits_collection):
        self.snapshots_collection = snapshots_collection
        self.deposits_collection = deposits_collection
    
    def create_snapshot(self, user_id, user_name=None):
        """
        Create a snapshot record based on current deposits data.
        
        Calculation logic:
        - Cash: 0.0
        - Savings: sum of all Savings Account amount_accumulated
        - FD: sum of FD amount_accumulated (excluding Emergency Fund)
        - RD: sum of RD amount_accumulated
        - PPF: sum of PPF amount_accumulated
        - EPF: sum of EPF amount_accumulated
        - NPS: sum of NPS amount_accumulated
        - MF: 0.0
        - Stocks: 0.0
        - Gold: 0.0
        - Loans: 0.0
        - Emer.Fund: sum of FD amount_accumulated where comments contain "Emergency Fund"
        - TOTAL: sum of all above
        """
        try:
            user_id_obj = ObjectId(user_id)
            
            # Get all active deposits for the user (exclude matured deposits)
            deposits = list(self.deposits_collection.find({
                'user_id': user_id_obj,
                'account_status': {'$ne': 'Matured'}
            }))
            
            # Calculate each category
            cash = 0.0
            savings = 0.0
            fd = 0.0
            rd = 0.0
            ppf = 0.0
            epf = 0.0
            nps = 0.0
            mf = 0.0
            stocks = 0.0
            gold = 0.0
            loans = 0.0
            emergency_fund = 0.0
            
            # Process each deposit
            for deposit in deposits:
                account_type = deposit.get('investment_account_type', '').strip().upper()
                amount_accumulated = float(deposit.get('amount_accumulated', 0))
                comments = deposit.get('comments', '').strip()
                
                # Check if this is an Emergency Fund deposit
                is_emergency_fund = 'emergency fund' in comments.lower()
                
                if account_type == 'SA':
                    savings += amount_accumulated
                elif account_type == 'FD' or account_type == 'KVP':
                    if is_emergency_fund:
                        emergency_fund += amount_accumulated
                    else:
                        fd += amount_accumulated
                elif account_type == 'RD':
                    rd += amount_accumulated
                elif account_type == 'PPF':
                    ppf += amount_accumulated
                elif account_type == 'EPF':
                    epf += amount_accumulated
                elif account_type == 'NPS':
                    nps += amount_accumulated
            
            # Calculate total
            total = cash + savings + fd + rd + ppf + epf + nps + mf + stocks + gold + loans + emergency_fund
            
            # Create snapshot document
            snapshot = {
                'user_id': user_id_obj,
                'cash': cash,
                'savings': savings,
                'fd': fd,
                'rd': rd,
                'ppf': ppf,
                'epf': epf,
                'nps': nps,
                'mf': mf,
                'stocks': stocks,
                'gold': gold,
                'loans': loans,
                'emergency_fund': emergency_fund,
                'total': total,
                'createdAt': datetime.utcnow(),
                'createdBy': user_name or 'System'
            }
            
            result = self.snapshots_collection.insert_one(snapshot)
            snapshot['_id'] = str(result.inserted_id)
            
            return {
                'success': True,
                'message': 'Snapshot created successfully',
                'snapshot': self._format_snapshot(snapshot)
            }, 201
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Error creating snapshot: {str(e)}'
            }, 500
    
    def get_snapshots(self, user_id, limit=50, skip=0):
        """Get snapshots for a user"""
        try:
            user_id_obj = ObjectId(user_id)
            
            total = self.snapshots_collection.count_documents({'user_id': user_id_obj})
            
            snapshots = list(self.snapshots_collection.find(
                {'user_id': user_id_obj}
            ).sort('createdAt', DESCENDING).skip(skip).limit(limit))
            
            formatted_snapshots = [self._format_snapshot(snap) for snap in snapshots]
            
            return {
                'success': True,
                'snapshots': formatted_snapshots,
                'total': total,
                'limit': limit,
                'skip': skip
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Error retrieving snapshots: {str(e)}'
            }, 500
    
    def get_snapshot(self, user_id, snapshot_id):
        """Get a single snapshot"""
        try:
            user_id_obj = ObjectId(user_id)
            snapshot_id_obj = ObjectId(snapshot_id)
            
            snapshot = self.snapshots_collection.find_one({
                '_id': snapshot_id_obj,
                'user_id': user_id_obj
            })
            
            if not snapshot:
                return {
                    'success': False,
                    'message': 'Snapshot not found'
                }, 404
            
            return {
                'success': True,
                'snapshot': self._format_snapshot(snapshot)
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Error retrieving snapshot: {str(e)}'
            }, 500
    
    def delete_snapshot(self, user_id, snapshot_id):
        """Delete a snapshot"""
        try:
            user_id_obj = ObjectId(user_id)
            snapshot_id_obj = ObjectId(snapshot_id)
            
            result = self.snapshots_collection.delete_one({
                '_id': snapshot_id_obj,
                'user_id': user_id_obj
            })
            
            if result.deleted_count == 0:
                return {
                    'success': False,
                    'message': 'Snapshot not found'
                }, 404
            
            return {
                'success': True,
                'message': 'Snapshot deleted successfully'
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Error deleting snapshot: {str(e)}'
            }, 500
    
    def _format_snapshot(self, snapshot):
        """Format snapshot document for response"""
        if not snapshot:
            return None
        
        def format_currency(value):
            """Format value as currency string"""
            return f"₹{float(value):,.2f}"
        
        return {
            '_id': str(snapshot.get('_id', '')),
            'cash': float(snapshot.get('cash', 0)),
            'savings': float(snapshot.get('savings', 0)),
            'fd': float(snapshot.get('fd', 0)),
            'rd': float(snapshot.get('rd', 0)),
            'ppf': float(snapshot.get('ppf', 0)),
            'epf': float(snapshot.get('epf', 0)),
            'nps': float(snapshot.get('nps', 0)),
            'mf': float(snapshot.get('mf', 0)),
            'stocks': float(snapshot.get('stocks', 0)),
            'gold': float(snapshot.get('gold', 0)),
            'loans': float(snapshot.get('loans', 0)),
            'emergency_fund': float(snapshot.get('emergency_fund', 0)),
            'total': float(snapshot.get('total', 0)),
            'createdAt': snapshot.get('createdAt'),
            'createdBy': snapshot.get('createdBy', 'System')
        }
