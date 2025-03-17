from tasks import get_tasks, create_task, update_task, delete_task
from users import get_users, create_user, update_user, delete_user, login_user

def lambda_handler(event, context):
   
    if event['httpMethod'] == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': 'http://task-app-site.s3-website-us-east-1.amazonaws.com',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie', 
                'Access-Control-Allow-Credentials': 'true'  
            }
        }

    route = event.get("resource")
    method = event.get("httpMethod")

    
    routes = {
        ("/tasks", "GET"): get_tasks,
        ("/tasks", "POST"): create_task,
        ("/tasks", "PUT"): update_task,
        ("/tasks", "DELETE"): delete_task,
        ("/users", "GET"): get_users,
        ("/users/login", "POST"): login_user,
        ("/users", "POST"): create_user,
        ("/users", "PUT"): update_user,
        ("/users", "DELETE"): delete_user,
    }

    handler = routes.get((route, method))

    if handler:
        response = handler(event, context)
       
        if not response.get("headers"):
            response["headers"] = {}
        response["headers"].update({
            'Access-Control-Allow-Origin': 'http://task-app-site.s3-website-us-east-1.amazonaws.com',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie', 
            'Access-Control-Allow-Credentials': 'true'
        })
        return response

    return {
        "statusCode": 400,
        "body": "Ruta o método no válido",
        "headers": {
            'Access-Control-Allow-Origin': 'http://task-app-site.s3-website-us-east-1.amazonaws.com',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
            'Access-Control-Allow-Credentials': 'true'
        }
    }
