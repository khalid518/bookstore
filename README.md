# The Reading Room

An independent bookstore site built with React, Vite and Tailwind CSS.

<!-- Add a screenshot: ![The Reading Room](docs/screenshot.png) -->

## Features

- Collection grid that filters books by category
- Staff picks section with bookseller quotes
- Reusable, controlled `QuantityStepper` on every book card
- Basket state shared across the app from `App`
- Responsive sticky header with an animated mobile menu
- Upcoming events section
- Book covers and links served from Open Library by ISBN

## Getting started

Requires Node 20.6 or newer and a Postgres database (a free [Neon](https://neon.tech) project, or local Docker).

```
npm run install:all
cp server/.env.example server/.env     # then fill in DATABASE_URL and BETTER_AUTH_SECRET
npm run migrate --prefix server        # create tables
npm run seed --prefix server           # load books and events
npm run dev:server                     # API on :3001
npm run dev:client                     # site on :5173 (proxies /api to the server)
```

Local Postgres with Docker: `docker run -d -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=bookstore -p 5433:5432 postgres:16-alpine`.

| Script (in `client/`) | What it does                                 |
| --------------------- | -------------------------------------------- |
| `npm run dev`         | Starts the Vite dev server with hot reload   |
| `npm run build`       | Builds the production site into `dist/`      |

| Script (in `server/`) | What it does                                 |
| --------------------- | -------------------------------------------- |
| `npm run dev`         | Starts the API with auto-restart             |
| `npm start`           | Starts the API (production)                  |
| `npm run migrate`     | Applies `schema.sql` (safe to re-run)        |
| `npm run seed`        | Upserts books and events (safe to re-run)    |

### Environment variables (`server/.env`, never committed)

| Name                 | Purpose                                              |
| -------------------- | ---------------------------------------------------- |
| `DATABASE_URL`       | Postgres connection string                           |
| `BETTER_AUTH_SECRET` | Long random string used to sign sessions             |
| `BETTER_AUTH_URL`    | Public URL the browser uses to reach the API          |
| `CLIENT_URL`         | Public URL of the React site (CORS and trusted origin) |

## API

| Route                  | Description                         |
| ---------------------- | ----------------------------------- |
| `GET /api/books`       | All books (staff picks have `staffPick`) |
| `GET /api/events`      | Upcoming events                     |
| `GET /api/health`      | Liveness check                      |
| `/api/auth/*`          | Better Auth: sign-up, sign-in, sign-out, get-session |

## Deployment

1. **Database:** create a Neon project and copy its connection string. Run `npm run migrate` and `npm run seed` in `server/` with `DATABASE_URL` pointing at it.
2. **Backend (Railway):** new project from this repo, root directory `server`. Set `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (the Vercel URL, see below) and `CLIENT_URL` (the Vercel URL). Generate a public domain.
3. **Frontend (Vercel):** import this repo, root directory `client`. Put the Railway domain into `client/vercel.json`. The rewrite proxies `/api` to Railway, so the browser only talks to one origin and session cookies work without cross-site settings.

## Tech stack

React 18, Vite 6, Tailwind CSS 4 (client). Node, Express 5, PostgreSQL (`pg`) and Better Auth (server).

## Project structure

```
client/                 React + Vite + Tailwind site
  src/
    App.jsx             Fetches data, composes the page, holds basket state
    lib/api.js          Fetch helpers for the API
    lib/auth.js         Better Auth client (useSession, signIn, signUp, signOut)
    components/         Header, Hero, Collection, StaffPicks, Events, Footer,
                        BookCard, QuantityStepper, SectionHead, AuthDialog
server/                 Express API
  schema.sql            Books, events and Better Auth tables
  src/                  app.js, auth.js, db.js, routes/api.js, index.js
  scripts/              migrate.js, seed.js and the seed data
```

## Editing content

Books and events are rows in Postgres. Edit `server/scripts/data/books.js` or `events.js` and run `npm run seed --prefix server`. The cover and link are generated from the ISBN:

```js
{ id: 'circe', title: 'Circe', author: 'Madeline Miller', tag: 'Myth & Fantasy', category: 'Fiction', price: 18.99, isbn: '9780316556347' }
```

`category` drives the collection filter. Add a `staffPick` object (`{ quote, by }`) to feature the book in Staff Picks.
