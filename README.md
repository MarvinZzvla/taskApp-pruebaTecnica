\# ✨ Task App

Una aplicación web moderna para gestión de tareas, construida con una arquitectura serverless utilizando Python en AWS y MongoDB como base de datos.

\## 🌐 Demo

La aplicación está desplegada y puede accederse en:

\[Task App Demo\](http://task-app-site.s3-website-us-east-1.amazonaws.com/)

\## 🏗️ Arquitectura

\- \*\*Frontend\*\*: React.js

\- \*\*Backend\*\*: Python (Serverless Framework)

\- \*\*Base de datos\*\*: MongoDB

\- \*\*Cloud\*\*: AWS Lambda, API Gateway, S3

\## 🚀 Características

\- Crear, leer, actualizar y eliminar tareas

\- Interfaz de usuario intuitiva y responsive

\- Arquitectura serverless para mejor escalabilidad

\- Persistencia de datos con MongoDB

\- Despliegue automatizado en AWS

\## 💻 Requisitos Previos

\- Python 3.11+

\- AWS CLI configurado

\- MongoDB

\- Serverless Framework

\## 🛠️ Instalación y Configuración

\### Frontend

\# Navegar al directorio frontend

cd frontend

\# Instalar dependencias

Pnpm install

\# Iniciar servidor de desarrollo

pnpm start

\# Ejecutar tests

pnpm test

\### Backend

\# Navegar al directorio backend

cd backend

\# Instalar dependencias

pip install -r requirements.txt

\# Ejecutar tests

pytest

\# Desplegar en AWS

serverless deploy

\## 🔧 Variables de Entorno

\### Frontend

\## 🧪 Testing

\### Frontend

\# Ejecutar tests unitarios

pnpm test

\# Ejecutar tests con coverage

pnpm run test:coverage

\### Backend

\# Ejecutar tests

pytest

\# Ejecutar tests con coverage

pytest --cov=app

\## 📦 Despliegue

\### Frontend

\# Construir para producción

pnpm run build

\# Desplegar en S3

aws s3 sync build/ s3://task-app-site

\### Backend

\# Desplegar en AWS

sam deploy

\## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo \[LICENSE.md\](LICENSE.md) para más detalles.
