import pytest
import sys
import os
from pathlib import Path
from unittest.mock import MagicMock

# Get the project root directory
project_root = Path(__file__).parent.parent

# Add the project root to the Python path
sys.path.insert(0, str(project_root))

# Mock pymongo and related modules
sys.modules['pymongo'] = MagicMock()
sys.modules['pymongo.errors'] = MagicMock()
sys.modules['bson'] = MagicMock()

# Mock db module
mock_collection = MagicMock()
mock_db = MagicMock()
mock_db.tasks_collection = mock_collection
mock_db.users_collection = mock_collection
sys.modules['db'] = mock_db 