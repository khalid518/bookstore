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

```
npm install
npm run dev
```

| Script            | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Starts the Vite dev server with hot reload    |
| `npm run build`   | Builds the production site into `dist/`       |
| `npm run preview` | Serves the production build locally to check  |

Requires Node 18 or newer.

## Tech stack

React 18, Vite 6, Tailwind CSS 4 (via `@tailwindcss/vite`).

## Project structure

```
src/
  main.jsx            Entry point
  App.jsx             Composes the page and holds shared basket state
  index.css           Tailwind import and global styles
  components/         Header, Hero, Collection, StaffPicks, Events, Footer,
                      BookCard, QuantityStepper, SectionHead
  data/
    books.js          Book catalogue
    events.js         Upcoming events
```

## Editing content

Books and events live in `src/data/`.

Add a book to `books.js`. The cover and link are generated from the ISBN:

```js
{ id: 'circe', title: 'Circe', author: 'Madeline Miller', tag: 'Myth & Fantasy', category: 'Fiction', price: 18.99, isbn: '9780316556347' }
```

`category` drives the collection filter. Add a `staffPick` object (`{ quote, by }`) to feature the book in Staff Picks.

Add an event to `events.js`:

```js
{ id: 'poetry', title: 'Poetry Evening', datetime: '2026-11-21T17:00', month: 'Nov', day: 21, when: 'Saturday, November 21 · 5:00 pm', blurb: 'An open-mic hour of verse by candlelight.' }
```
