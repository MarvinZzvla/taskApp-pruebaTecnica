import pytest
import json
from src.lambda_function import lambda_handler

def test_options_request():
    event = {
        'httpMethod': 'OPTIONS'
    }
    
    response = lambda_handler(event, None)
    
    assert response['statusCode'] == 200
    assert 'Access-Control-Allow-Origin' in response['headers']
    assert 'Access-Control-Allow-Methods' in response['headers']
    assert 'Access-Control-Allow-Headers' in response['headers']
    assert 'Access-Control-Allow-Credentials' in response['headers']

def test_invalid_route():
    event = {
        'httpMethod': 'GET',
        'resource': '/invalid'
    }
    
    response = lambda_handler(event, None)
    
    assert response['statusCode'] == 400
    assert 'Ruta o método no válido' in response['body']

def test_valid_route_adds_cors_headers():
    event = {
        'httpMethod': 'GET',
        'resource': '/tasks',
        'headers': {
            'Cookie': 'token=valid_token'
        }
    }
    
    response = lambda_handler(event, None)
    
    assert 'Access-Control-Allow-Origin' in response['headers']
    assert 'Access-Control-Allow-Methods' in response['headers']
    assert 'Access-Control-Allow-Headers' in response['headers']
    assert 'Access-Control-Allow-Credentials' in response['headers'] 