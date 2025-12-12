"""
Deposit Service - Business logic for deposit management
"""
from bson import ObjectId
from datetime import datetime
from pymongo import DESCENDING

class DepositService:
    def __init__(self, deposits_collection, matured_deposits_collection=None):
        self.deposits_collection = deposits_collection
        self.matured_deposits_collection = matured_deposits_collection
        
    def create_deposit(self, user_id, deposit_data, user_name=None):
        """Create a new deposit record"""
        try:
            # Prepare deposit document
            deposit = {
                'user_id': ObjectId(user_id),
                'investment_account_type': deposit_data.get('investment_account_type'),
                'bank': deposit_data.get('bank'),
                'deposit_on_maturity': deposit_data.get('deposit_on_maturity'),
                'account_number': deposit_data.get('account_number'),
                'deposit_amount': float(deposit_data.get('deposit_amount', 0)),
                'amount_accumulated': float(deposit_data.get('amount_accumulated', 0)),
                'start_date': deposit_data.get('start_date'),
                'maturity_date': deposit_data.get('maturity_date'),
                'interest_rate': float(deposit_data.get('interest_rate', 0)),
                'interest_amount': float(deposit_data.get('interest_amount', 0)),
                'maturity_amount': float(deposit_data.get('maturity_amount', 0)),
                'account_holder': deposit_data.get('account_holder'),
                'account_status': deposit_data.get('account_status', 'Active'),
                'comments': deposit_data.get('comments', ''),
                'plan_on_maturity': deposit_data.get('plan_on_maturity'),
                'deposit_type': deposit_data.get('deposit_type'),
                'created_at': datetime.utcnow(),
                'createdBy': user_name or 'System',
                'updated_at': datetime.utcnow(),
                'updatedBy': user_name or 'System'
            }
            
            result = self.deposits_collection.insert_one(deposit)
            deposit['_id'] = str(result.inserted_id)
            
            return {'success': True, 'deposit': self._format_deposit(deposit)}, 201
            
        except Exception as e:
            return {'success': False, 'message': str(e)}, 500
    
    def get_deposit(self, user_id, deposit_id):
        """Get a single deposit by ID"""
        try:
            deposit = self.deposits_collection.find_one({
                '_id': ObjectId(deposit_id),
                'user_id': ObjectId(user_id)
            })
            
            if not deposit:
                return {'success': False, 'message': 'Deposit not found'}, 404
            
            return {'success': True, 'deposit': self._format_deposit(deposit)}, 200
            
        except Exception as e:
            return {'success': False, 'message': str(e)}, 500
    
    def get_all_deposits(self, user_id, page=1, limit=10):
        """Get all deposits for a user with pagination"""
        try:
            skip = (page - 1) * limit
            
            deposits = list(self.deposits_collection.find(
                {'user_id': ObjectId(user_id)}
            ).sort('created_at', DESCENDING).skip(skip).limit(limit))
            
            total = self.deposits_collection.count_documents({'user_id': ObjectId(user_id)})
            
            return {
                'success': True,
                'deposits': [self._format_deposit(d) for d in deposits],
                'total': total,
                'page': page,
                'pages': (total + limit - 1) // limit
            }, 200
            
        except Exception as e:
            return {'success': False, 'message': str(e)}, 500
    
    def _move_to_matured(self, user_id, deposit_id):
        """Move a deposit from active to matured collection"""
        try:
            if self.matured_deposits_collection is None:
                print("Warning: matured_deposits_collection not initialized")
                return False
            
            # Get the deposit from active collection
            deposit = self.deposits_collection.find_one({
                '_id': ObjectId(deposit_id),
                'user_id': ObjectId(user_id)
            })
            
            if not deposit:
                print(f"Error: Deposit {deposit_id} not found in active collection")
                return False
            
            try:
                # Add moved_at timestamp to track when it was archived
                deposit['moved_at'] = datetime.utcnow()
                deposit['account_status'] = 'Matured'
                
                # Insert into matured collection
                self.matured_deposits_collection.insert_one(deposit)
                print(f"✓ Deposit {deposit_id} inserted into matured collection")
                
                # Delete from active collection
                delete_result = self.deposits_collection.delete_one({
                    '_id': ObjectId(deposit_id),
                    'user_id': ObjectId(user_id)
                })
                
                if delete_result.deleted_count > 0:
                    print(f"✓ Deposit {deposit_id} deleted from active collection")
                    return True
                else:
                    print(f"Error: Failed to delete deposit {deposit_id} from active collection")
                    return False
                    
            except Exception as insert_error:
                print(f"Error during move operation: {str(insert_error)}")
                return False
                
        except Exception as e:
            print(f"Error moving deposit to matured: {str(e)}")
            return False
    
    def update_deposit(self, user_id, deposit_id, update_data, user_name=None):
        """Update a deposit record"""
        try:
            # Get current status before update
            current_deposit = self.deposits_collection.find_one({
                '_id': ObjectId(deposit_id),
                'user_id': ObjectId(user_id)
            })
            
            if not current_deposit:
                return {'success': False, 'message': 'Deposit not found'}, 404
            
            current_status = current_deposit.get('account_status')
            new_status = update_data.get('account_status')
            
            # Prepare update data
            update_fields = {
                'investment_account_type': update_data.get('investment_account_type'),
                'bank': update_data.get('bank'),
                'deposit_on_maturity': update_data.get('deposit_on_maturity'),
                'account_number': update_data.get('account_number'),
                'deposit_amount': float(update_data.get('deposit_amount', 0)),
                'amount_accumulated': float(update_data.get('amount_accumulated', 0)),
                'start_date': update_data.get('start_date'),
                'maturity_date': update_data.get('maturity_date'),
                'interest_rate': float(update_data.get('interest_rate', 0)),
                'interest_amount': float(update_data.get('interest_amount', 0)),
                'maturity_amount': float(update_data.get('maturity_amount', 0)),
                'account_holder': update_data.get('account_holder'),
                'account_status': update_data.get('account_status'),
                'comments': update_data.get('comments'),
                'plan_on_maturity': update_data.get('plan_on_maturity'),
                'deposit_type': update_data.get('deposit_type'),
                'updated_at': datetime.utcnow(),
                'updatedBy': user_name or 'System'
            }
            
            # Remove None values
            update_fields = {k: v for k, v in update_fields.items() if v is not None}
            
            # Check if status is changing to Matured
            if current_status != 'Matured' and new_status == 'Matured':
                # Update the deposit first with Matured status
                update_fields['account_status'] = 'Matured'
                self.deposits_collection.update_one(
                    {'_id': ObjectId(deposit_id), 'user_id': ObjectId(user_id)},
                    {'$set': update_fields}
                )
                
                # Move to matured collection
                self._move_to_matured(user_id, deposit_id)
                return {'success': True, 'message': 'Deposit moved to matured collection', 'moved': True}, 200
            else:
                # Regular update for non-matured status changes
                result = self.deposits_collection.update_one(
                    {'_id': ObjectId(deposit_id), 'user_id': ObjectId(user_id)},
                    {'$set': update_fields}
                )
                
                if result.matched_count == 0:
                    return {'success': False, 'message': 'Deposit not found'}, 404
                
                # Fetch updated deposit
                deposit = self.deposits_collection.find_one({'_id': ObjectId(deposit_id)})
                
                return {'success': True, 'deposit': self._format_deposit(deposit)}, 200
            
        except Exception as e:
            return {'success': False, 'message': str(e)}, 500
    
    def delete_deposit(self, user_id, deposit_id):
        """Delete a deposit record"""
        try:
            result = self.deposits_collection.delete_one({
                '_id': ObjectId(deposit_id),
                'user_id': ObjectId(user_id)
            })
            
            if result.deleted_count == 0:
                return {'success': False, 'message': 'Deposit not found'}, 404
            
            return {'success': True, 'message': 'Deposit deleted successfully'}, 200
            
        except Exception as e:
            return {'success': False, 'message': str(e)}, 500
    
    def get_deposit_summary(self, user_id):
        """Get summary statistics for deposits (excluding matured)"""
        try:
            # Only calculate for Active deposits
            pipeline = [
                {'$match': {'user_id': ObjectId(user_id), 'account_status': {'$ne': 'Matured'}}},
                {'$group': {
                    '_id': None,
                    'total_deposits': {'$sum': '$deposit_amount'},
                    'total_accumulated': {'$sum': '$amount_accumulated'},
                    'total_interest': {'$sum': '$interest_amount'},
                    'total_maturity_amount': {'$sum': '$maturity_amount'},
                    'count': {'$sum': 1},
                    'active_count': {'$sum': {'$cond': [{'$eq': ['$account_status', 'Active']}, 1, 0]}},
                    'closed_count': {'$sum': {'$cond': [{'$eq': ['$account_status', 'Closed']}, 1, 0]}}
                }}
            ]
            
            result = list(self.deposits_collection.aggregate(pipeline))
            
            if not result:
                return {
                    'success': True,
                    'summary': {
                        'total_deposits': 0,
                        'total_accumulated': 0,
                        'total_interest': 0,
                        'total_maturity_amount': 0,
                        'count': 0,
                        'active_count': 0,
                        'closed_count': 0
                    }
                }, 200
            
            summary = result[0]
            summary.pop('_id', None)
            
            return {'success': True, 'summary': summary}, 200
            
        except Exception as e:
            return {'success': False, 'message': str(e)}, 500
    
    def get_deposit_summary_by_holder(self, user_id):
        """Get deposit summary grouped by account holder (excluding matured)"""
        try:
            # Group deposits by account holder
            pipeline = [
                {'$match': {'user_id': ObjectId(user_id), 'account_status': {'$ne': 'Matured'}}},
                {'$group': {
                    '_id': {'$ifNull': ['$account_holder', 'Unknown']},
                    'total_deposits': {'$sum': '$deposit_amount'},
                    'total_accumulated': {'$sum': '$amount_accumulated'},
                    'total_interest': {'$sum': '$interest_amount'},
                    'total_maturity_amount': {'$sum': '$maturity_amount'},
                    'count': {'$sum': 1},
                    'account_types': {'$push': '$investment_account_type'},
                    'banks': {'$push': '$bank'},
                    'active_count': {'$sum': {'$cond': [{'$eq': ['$account_status', 'Active']}, 1, 0]}},
                    'closed_count': {'$sum': {'$cond': [{'$eq': ['$account_status', 'Closed']}, 1, 0]}}
                }},
                {'$sort': {'total_accumulated': -1}}
            ]
            
            result = list(self.deposits_collection.aggregate(pipeline))
            
            # Format the results
            formatted_results = []
            for holder_data in result:
                account_holder = holder_data.get('_id', 'Unknown')
                formatted_results.append({
                    'account_holder': account_holder,
                    'total_deposits': holder_data.get('total_deposits', 0),
                    'total_accumulated': holder_data.get('total_accumulated', 0),
                    'total_interest': holder_data.get('total_interest', 0),
                    'total_maturity_amount': holder_data.get('total_maturity_amount', 0),
                    'count': holder_data.get('count', 0),
                    'active_count': holder_data.get('active_count', 0),
                    'closed_count': holder_data.get('closed_count', 0),
                    'account_types': list(set(filter(None, holder_data.get('account_types', [])))),
                    'banks': list(set(filter(None, holder_data.get('banks', []))))
                })
            
            # Calculate overall totals
            overall_summary = {
                'total_deposits': sum(h['total_deposits'] for h in formatted_results),
                'total_accumulated': sum(h['total_accumulated'] for h in formatted_results),
                'total_interest': sum(h['total_interest'] for h in formatted_results),
                'total_maturity_amount': sum(h['total_maturity_amount'] for h in formatted_results),
                'total_count': sum(h['count'] for h in formatted_results),
                'total_holders': len(formatted_results)
            }
            
            return {
                'success': True,
                'summary_by_holder': formatted_results,
                'overall_summary': overall_summary
            }, 200
            
        except Exception as e:
            return {'success': False, 'message': str(e)}, 500
    
    def get_all_deposits_with_filters(self, user_id, page=1, limit=10, filters=None):
        """Get all deposits for a user with optional filters (including matured if requested)"""
        try:
            skip = (page - 1) * limit
            filters = filters or {}
            
            # Determine which collection to query based on account_status filter
            status_filter = filters.get('account_status')
            
            # Query matured_deposits collection if status is 'Matured'
            if status_filter == 'Matured':
                if self.matured_deposits_collection is None:
                    return {'success': True, 'deposits': [], 'total': 0, 'page': page, 'pages': 0}, 200
                
                # Build query for matured deposits
                query = {'user_id': ObjectId(user_id)}
                collection = self.matured_deposits_collection
            else:
                # Query active deposits collection (exclude matured)
                query = {'user_id': ObjectId(user_id), 'account_status': {'$ne': 'Matured'}}
                collection = self.deposits_collection
            
            # Add additional filters if provided
            if filters.get('investment_account_type'):
                query['investment_account_type'] = filters['investment_account_type']
            if filters.get('bank'):
                query['bank'] = filters['bank']
            if status_filter and status_filter != 'Matured':
                # Only add account_status filter for non-matured queries
                query['account_status'] = status_filter
            if filters.get('account_holder'):
                query['account_holder'] = filters['account_holder']
            if filters.get('start_date'):
                query['start_date'] = {'$gte': filters['start_date']}
            if filters.get('maturity_date'):
                query['maturity_date'] = {'$lte': filters['maturity_date']}
            
            # Get filtered deposits
            deposits = list(collection.find(query)
                .sort('created_at', DESCENDING)
                .skip(skip)
                .limit(limit))
            
            # Count total matching deposits
            total = collection.count_documents(query)
            
            return {
                'success': True,
                'deposits': [self._format_deposit(d) for d in deposits],
                'total': total,
                'page': page,
                'pages': (total + limit - 1) // limit
            }, 200
            
        except Exception as e:
            return {'success': False, 'message': str(e)}, 500
    
    def get_filter_options(self, user_id):
        """Get available filter options for the user's deposits (excluding matured)"""
        try:
            # Get distinct values for each filter field - exclude matured deposits
            query = {'user_id': ObjectId(user_id), 'account_status': {'$ne': 'Matured'}}
            
            banks = self.deposits_collection.distinct('bank', query)
            account_types = self.deposits_collection.distinct('investment_account_type', query)
            account_holders = self.deposits_collection.distinct('account_holder', query)
            
            return {
                'success': True,
                'banks': sorted(filter(None, banks)),
                'account_types': sorted(filter(None, account_types)),
                'account_holders': sorted(filter(None, account_holders))
            }, 200
            
        except Exception as e:
            return {'success': False, 'message': str(e)}, 500
    
    def _format_deposit(self, deposit):
        """Format deposit for API response"""
        deposit['_id'] = str(deposit['_id'])
        deposit['user_id'] = str(deposit['user_id'])
        
        # Convert datetime objects to ISO format strings
        if isinstance(deposit.get('created_at'), datetime):
            deposit['created_at'] = deposit['created_at'].isoformat()
        if isinstance(deposit.get('updated_at'), datetime):
            deposit['updated_at'] = deposit['updated_at'].isoformat()
        
        return deposit

    def get_deposit_summary_by_bank_and_holder(self, user_id):
        """Get deposit summary grouped by Bank and Holder with deposit types breakdown"""
        try:
            # Aggregate deposits by bank, holder and investment account type
            pipeline = [
                {'$match': {'user_id': ObjectId(user_id), 'account_status': {'$ne': 'Matured'}}},
                {'$group': {
                    '_id': {
                        'bank': {'$ifNull': ['$bank', 'Unknown']},
                        'account_holder': {'$ifNull': ['$account_holder', 'Unknown']},
                        'investment_account_type': {'$ifNull': ['$investment_account_type', 'Other']}
                    },
                    'total_deposit_amount': {'$sum': '$deposit_amount'},
                    'total_accumulated': {'$sum': '$amount_accumulated'},
                    'total_interest': {'$sum': '$interest_amount'},
                    'total_maturity_amount': {'$sum': '$maturity_amount'},
                    'count': {'$sum': 1}
                }},
                {'$sort': {
                    '_id.bank': 1,
                    '_id.account_holder': 1,
                    '_id.investment_account_type': 1
                }}
            ]
            
            result = list(self.deposits_collection.aggregate(pipeline))
            
            # Structure data for display: Bank -> Holder -> AccountTypes
            bank_summary = {}
            
            for item in result:
                bank = item['_id']['bank']
                holder = item['_id']['account_holder']
                investment_type = item['_id']['investment_account_type']
                amount = item['total_accumulated']
                
                if bank not in bank_summary:
                    bank_summary[bank] = {}
                
                if holder not in bank_summary[bank]:
                    bank_summary[bank][holder] = {
                        'Recurring Deposit': 0,
                        'Fixed Deposits': 0,
                        'PPF': 0,
                        'Savings': 0,
                        'total_amount': 0
                    }
                
                # Normalize investment type string for comparison
                inv_type_lower = investment_type.lower().strip() if investment_type else ''
                
                # Map investment account types to display categories
                if 'recurring' in inv_type_lower or 'rd' in inv_type_lower:
                    bank_summary[bank][holder]['Recurring Deposit'] += amount
                elif 'fixed' in inv_type_lower or 'fd' in inv_type_lower:
                    bank_summary[bank][holder]['Fixed Deposits'] += amount
                elif 'ppf' in inv_type_lower:
                    bank_summary[bank][holder]['PPF'] += amount
                elif 'savings' in inv_type_lower or 'saving' in inv_type_lower:
                    bank_summary[bank][holder]['Savings'] += amount
                else:
                    # For any other types, add to the appropriate category based on name
                    bank_summary[bank][holder]['Savings'] += amount
                
                bank_summary[bank][holder]['total_amount'] += amount
            
            # Calculate grand totals
            grand_total = sum(
                holder_data['total_amount']
                for bank_data in bank_summary.values()
                for holder_data in bank_data.values()
            )
            
            return {
                'success': True,
                'summary': bank_summary,
                'grand_total': grand_total
            }, 200
            
        except Exception as e:
            return {'success': False, 'message': str(e)}, 500

