import uuid
import json
from datetime import datetime
from pymongo.errors import PyMongoError
from db import tasks_collection
from response import build_response
from users import verify_token

def get_tasks(event, context):
    try:
        # # Verify the token before proceeding
        response = verify_token(event, context)
    
        if response:  # If the response is not None, there was an error
            return response
        
        tasks = list(tasks_collection.find({}, {"_id": 0}))
        return build_response(200, tasks)
    except PyMongoError as e:
        return build_response(500, {"message": "Error retrieving tasks", "detail": str(e)})

def create_task(event, context):
    try:
        # Verify the token before proceeding
        response = verify_token(event, context)
    
        if response:  # If the response is not None, there was an error
            return response
        
        body = json.loads(event['body'])
        task_id = str(uuid.uuid4())
        created_at = updated_at = datetime.utcnow()
        
        if not all(key in body for key in ["title", "description", "status"]):
            return build_response(400, {"message": "Missing required fields: title, description, and status"})

        if not isinstance(body["title"], str) or not body["title"].strip():
            return build_response(400, {"message": "Invalid title. It must be a non-empty string."})

        if not isinstance(body["description"], str) or not body["description"].strip():
            return build_response(400, {"message": "Invalid description. It must be a non-empty string."})

        if body["status"] not in ["todo", "inProgress", "completed"]:
            return build_response(400, {"message": "Invalid status. It must be one of: 'pending', 'in-progress', 'completed'."})

        task = {
            "id": task_id,
            "title": body["title"].strip(),
            "description": body["description"].strip(),
            "status": body["status"],
            "assignedTo": body["assignedTo"],
            "createdAt": created_at.isoformat(),
            "updatedAt": updated_at.isoformat()
        }
        tasks_collection.insert_one(task)
        return build_response(201, {"message": "Task created", "task_id": task_id})
    except PyMongoError as e:
        return build_response(500, {"message": "Error creating task", "detail": str(e)})

def update_task(event, context):
    try:
        # Verify the token before proceeding
        response = verify_token(event, context)
    
        if response:  # If the response is not None, there was an error
            return response
        
        body = json.loads(event['body'])
        
        if not all(key in body for key in ["id"]):
            return build_response(400, {"message": "Missing required fields: id"})
        
        if not isinstance(body["id"], str) or not body["id"].strip():
            return build_response(400, {"message": "Invalid id. It must be a non-empty string."})
        
        task_id = body["id"].strip()
        new_status = body["status"]
        new_description = body["description"].strip()
        new_assignedTo = body["assignedTo"].strip()
        updated_at = datetime.utcnow()
        
        result = tasks_collection.update_one(
            {"id": task_id},
            {"$set": {"status": new_status, "description": new_description, "assignedTo":new_assignedTo, "updatedAt": updated_at.isoformat()}}
        )
        
        if result.matched_count > 0:
            return build_response(200, {"message": "Task updated"})
        else:
            return build_response(404, {"message": "Task not found"})
    except PyMongoError as e:
        return build_response(500, {"message": "Error updating task", "detail": str(e)})

def delete_task(event, context):
    try:
        # Verify the token before proceeding
        response = verify_token(event, context)
    
        if response:  # If the response is not None, there was an error
            return response
        
        if "queryStringParameters" not in event or not event["queryStringParameters"] or "id" not in event["queryStringParameters"]:
            return build_response(400, {"message": "Missing required query parameter: id"})
        
        task_id = event["queryStringParameters"]["id"]
        
        if not isinstance(task_id, str) or not task_id.strip():
            return build_response(400, {"message": "Invalid id. It must be a non-empty string."})
        
        result = tasks_collection.delete_one({"id": task_id.strip()})
        
        if result.deleted_count > 0:
            return build_response(200, {"message": "Task deleted"})
        else:
            return build_response(404, {"message": "Task not found"})
    except PyMongoError as e:
        return build_response(500, {"message": "Error deleting task", "detail": str(e)})
