# Stack Five – Study Group Planner (COMP229)

## Run the backend
1. Install Node.js and MongoDB (Compass shows it on localhost:27017)
2. `cd server`
3. Copy `.env.example` to a new file named `.env`
4. `npm install`
5. `npm run dev` → "MongoDB connected" and "Server on port 5000"

## API (base: http://localhost:5000/api)
- POST /auth/register, POST /auth/login, GET /auth/me (token)
- GET /groups, GET /groups/:id
- POST /groups, PUT /groups/:id, DELETE /groups/:id (Bearer token)

## Team tasks
| Role | Task | 
|---|---|
| Project Manager | Trello, External Design Document, slides, video, submission | 
| Front-End | Build the `client` (React + Vite): Register, Login, Group list, Create/Edit/Delete group. Call the API above, store the token, send `Authorization: Bearer <token>`. Commit to `client/` | 
| Back-End | Write `docs/api-endpoints.md`; then add join/leave group endpoints | 
| Database | Write `docs/database-schema.md` (User and StudyGroup fields); screenshot data in Compass | 
| Security/Tester | Write `docs/test-cases.md`; test all endpoints in Postman with screenshots | 

## Project Overview
Study Group Planner is a web application designed to help students organize and manage study groups for their courses. Users can register, log in, create study groups, view available groups, and manage the groups they own.

## Project Objectives
- Provide a centralized platform for managing study groups.
- Allow users to create, view, update, and delete study groups.
- Implement secure user authentication and authorization.
- Connect the application to MongoDB using Node.js and Express.
- Support teamwork through GitHub and Trello.

## Key Features
- User registration and login
- Study group creation and listing
- Editing and deleting study groups
- User profile page
- JWT-based authentication
- Authorization for group owners and administrators

## Project Management
The team uses Trello to organize the Product Backlog and track tasks through To Do, In Progress, and Done. GitHub is used for version control and collaboration.

## Project Team
- Chamudi Shehara Hennayaka
- Hwanhui Lee
- Jihyun Kim
- sunhum park 
- Robert Morada

Project Manager: Park Sun Heum

Course: COMP229 - Web Application Development
Project: Stack Five - Study Group Planner
