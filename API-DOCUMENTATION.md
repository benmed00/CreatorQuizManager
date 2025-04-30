# API Documentation

This document describes the API endpoints available in the AI-Powered Quiz Generator application.

## Base URL

All API endpoints are relative to the base URL of the application:

```
/api
```

## Authentication

Many endpoints require authentication. The application uses session-based authentication, and Firebase authentication for user login.

For protected endpoints, the user must be logged in, and the session ID must be included in the request cookie.

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error responses include a JSON body with an `error` field containing a description of the error.

## Endpoints

### Authentication

#### Register User

```
POST /api/auth/register
```

Register a new user.

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "id": "number",
  "username": "string"
}
```

#### Login

```
POST /api/auth/login
```

Log in an existing user.

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "id": "number",
  "username": "string"
}
```

#### Logout

```
POST /api/auth/logout
```

Log out the current user.

**Response:**

```json
{
  "success": true
}
```

### Quizzes

#### Get All Quizzes

```
GET /api/quizzes
```

Retrieve all quizzes.

**Response:**

```json
[
  {
    "id": "number",
    "title": "string",
    "description": "string",
    "userId": "string",
    "difficulty": "string",
    "category": "string",
    "questionCount": "number",
    "timeLimit": "string",
    "active": "boolean",
    "completionRate": "number",
    "participantCount": "number",
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

#### Get User Quizzes

```
GET /api/quizzes/user/:userId
```

Retrieve quizzes created by a specific user.

**Parameters:**

- `userId`: ID of the user

**Response:**

```json
[
  {
    "id": "number",
    "title": "string",
    "description": "string",
    "userId": "string",
    "difficulty": "string",
    "category": "string",
    "questionCount": "number",
    "timeLimit": "string",
    "active": "boolean",
    "completionRate": "number",
    "participantCount": "number",
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

#### Get Quiz

```
GET /api/quizzes/:id
```

Retrieve a specific quiz by ID.

**Parameters:**

- `id`: ID of the quiz

**Response:**

```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "userId": "string",
  "difficulty": "string",
  "category": "string",
  "questionCount": "number",
  "timeLimit": "string",
  "active": "boolean",
  "completionRate": "number",
  "participantCount": "number",
  "createdAt": "string",
  "updatedAt": "string"
}
```

#### Create Quiz

```
POST /api/quizzes
```

Create a new quiz.

**Request Body:**

```json
{
  "title": "string",
  "description": "string",
  "userId": "string",
  "difficulty": "string",
  "category": "string",
  "questionCount": "number",
  "timeLimit": "string",
  "active": "boolean"
}
```

**Response:**

```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "userId": "string",
  "difficulty": "string",
  "category": "string",
  "questionCount": "number",
  "timeLimit": "string",
  "active": "boolean",
  "completionRate": "number",
  "participantCount": "number",
  "createdAt": "string",
  "updatedAt": "string"
}
```

#### Update Quiz

```
PUT /api/quizzes/:id
```

Update an existing quiz.

**Parameters:**

- `id`: ID of the quiz to update

**Request Body:**

```json
{
  "title": "string",
  "description": "string",
  "difficulty": "string",
  "category": "string",
  "questionCount": "number",
  "timeLimit": "string",
  "active": "boolean"
}
```

**Response:**

```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "userId": "string",
  "difficulty": "string",
  "category": "string",
  "questionCount": "number",
  "timeLimit": "string",
  "active": "boolean",
  "completionRate": "number",
  "participantCount": "number",
  "createdAt": "string",
  "updatedAt": "string"
}
```

#### Delete Quiz

```
DELETE /api/quizzes/:id
```

Delete a quiz and all its associated questions and options.

**Parameters:**

- `id`: ID of the quiz to delete

**Response:**

```json
{
  "success": true
}
```

### Questions

#### Get Quiz Questions

```
GET /api/questions/quiz/:quizId
```

Retrieve all questions for a specific quiz.

**Parameters:**

- `quizId`: ID of the quiz

**Response:**

```json
[
  {
    "id": "number",
    "quizId": "number",
    "quizTitle": "string",
    "text": "string",
    "codeSnippet": "string",
    "correctAnswerId": "number",
    "createdAt": "string",
    "options": [
      {
        "id": "number",
        "questionId": "number",
        "text": "string",
        "isCorrect": "boolean"
      }
    ]
  }
]
```

#### Get Question

```
GET /api/questions/:id
```

Retrieve a specific question by ID.

**Parameters:**

- `id`: ID of the question

**Response:**

```json
{
  "id": "number",
  "quizId": "number",
  "quizTitle": "string",
  "text": "string",
  "codeSnippet": "string",
  "correctAnswerId": "number",
  "createdAt": "string",
  "options": [
    {
      "id": "number",
      "questionId": "number",
      "text": "string",
      "isCorrect": "boolean"
    }
  ]
}
```

#### Create Question

```
POST /api/questions
```

Create a new question.

**Request Body:**

```json
{
  "quizId": "number",
  "quizTitle": "string",
  "text": "string",
  "codeSnippet": "string"
}
```

**Response:**

```json
{
  "id": "number",
  "quizId": "number",
  "quizTitle": "string",
  "text": "string",
  "codeSnippet": "string",
  "correctAnswerId": null,
  "createdAt": "string",
  "options": []
}
```

### Options

#### Get Question Options

```
GET /api/options/question/:questionId
```

Retrieve all options for a specific question.

**Parameters:**

- `questionId`: ID of the question

**Response:**

```json
[
  {
    "id": "number",
    "questionId": "number",
    "text": "string",
    "isCorrect": "boolean"
  }
]
```

#### Create Option

```
POST /api/options
```

Create a new option for a question.

**Request Body:**

```json
{
  "questionId": "number",
  "text": "string",
  "isCorrect": "boolean"
}
```

**Response:**

```json
{
  "id": "number",
  "questionId": "number",
  "text": "string",
  "isCorrect": "boolean"
}
```

### Quiz Results

#### Get Quiz Results

```
GET /api/results/quiz/:quizId
```

Retrieve all results for a specific quiz.

**Parameters:**

- `quizId`: ID of the quiz

**Response:**

```json
[
  {
    "id": "number",
    "quizId": "number",
    "userId": "string",
    "score": "number",
    "timeTaken": "string",
    "completedAt": "string",
    "answers": [
      {
        "questionId": "number",
        "answerId": "number"
      }
    ]
  }
]
```

#### Get User Results

```
GET /api/results/user/:userId
```

Retrieve all quiz results for a specific user.

**Parameters:**

- `userId`: ID of the user

**Response:**

```json
[
  {
    "id": "number",
    "quizId": "number",
    "userId": "string",
    "score": "number",
    "timeTaken": "string",
    "completedAt": "string",
    "answers": [
      {
        "questionId": "number",
        "answerId": "number"
      }
    ]
  }
]
```

#### Create Quiz Result

```
POST /api/results
```

Submit a quiz result.

**Request Body:**

```json
{
  "quizId": "number",
  "userId": "string",
  "score": "number",
  "timeTaken": "string",
  "answers": [
    {
      "questionId": "number",
      "answerId": "number"
    }
  ]
}
```

**Response:**

```json
{
  "id": "number",
  "quizId": "number",
  "userId": "string",
  "score": "number",
  "timeTaken": "string",
  "completedAt": "string",
  "answers": [
    {
      "questionId": "number",
      "answerId": "number"
    }
  ]
}
```

### Quiz Generation

#### Generate Quiz

```
POST /api/generate-quiz
```

Generate a quiz using AI.

**Request Body:**

```json
{
  "topic": "string",
  "difficulty": "string",
  "questionCount": "string",
  "timeLimit": "string",
  "includeCode": "boolean",
  "userId": "string"
}
```

**Response:**

```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "userId": "string",
  "difficulty": "string",
  "category": "string",
  "questionCount": "number",
  "timeLimit": "string",
  "active": "boolean",
  "completionRate": "number",
  "participantCount": "number",
  "createdAt": "string",
  "updatedAt": "string",
  "questions": [
    {
      "id": "number",
      "quizId": "number",
      "quizTitle": "string",
      "text": "string",
      "codeSnippet": "string",
      "correctAnswerId": "number",
      "createdAt": "string",
      "options": [
        {
          "id": "number",
          "questionId": "number",
          "text": "string",
          "isCorrect": "boolean"
        }
      ]
    }
  ]
}
```