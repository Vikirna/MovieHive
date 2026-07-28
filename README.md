# MovieHive

A movie discovery web app built with React and the TMDB API. Browse trending titles, search across thousands of movies, filter by genre, and save favorites or a watchlist to your account.

Live app: https://movie-hive-git-main-vikirna03-6019s-projects.vercel.app/

## Features

- Trending movies hero banner with details and poster art
- Search with debounced input for fast, low-noise queries
- Browse by genre through a collapsible sidebar
- Paginated movie grid
- Movie detail modal with rating, release year, and overview
- Watchlist and Favorites lists, saved per signed-in user
- Guest mode support for users who are not signed in
- Light and dark theme toggle, persisted across sessions
- Responsive layout for desktop and mobile

## Tech Stack

- React 18 with Vite
- Tailwind CSS
- React Router
- Clerk for authentication
- TMDB API for movie data

## Getting Started

### Prerequisites

- Node.js 18 or later
- A TMDB API key (themoviedb.org)
- A Clerk publishable key (clerk.com) if you want authentication enabled

### Installation

```bash
git clone https://github.com/Vikirna/MovieHive.git
cd MovieHive
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

If the Clerk key is left out, the app runs in guest mode with authentication disabled.

### Run Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5176`.

### Build for Production

```bash
npm run build
npm run preview
```

## Deployment

This project is configured for Vercel. Environment variables must be added under the project's Environment Variables settings on Vercel, since `.env` is not committed to the repository. A `vercel.json` rewrite rule is included to support client-side routing.

## Project Structure

```
src/
  api/            TMDB API client
  components/     UI components (Navbar, Sidebar, Hero, MovieGrid, etc.)
  context/        Theme and library (watchlist/favorites) state
  hooks/          Custom hooks
  lib/            Clerk configuration
  App.jsx         Root application component
  main.jsx        Application entry point
```

## License

This project is for educational and personal portfolio use. Movie data is provided by TMDB and is subject to their terms of use.
