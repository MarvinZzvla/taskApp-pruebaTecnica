import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Cargar variables de entorno desde .env
load_dotenv()

# Obtener URI de MongoDB desde las variables de entorno
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("La variable de entorno MONGO_URI no está definida")

# Conectar con MongoDB
client = MongoClient(MONGO_URI)
db = client["tasks_db"]
tasks_collection = db["tasks"]
users_collection = db["users"]
