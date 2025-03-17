import pytest
from unittest.mock import MagicMock, patch
from src.tasks import get_tasks, create_task, update_task, delete_task
from src.db import get_db
from src.response import build_response

@pytest.fixture
def mock_db():
    """Mock de la colección de MongoDB."""
    with patch("src.db.get_db") as mock_get_db:
        mock_collection = MagicMock()
        mock_get_db.return_value = mock_collection
        yield mock_collection

@pytest.fixture
def mock_event():
    """Mock del evento de AWS Lambda."""
    return {
        "httpMethod": "GET",
        "resource": "/tasks",
        "body": '{"title": "Nueva tarea", "status": "pending"}'
    }

def test_get_tasks(mock_db):
    """Prueba para obtener todas las tareas."""
    mock_db.find.return_value = [
        {"id": "1", "title": "Tarea 1", "status": "pending", "createdAt": 123456789, "updatedAt": 123456789}
    ]
    
    response = get_tasks({}, None)
    
    assert response["statusCode"] == 200
    assert "Tarea 1" in response["body"]

def test_create_task(mock_db, mock_event):
    """Prueba para crear una tarea."""
    mock_db.insert_one.return_value.inserted_id = "1"
    
    response = create_task(mock_event, None)
    
    assert response["statusCode"] == 201
    assert "Nueva tarea" in response["body"]

def test_update_task(mock_db, mock_event):
    """Prueba para actualizar una tarea."""
    mock_event["httpMethod"] = "PUT"
    mock_event["body"] = '{"id": "1", "status": "completed"}'
    
    mock_db.update_one.return_value.modified_count = 1
    
    response = update_task(mock_event, None)
    
    assert response["statusCode"] == 200
    assert "Tarea actualizada correctamente" in response["body"]

def test_delete_task(mock_db, mock_event):
    """Prueba para eliminar una tarea."""
    mock_event["httpMethod"] = "DELETE"
    mock_event["body"] = '{"id": "1"}'
    
    mock_db.delete_one.return_value.deleted_count = 1
    
    response = delete_task(mock_event, None)
    
    assert response["statusCode"] == 200
    assert "Tarea eliminada correctamente" in response["body"]
