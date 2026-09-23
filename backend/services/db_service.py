"""
Database Service for Network Security Incident Analysis.
Connects to MongoDB with collections:
  - users
  - logs
  - incidents
  - predictions
  - analysis_reports
Includes automated local in-memory/JSON fallback if MongoDB daemon is offline.
"""
import os
import json
import logging
import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

class DatabaseService:
    def __init__(self):
        self.mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
        self.db_name = os.getenv("MONGODB_DB_NAME", "incident_db")
        self.is_connected = False
        self.client = None
        self.db = None
        
        # In-memory document storage fallback
        self._memory_store = {
            "users": [],
            "logs": [],
            "incidents": [],
            "predictions": [],
            "analysis_reports": []
        }
        self._local_storage_file = os.path.join(os.path.dirname(__file__), "local_db_cache.json")
        self._load_local_cache()
        self._connect_mongo()

    def _connect_mongo(self):
        try:
            import pymongo
            self.client = pymongo.MongoClient(self.mongodb_uri, serverSelectionTimeoutMS=2000)
            # Test connection
            self.client.admin.command('ping')
            self.db = self.client[self.db_name]
            self.is_connected = True
            logger.info(f"Connected to MongoDB at {self.mongodb_uri}, database: {self.db_name}")
        except Exception as e:
            self.is_connected = False
            logger.warning(f"MongoDB not available ({e}). Using local in-memory storage engine.")

    def _load_local_cache(self):
        if os.path.exists(self._local_storage_file):
            try:
                with open(self._local_storage_file, "r", encoding="utf-8") as f:
                    self._memory_store = json.load(f)
            except Exception as e:
                logger.warning(f"Could not load local cache: {e}")

    def _save_local_cache(self):
        try:
            with open(self._local_storage_file, "w", encoding="utf-8") as f:
                json.dump(self._memory_store, f, indent=2, default=str)
        except Exception as e:
            logger.warning(f"Could not persist local cache: {e}")

    # ==========================
    # Incidents Collection
    # ==========================
    def insert_incident(self, incident: Dict[str, Any]) -> str:
        doc = dict(incident)
        if "id" not in doc:
            doc["id"] = f"inc-{uuid.uuid4().hex[:8]}"
        if "timestamp" not in doc:
            doc["timestamp"] = datetime.utcnow().isoformat() + "Z"

        if self.is_connected and self.db is not None:
            try:
                doc_to_save = dict(doc)
                doc_to_save["_id"] = doc["id"]
                self.db.incidents.replace_one({"_id": doc["id"]}, doc_to_save, upsert=True)
                return doc["id"]
            except Exception as e:
                logger.error(f"MongoDB insert error: {e}")

        # In-memory fallback
        # Check if already exists
        existing = next((i for i, x in enumerate(self._memory_store["incidents"]) if x.get("id") == doc["id"]), None)
        if existing is not None:
            self._memory_store["incidents"][existing] = doc
        else:
            self._memory_store["incidents"].insert(0, doc)
        self._save_local_cache()
        return doc["id"]

    def get_incident_by_id(self, incident_id: str) -> Optional[Dict[str, Any]]:
        if self.is_connected and self.db is not None:
            try:
                doc = self.db.incidents.find_one({"$or": [{"_id": incident_id}, {"id": incident_id}]})
                if doc:
                    if "_id" in doc:
                        doc["id"] = str(doc.pop("_id"))
                    return doc
            except Exception as e:
                logger.error(f"MongoDB query error: {e}")

        # In-memory fallback
        for inc in self._memory_store["incidents"]:
            if inc.get("id") == incident_id:
                return inc
        return None

    def get_incidents(
        self,
        severity: Optional[str] = None,
        attack_type: Optional[str] = None,
        source_ip: Optional[str] = None,
        limit: int = 50,
        skip: int = 0
    ) -> List[Dict[str, Any]]:
        if self.is_connected and self.db is not None:
            try:
                query = {}
                if severity:
                    query["severity"] = severity.upper()
                if attack_type:
                    query["attack_type"] = attack_type
                if source_ip:
                    query["source_ip"] = source_ip

                cursor = self.db.incidents.find(query).sort("timestamp", -1).skip(skip).limit(limit)
                results = []
                for doc in cursor:
                    if "_id" in doc:
                        doc["id"] = str(doc.pop("_id"))
                    results.append(doc)
                return results
            except Exception as e:
                logger.error(f"MongoDB find error: {e}")

        # In-memory fallback
        filtered = self._memory_store["incidents"]
        if severity:
            filtered = [x for x in filtered if x.get("severity", "").upper() == severity.upper()]
        if attack_type:
            filtered = [x for x in filtered if x.get("attack_type", "").lower() == attack_type.lower()]
        if source_ip:
            filtered = [x for x in filtered if x.get("source_ip") == source_ip]

        return filtered[skip: skip + limit]

    def count_incidents(self, query: Optional[Dict[str, Any]] = None) -> int:
        if self.is_connected and self.db is not None:
            try:
                return self.db.incidents.count_documents(query or {})
            except Exception as e:
                logger.error(f"MongoDB count error: {e}")

        if not query:
            return len(self._memory_store["incidents"])
        
        # Simple count filter for memory
        count = 0
        for item in self._memory_store["incidents"]:
            match = True
            for k, v in query.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                count += 1
        return count

    # ==========================
    # Logs & Predictions
    # ==========================
    def insert_log(self, log_doc: Dict[str, Any]) -> str:
        log_id = f"log-{uuid.uuid4().hex[:8]}"
        doc = dict(log_doc)
        doc["id"] = log_id
        doc["timestamp"] = doc.get("timestamp") or (datetime.utcnow().isoformat() + "Z")

        if self.is_connected and self.db is not None:
            try:
                doc["_id"] = log_id
                self.db.logs.insert_one(doc)
                return log_id
            except Exception as e:
                logger.error(f"MongoDB log error: {e}")

        self._memory_store["logs"].insert(0, doc)
        self._save_local_cache()
        return log_id

    def insert_prediction(self, pred_doc: Dict[str, Any]) -> str:
        pid = f"pred-{uuid.uuid4().hex[:8]}"
        doc = dict(pred_doc)
        doc["id"] = pid
        doc["timestamp"] = datetime.utcnow().isoformat() + "Z"

        if self.is_connected and self.db is not None:
            try:
                doc["_id"] = pid
                self.db.predictions.insert_one(doc)
                return pid
            except Exception as e:
                logger.error(f"MongoDB prediction insert error: {e}")

        self._memory_store["predictions"].insert(0, doc)
        self._save_local_cache()
        return pid

    def update_incident_explanation(self, incident_id: str, explanation: Dict[str, Any]) -> bool:
        if self.is_connected and self.db is not None:
            try:
                self.db.incidents.update_one(
                    {"$or": [{"_id": incident_id}, {"id": incident_id}]},
                    {"$set": {"ai_explanation": explanation}}
                )
                return True
            except Exception as e:
                logger.error(f"MongoDB update incident error: {e}")

        for inc in self._memory_store["incidents"]:
            if inc.get("id") == incident_id:
                inc["ai_explanation"] = explanation
                self._save_local_cache()
                return True
        return False

    def insert_analysis_report(self, report_doc: Dict[str, Any]) -> str:
        rid = f"rep-{uuid.uuid4().hex[:8]}"
        doc = dict(report_doc)
        doc["id"] = rid
        doc["created_at"] = datetime.utcnow().isoformat() + "Z"

        if self.is_connected and self.db is not None:
            try:
                doc["_id"] = rid
                self.db.analysis_reports.insert_one(doc)
                return rid
            except Exception as e:
                logger.error(f"MongoDB analysis report insert error: {e}")

        self._memory_store["analysis_reports"].insert(0, doc)
        self._save_local_cache()
        return rid

# Singleton instance
db_service = DatabaseService()
