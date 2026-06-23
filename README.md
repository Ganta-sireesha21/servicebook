# Service Booking Platform

Full stack service booking application built with React, Vite, Tailwind CSS, ShadCN-style UI, Axios, Express.js, JWT authentication, and Supabase PostgreSQL.

## Structure

- `frontend/` - React client app
- `server/` - Express API server
- `server/sql/schema.sql` - Supabase table definitions

## Setup

1. Create a Supabase project and add database schema from `server/sql/schema.sql`.
2. Copy `server/.env.example` to `server/.env` and fill in values.
3. Install dependencies:
   - `cd server && npm install`
   - `cd ../frontend && npm install`
4. Run backend:
   - `cd server && npm run dev`
5. Run frontend:
   - `cd ../frontend && npm run dev`

## Notes

- The backend uses Supabase server-side access with a Service Role key.
- Use JWT authentication for protected booking and profile routes.
