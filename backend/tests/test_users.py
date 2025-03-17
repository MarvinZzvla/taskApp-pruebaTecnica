import pytest
import json
from unittest.mock import patch, MagicMock
from src.users import create_user, get_users, update_user, delete_user, login_user, verify_token

@pytest.fixture
def mock_users_collection():
    with patch('src.users.users_collection') as mock:
        yield mock

@pytest.fixture
def mock_verify_token():
    with patch('src.users.verify_token') as mock:
        mock.return_value = None
        yield mock

def test_create_user_success(mock_verify_token, mock_users_collection):
    event = {
        'body': json.dumps({
            'user': {
                'name': 'Test User',
                'email': 'test@example.com',
                'password': 'password123'
            }
        }),
        'headers': {'Cookie': 'token=valid_token'}
    }
    
    response = create_user(event, None)
    
    assert response['statusCode'] == 201
    assert 'id' in json.loads(response['body'])

def test_get_users_success(mock_verify_token, mock_users_collection):
    mock_users = [
        {"id": "1", "name": "User 1", "email": "user1@example.com"},
        {"id": "2", "name": "User 2", "email": "user2@example.com"}
    ]
    mock_users_collection.find.return_value = mock_users
    
    event = {'headers': {'Cookie': 'token=valid_token'}}
    response = get_users(event, None)
    
    assert response['statusCode'] == 200
    assert json.loads(response['body']) == mock_users

def test_update_user_success(mock_verify_token, mock_users_collection):
    mock_users_collection.update_one.return_value = MagicMock(modified_count=1)
    
    event = {
        'body': json.dumps({
            'user': {
                'id': '1',
                'name': 'Updated Name',
                'email': 'updated@example.com'
            }
        }),
        'headers': {'Cookie': 'token=valid_token'}
    }
    
    response = update_user(event, None)
    
    assert response['statusCode'] == 200
    assert json.loads(response['body'])['message'] == "User updated"

def test_delete_user_success(mock_verify_token, mock_users_collection):
    mock_users_collection.delete_one.return_value = MagicMock(deleted_count=1)
    
    event = {
        'queryStringParameters': {'id': '1'},
        'headers': {'Cookie': 'token=valid_token'}
    }
    
    response = delete_user(event, None)
    
    assert response['statusCode'] == 200
    assert json.loads(response['body'])['message'] == "User deleted"

def test_login_user_success(mock_users_collection):
    mock_user = {
        'id': '1',
        'email': 'test@example.com',
        'password': 'hashed_password'
    }
    mock_users_collection.find_one.return_value = mock_user
    
    with patch('src.users.check_password_hash', return_value=True):
        event = {
            'body': json.dumps({
                'email': 'test@example.com',
                'password': 'password123'
            })
        }
        
        response = login_user(event, None)
        
        assert response['statusCode'] == 200
        assert 'Set-Cookie' in response['headers']
        assert json.loads(response['body'])['message'] == "Login successful"

def test_verify_token_success():
    event = {
        'headers': {
            'Cookie': 'token=valid_token'
        }
    }
    
    with patch('src.users.jwt.decode') as mock_decode:
        mock_decode.return_value = {'user_id': '1'}
        response = verify_token(event, None)
        
        assert response is None

def test_verify_token_missing():
    event = {'headers': {}}
    response = verify_token(event, None)
    
    assert response['statusCode'] == 401
    assert json.loads(response['body'])['message'] == "Authorization token is required" 