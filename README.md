# Task Management API

## Overview

The Node.js Task Management API is a RESTful API designed to handle task management with features like user authentication, multi-tenancy, and comprehensive data operations. Built with Node.js, Express, and MongoDB, this project provides a scalable and secure solution for managing tasks. It is containerized with Docker for consistent deployment across environments.

## Features

- **User Authentication**: Secure registration and login with JWT-based authentication.
- **Task Management**: Full CRUD (Create, Read, Update, Delete) operations for tasks.
- **Multi-Tenancy**: Support for multiple tenants with isolated data.
- **Testing**: Unit and integration tests ensure code reliability and correctness.
- **Docker Integration**: Simplifies deployment with Docker and Docker Compose.
- **Logging and Validation**: Robust logging and data validation for improved reliability.

## Tech Stack

- **Node.js**: JavaScript runtime for server-side development.
- **Express**: Web framework for building the API.
- **MongoDB**: NoSQL database for flexible data storage.
- **Mongoose**: ODM library for MongoDB.
- **JWT**: JSON Web Token for user authentication.
- **Chai & Mocha**: Testing frameworks for unit and integration tests.
- **Docker**: Containerization for consistent development and deployment.

## Prerequisites

Ensure the following are installed before setting up the project:

- **Node.js**: Version 18.x or higher.
- **MongoDB**: Either locally installed or running via Docker.
- **Docker**: (Optional) For containerized development and deployment.

## Installation

### Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/munuhee/task-manager-api
cd your-repository
```

### Install Dependencies

Install the project dependencies using npm:

```bash
npm install
```

### Environment Configuration

Create a `.env` file in the root directory with the following content:

```plaintext
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/mydatabase
JWT_SECRET=your_jwt_secret
PORT=3000
```

- **NODE_ENV**: Set to `development` for local development or `production` for production environments.
- **MONGO_URI**: Connection string for MongoDB.
- **JWT_SECRET**: Secret key for signing JWT tokens.
- **PORT**: Port for the application server (default is `3000`).

## Running the Application

### Start the Server

To start the server, use:

```bash
npm start
```

The API will be accessible at `http://localhost:3000`.

### Running with Docker

Use Docker to containerize the application:

#### Build Docker Images

```bash
docker-compose build
```

#### Start Containers

```bash
docker-compose up
```

The application will be available at `http://localhost:3000` and MongoDB will be accessible at `mongodb://localhost:27017`.

#### Stop Containers

To stop and remove the containers:

```bash
docker-compose down
```

## API Endpoints

### User Authentication

- **Register User**: `POST /api/auth/register`
  - **Request Body**:
    ```json
    {
      "username": "string",
      "password": "string",
      "email": "string"
    }
    ```
  - **Response**:
    ```json
    {
      "message": "User registered successfully"
    }
    ```

- **Login User**: `POST /api/auth/login`
  - **Request Body**:
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - **Response**:
    ```json
    {
      "token": "string"
    }
    ```

### Task Management

- **Create Task**: `POST /api/tasks`
  - **Request Body**:
    ```json
    {
      "title": "string",
      "description": "string",
      "dueDate": "ISODate",
      "priority": "string"
    }
    ```
  - **Response**:
    ```json
    {
      "task": {
        "id": "string",
        "title": "string",
        ...
      }
    }
    ```

- **Get Tasks**: `GET /api/tasks`
  - **Response**:
    ```json
    [
      {
        "id": "string",
        "title": "string",
        ...
      }
    ]
    ```

- **Update Task**: `PUT /api/tasks/:taskId`
  - **Request Body**:
    ```json
    {
      "title": "string",
      "description": "string",
      "dueDate": "ISODate",
      "priority": "string"
    }
    ```
  - **Response**:
    ```json
    {
      "task": {
        "id": "string",
        "title": "string",
        ...
      }
    }
    ```

- **Delete Task**: `DELETE /api/tasks/:taskId`
  - **Response**:
    ```json
    {
      "message": "Task deleted successfully"
    }
    ```

## Testing

### Unit Tests

Run unit tests to validate individual components:

```bash
npm test
```

### Integration Tests

Run integration tests to check end-to-end functionality:

```bash
npm run test-integration
```

### Test Coverage

Generate a test coverage report:

```bash
npm run test:coverage
```

Coverage reports will be available in the `coverage` directory.

## Configuration

### Ports

- **Application Port**: The API runs on port 3000 by default.
- **MongoDB Port**: MongoDB runs on port 27017.

### Logging

- **Development Logging**: Detailed logs are enabled.
- **Production Logging**: Reduced verbosity to optimize performance.

### Error Handling

- **Development**: Detailed error messages and stack traces are enabled.
- **Production**: Generic error messages with detailed logs stored.

## Contributing

We welcome contributions! To contribute:

1. **Fork the Repository**: Create a fork on GitHub.
2. **Create a Branch**: Create a new branch for your changes.
3. **Implement Changes**: Make your modifications or fixes.
4. **Submit a Pull Request**: Open a pull request with a clear description of your changes.

Ensure your code adheres to coding standards and includes tests for new features or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions, support, or feedback, please reach out to [your.email@example.com](mailto:your.email@example.com). You can also open issues on the repository for discussions or bug reports.

## Acknowledgements

- **Node.js Community**: For the powerful runtime environment.
- **Express Contributors**: For the robust framework.
- **MongoDB Team**: For the flexible NoSQL database.
- **Chai & Mocha Developers**: For reliable testing frameworks.
- **Docker Community**: For the containerization tools that enhance development and deployment.

## Roadmap

### Planned Features

- **Task Categorization**: Introduce task categories or labels for better organization.
- **User Roles**: Implement role-based access control to manage permissions.
- **Notifications**: Add support for email or in-app notifications for task deadlines.

### Future Improvements

- **API Rate Limiting**: Implement rate limiting to prevent abuse.
- **Performance Optimization**: Refactor code to improve performance and scalability.
- **Extended Documentation**: Provide more detailed API documentation and usage examples.
