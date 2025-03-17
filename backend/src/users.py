import os
import jwt
import uuid
import json
from datetime import datetime, timedelta
from pymongo.errors import PyMongoError
from src.db import users_collection
from werkzeug.security import generate_password_hash, check_password_hash

SECRET_KEY = os.getenv("SECRET_KEY", "mysecretkey")

def create_user(event, context):
    try:
        response = verify_token(event, context)
    
        if response:
            return response
        body = json.loads(event['body'])
        user_id = str(uuid.uuid4())
        created_at = updated_at = datetime.utcnow()
        if not body:
            return build_response(400, {"message": "Body is required"})
        
        try:
            user_data = body.get('user')
        except json.JSONDecodeError:
            return build_response(400, {"message": "Invalid JSON format"})
        print(user_data)
        if not user_data.get('email') or not user_data.get('password'):
            return build_response(400, {"message": "Email and password are required"})
        
        hashed_password = generate_password_hash(user_data['password'])

        user = {
            "id": user_id,
            "name": user_data.get("name"),
            "email": user_data["email"],
            "password": hashed_password,
            "createdAt": created_at.isoformat(),
            "updatedAt": updated_at.isoformat()
        }

        result = users_collection.insert_one(user)

        return build_response(201, {"message": "User created", "id": user_id})

    except PyMongoError as e:
        return build_response(500, {"message": "Error creating user", "detail": str(e)})

def get_users(event, context):
    try:
        response = verify_token(event, context)
    
        if response:
            return response
        users = list(users_collection.find({}, {"_id": 0, "password": 0}))
        return build_response(200, users)
    except PyMongoError as e:
        return build_response(500, {"message": "Error fetching users", "detail": str(e)})

def update_user(event, context):
    try:
        response = verify_token(event, context)
    
        if response:
            return response
        body = json.loads(event['body'])
        
        if not body or not body.get('user'):
            return build_response(400, {"message": "User data is required"})
        
        user_data = body["user"]
        
        if not all(key in user_data for key in ["id"]):
            return build_response(400, {"message": "Missing required fields: id"})
        
        if not isinstance(user_data["id"], str) or not user_data["id"].strip():
            return build_response(400, {"message": "Invalid id. It must be a non-empty string."})
        
        user_id = user_data["id"].strip()
        update_data = {
            "name": user_data["name"],
            "email": user_data["email"],
            "updatedAt": datetime.utcnow().isoformat()
        }

        result = users_collection.update_one({"id": user_id}, {"$set": update_data})

        if result.modified_count > 0:
            return build_response(200, {"message": "User updated"})
        else:
            return build_response(404, {"message": "User not found"})

    except PyMongoError as e:
        return build_response(500, {"message": "Error updating user", "detail": str(e)})

def delete_user(event, context):
    try:
        response = verify_token(event, context)
    
        if response:
            return response
        if "queryStringParameters" not in event or not event["queryStringParameters"] or "id" not in event["queryStringParameters"]:
            return build_response(400, {"message": "Missing required query parameter: id"})
        
        user_id = event["queryStringParameters"]["id"]
        result = users_collection.delete_one({"id": user_id})

        if result.deleted_count > 0:
            return build_response(200, {"message": "User deleted"})
        else:
            return build_response(404, {"message": "User not found"})

    except PyMongoError as e:
        return build_response(500, {"message": "Error deleting user", "detail": str(e)})

def login_user(event, context):
    try:
        body = json.loads(event['body'])
        if not body or not body.get('email') or not body.get('password'):
            return build_response(400, {"message": "Email and password are required"})

        user_data = users_collection.find_one({"email": body['email']})

        if not user_data:
            return build_response(401, {"message": "User not found email is incorrect"})

        if not check_password_hash(user_data['password'], body['password']):
            return build_response(401, {"message": "Invalid password"})

        payload = {
            "user_id": user_data["id"]
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

        headers = {
           "Set-Cookie": f"token={token}; Path=/; Max-Age=3600; HttpOnly; Secure; SameSite=None",  # Agregar HttpOnly, Secure y SameSite
        }
        return build_response(200, {"message": "Login successful"}, headers)

    except PyMongoError as e:
        return build_response(500, {"message": "Error during login", "detail": str(e)})

def verify_token(event, context):
    cookie_header = event.get("headers", {}).get("Cookie", "")
    token = None
    if cookie_header:
        cookies = cookie_header.split(';')
        for cookie in cookies:
            if cookie.strip().startswith('token='):
                token = cookie.strip().split('=')[1]
                break

    if not token:
        return build_response(401, {"message": "Authorization token is required"})

    try:
        jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return None

    except jwt.ExpiredSignatureError:
        return build_response(401, {"message": "Token has expired"})
    except jwt.InvalidTokenError:
        return build_response(401, {"message": "Invalid token"})

def build_response(status_code, body, headers=None):
    response = {
        "statusCode": status_code,
        "body": json.dumps(body)
    }
    
    if headers:
        response["headers"] = headers

    return response
