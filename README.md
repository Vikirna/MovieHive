# MovieHive

A movie discovery web app built with React and the TMDB API. Browse trending titles, search across thousands of movies, filter by genre, explore cast biographies, and save favorites or a watchlist to your account.

Live app: https://movie-hive-ruby.vercel.app/

## Features

* Trending movies hero banner with poster art, rating, and overview
* Search with debounced input for fast, low-noise queries
* Browse by genre through a collapsible sidebar, with a distinct icon per genre for quick recognition even when collapsed
* Paginated movie grid
* Movie detail modal with rating, release year, runtime, overview, budget/revenue, and top cast
* Cast biography modal — click any cast member to view their biography, birthday, place of birth, and other movies they've worked on
* In-modal back navigation when browsing through "More Like This" recommendations or cast filmographies, so you can retrace your steps instead of losing your place
* Watchlist and Favorites, saved to the signed-in user's account (via Clerk) so they follow you across devices; guests get a local, device-only list instead
* Auth-gated details — movie posters are visible to everyone, but titles, ratings, and full details are only shown once signed in; attempting to view details while logged out opens the sign-in prompt
* Light and dark theme toggle, persisted across sessions
* Responsive layout for desktop and mobile

## Tech Stack

* React 18 with Vite
* Tailwind CSS
* Clerk for authentication and per-user data storage
* TMDB API for movie, genre, and cast data
* lucide-react for icons

## Getting Started

### Prerequisites

* Node.js 18 or later
* A TMDB API key (themoviedb.org)
* A Clerk publishable key (clerk.com) if you want authentication enabled

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

If the Clerk key is left out, the app runs in guest mode with authentication disabled, and full movie details are shown to everyone.

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

This project is configured for Vercel. Environment variables must be added under the project's Environment Variables settings on Vercel, since `.env` is not committed to the repository.

## Project Structure

```
src/
  api/            TMDB API client (movies, genres, cast/person details)
  components/     UI components (Navbar, Sidebar, Hero, MovieGrid, MovieDetailModal, CastDetailModal, etc.)
  context/        Theme and library (watchlist/favorites) state
  hooks/          Custom hooks
  lib/            Clerk configuration
  App.jsx         Root application component
  main.jsx        Application entry point
```

## How Data Is Stored

* **Watchlist / Favorites (signed in):** stored in Clerk's `unsafeMetadata` on the user's account, so the same list appears on any device once logged in.
* **Watchlist / Favorites (guest):** stored in the browser's `localStorage`, and automatically merged into the account the first time the guest signs in.
* **Movie and cast data:** fetched live from TMDB on each request; nothing from TMDB is stored beyond the current session.

## License

This project is for educational and personal portfolio use. Movie data is provided by TMDB and is subject to their terms of use.
