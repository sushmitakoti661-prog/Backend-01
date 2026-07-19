# Task API

A simple CRUD API for managing a to-do list, built with Node.js and Express.
Built as part of the FlyRank AI Backend Internship — Week 2, Assignment A1.

## Features
- Full CRUD (Create, Read, Update, Delete) for tasks
- In-memory storage (no database yet)
- Input validation
- Interactive API docs via Swagger UI

## Tech Stack
- Node.js
- Express
- swagger-ui-express

## How to Run

1. Clone this repo:
 - git clone https://github.com/sushmitakoti661-prog/Backend-01.git 
 - cd Backend-01

2. Install dependencies:
 - npm install
3. Start the server:
 - node server.js

4. Server runs at `http://localhost:3000`

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | / | API info |
| GET | /health | Health check |
| GET | /tasks | Get all tasks |
| GET | /tasks/:id | Get one task by id |
| POST | /tasks | Create a new task |
| PUT | /tasks/:id | Update a task |
| DELETE | /tasks/:id | Delete a task |

## Example Request
curl.exe -i http://localhost:3000/tasks

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 184
ETag: W/"b8-EXcF2VmgAmLt5uQ9nLDmeGyvUMA"
Date: Sun, 19 Jul 2026 22:29:33 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"id":1,"title":"Buy groceries","done":false},{"id":2,"title":"Finish assignment","done":false},{"id":3,"title":"Read a book","done":true},{"id":4,"title":"Go for a Run","done":true}]

## Swagger UI

Interactive docs available at `http://localhost:3000/docs`

![Swagger UI Screenshot](swagger-screenshot.png)

## Notes

- Data is stored in memory only — it resets every time the server restarts. This will be fixed with a real database in Week 3.
- Since this was built on Windows, `Invoke-RestMethod` / `Invoke-WebRequest` (PowerShell) was used instead of `curl` for POST/PUT requests, due to PowerShell's quoting behavior with JSON bodies.
