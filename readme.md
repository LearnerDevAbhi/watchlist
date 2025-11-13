
```markdown
# Watch List API

A TypeScript REST API for managing authentication, curated movie and TV listings, and personal watch lists. Built with Express, Mongoose, JWT, and Joi validation.

## Features
- Authentication with bcrypt password hashing, access/refresh JWTs.
- Protected movie and TV show catalog with pagination, genre filtering, and search.
- Watch list CRUD endpoints validated with Joi.
- MongoDB models for users, content, and user-specific lists.
- Automatic seeding of demo users, movies, and TV shows on boot.

## Tech Stack
- Node.js / Express
- TypeScript
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Joi validation
- Bcrypt for password hashing

## Project Structure
- `app.ts` – Express bootstrap, MongoDB connection, seed runner.
- `router.ts` – Mounts `/api/auth`, `/api/content`, `/api/watch_list`.
- `controllers/` – Request handlers for auth, content, and watch lists.
- `db/` – Mongoose connection, models, and seeding script.
- `middleware/` – JWT validation and generic payload validator.
- `validation/` – Joi schemas for body/query/params.
- `utils/` – Shared enums, interfaces, and token helper functions.

## Prerequisites
- Node.js 18 or newer
- npm
- MongoDB instance (local or hosted)

## Environment Variables
Create a `.env` file in the project root:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/watchlist
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

Adjust `MONGO_URI` to point to your MongoDB database.

## Installation & Running

```bash
npm install
npm run dev    # nodemon + ts-node
# or
npm start
```

When the server starts it connects to MongoDB and executes `db/seed.ts` to insert sample data.

## API Overview

Base URL: `http://localhost:3000/api`

### Auth
- `POST /auth/login`
  - Body: `{ "email": "...", "password": "..." }`
  - Returns user info with `access_token` and `refresh_token`.
- `POST /auth/refreshToken`
  - Header: `refresh_token: <token>`
  - Returns a new access token.

### Content (requires `access_token` header)
- `GET /content/movie`
- `GET /content/tvshow`
  - Query: `page`, `limit`, optional `genre`, `search`.

### Watch List (requires `access_token` header)
- `POST /watch_list/add`
  - Body: `userId`, one of `movieId` or `tvShowId`, optional `rating`.
- `DELETE /watch_list/:id`
  - Params: `id` (watch list entry UUID).
- `GET /watch_list`
  - Query: `page`, `limit`, `userId`, optional `contentType` (`movie`, `tvshow`, `both`).

Validation errors return HTTP 400 with field-level messages; failed auth returns 401.

## Data Models
- `User`: UUID, username, email, hashed password, preferences, watch history.
- `Movie`: UUID, title, description, genres, release date, director, actors.
- `TVShow`: UUID, title, description, genres, nested episodes.
- `UserList`: UUID, userId, movieId or tvShowId, optional rating.

## Development Notes
- `validateToken` middleware accepts `access_token` as `Bearer <token>` or raw token.
- Joi schemas live under `validation/`; add new schemas per route.
- Seeder wipes only predefined sample records before reinserting.
- `npm test` currently echoes a placeholder.

## Potential Improvements
- Await bcrypt comparisons in auth controller.
- Seed watch list entries for demonstration.
- Add logging, rate limiting, and test coverage.
- Publish OpenAPI/Swagger documentation.
```

Here’s the end-to-end flow using the Watch List API:

1. **Login**
   - Call `POST /api/auth/login` with email/password.
   - Response contains `access_token` and `refresh_token`.

2. **Use Access Token**
   - Include `access_token` (as `Bearer <token>`) in headers for protected routes.

3. **Handle Expired Access Token**
   - When access token expires, call `POST /api/auth/refreshToken` with header `refresh_token: <token>`.
   - You receive a new `access_token`; continue using that.

4. **Fetch Catalog**
   - `GET /api/content/movie` with pagination/search/genre query parameters.
   - `GET /api/content/tvshow` similarly.

5. **Manage Watch List**
   - `POST /api/watch_list/add` to add (body includes `userId` and either `movieId` or `tvShowId`, optional `rating`).
   - `DELETE /api/watch_list/:id` to remove a specific entry.
   - `GET /api/watch_list` with `userId`, `page`, `limit`, optional `contentType`.

Repeat the refresh-token step whenever the access token expires, ensuring all catalog and watch list operations use a valid access token.

Let me know if you want edits or extra sections (e.g., Docker, deployment, Postman collection).