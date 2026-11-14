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

