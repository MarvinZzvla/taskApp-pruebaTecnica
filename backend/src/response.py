import json

def build_response(status_code, body, headers=None):
    response = {
        "statusCode": status_code,
        "body": json.dumps(body)
    }
    
    if headers:
        response["headers"] = headers
        
    return response
