# Classroom Assignments Backend

This is a Node.js backend microservice for managing classroom assignments, including authentication and assignment management. The service is containerized using Docker.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Database Setup](#database-setup)
- [Usage](#usage)
- [License](#license)

## api-documentation
 Click here -
  https://pp-backend-docker.onrender.com/api-docs/

## Features
- User Authentication using JSON Web Tokens (JWT)
- CRUD operations for managing student assignments
- Dockerized for easy deployment
- API documentation with Swagger

## Technologies
- Node.js
- Express.js
- not using PostgreSQL (or any other RDBMS)/ using MongoDB because
- Docker
- Swagger for API documentation
- JWT for authentication

## Installation

### Prerequisites
- Docker
- Node.js
- MongoDB

### Steps
1. **Clone the repository**
   ```sh
   git  clone https://github.com/Mohammmedrafique/pp-backend-docker.git
   cd classroom-assignments-backend

2. **Docker steps**
   ```sh
   docker build -t rafiqpathan/docker-game:tagname .
   docker run -p 3000:3000 --env-file .env rafiqpathan/docker-game:tagname


This README file provides all the necessary instructions for building, running, and pushing the Docker image for your project. Adjust the `tagname` and environment variables as needed.

