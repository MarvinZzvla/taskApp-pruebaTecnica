import pytest
import json
from unittest.mock import patch, MagicMock
from src.tasks import get_tasks, create_task, update_task, delete_task

@pytest.fixture
def mock_verify_token():
    with patch('src.tasks.verify_token') as mock:
        mock.return_value = None
        yield mock

@pytest.fixture
def mock_tasks_collection():
    with patch('src.tasks.tasks_collection') as mock:
        yield mock

def test_get_tasks_success(mock_verify_token, mock_tasks_collection):
    mock_tasks = [
        {"id": "1", "title": "Task 1", "description": "Description 1", "status": "todo"},
        {"id": "2", "title": "Task 2", "description": "Description 2", "status": "completed"}
    ]
    mock_tasks_collection.find.return_value = mock_tasks
    
    event = {'headers': {'Cookie': 'token=valid_token'}}
    response = get_tasks(event, None)
    
    assert response['statusCode'] == 200
    assert json.loads(response['body']) == mock_tasks

def test_create_task_success(mock_verify_token, mock_tasks_collection):
    event = {
        'body': json.dumps({
            "title": "New Task",
            "description": "Task Description",
            "status": "todo",
            "assignedTo": "user1"
        }),
        'headers': {'Cookie': 'token=valid_token'}
    }
    
    response = create_task(event, None)
    
    assert response['statusCode'] == 201
    assert 'task_id' in json.loads(response['body'])

def test_create_task_invalid_status(mock_verify_token):
    event = {
        'body': json.dumps({
            "title": "New Task",
            "description": "Task Description",
            "status": "invalid_status",
            "assignedTo": "user1"
        }),
        'headers': {'Cookie': 'token=valid_token'}
    }
    
    response = create_task(event, None)
    
    assert response['statusCode'] == 400
    assert "Invalid status" in json.loads(response['body'])['message']

def test_update_task_success(mock_verify_token, mock_tasks_collection):
    mock_tasks_collection.update_one.return_value = MagicMock(matched_count=1)
    
    event = {
        'body': json.dumps({
            "id": "1",
            "status": "completed",
            "description": "Updated description",
            "assignedTo": "user2"
        }),
        'headers': {'Cookie': 'token=valid_token'}
    }
    
    response = update_task(event, None)
    
    assert response['statusCode'] == 200
    assert json.loads(response['body'])['message'] == "Task updated"

def test_delete_task_success(mock_verify_token, mock_tasks_collection):
    mock_tasks_collection.delete_one.return_value = MagicMock(deleted_count=1)
    
    event = {
        'queryStringParameters': {'id': '1'},
        'headers': {'Cookie': 'token=valid_token'}
    }
    
    response = delete_task(event, None)
    
    assert response['statusCode'] == 200
    assert json.loads(response['body'])['message'] == "Task deleted"
