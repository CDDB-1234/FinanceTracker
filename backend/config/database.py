"""
Database configuration and utilities for MongoDB
"""
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

class MongoDatabase:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MongoDatabase, cls).__new__(cls)
            cls._instance._init_connection()
        return cls._instance
    
    def _init_connection(self):
        """Initialize MongoDB connection"""
        mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
        db_name = os.getenv('DB_NAME', 'finance_tracker')
        
        try:
            self.client = MongoClient(mongo_uri)
            self.db = self.client[db_name]
            print(f"Connected to MongoDB database: {db_name}")
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
            raise
    
    def get_collection(self, collection_name):
        """Get a collection from the database"""
        return self.db[collection_name]
    
    def close(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()

# Usage: db_instance = MongoDatabase()
