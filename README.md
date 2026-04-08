# TUF Assignment

A React + Vite single-page wall calendar application with month-based visuals, date-range selection, holiday markers, inline notes, and a light/dark theme toggle.

## Features

- Monthly wall calendar layout with hero imagery for each month
- Previous and next month navigation with transition effects
- Date range selection by clicking a start and end date
- Visual highlighting for today, weekends, selected ranges, and holidays
- Notes area that updates based on the selected month or date range
- Light and dark theme toggle

## Tech Stack

- React 19
- Vite 8
- ESLint 9

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

By default, Vite will print the local development URL in the terminal.

## Available Scripts

- `npm run dev` starts the Vite development server
- `npm run build` creates a production build in `dist/`
- `npm run preview` serves the production build locally
- `npm run lint` runs ESLint across the project

## Project Structure

```text
.
|-- public/
|   |-- favicon.svg
|   `-- icons.svg
|-- src/
|   |-- App.jsx
|   |-- App.css
|   |-- Calender.jsx
|   |-- calendar.css
|   |-- index.css
|   |-- main.jsx
|   `-- assets/
|-- index.html
|-- package.json
`-- vite.config.js
```

## Notes

- The main UI is rendered from `src/Calender.jsx`.
- The component currently includes a predefined holiday list and month image URLs directly in the source.
- Notes are stored in component state, so they reset when the page reloads.

## Build

To generate the production bundle:

```bash
npm run build
```
