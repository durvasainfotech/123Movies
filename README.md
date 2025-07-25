# 123Movies - TMDB Movie Streaming Website

A modern movie streaming website built with Next.js, TypeScript, and Tailwind CSS, powered by the TMDB API.

## Features

- 🎬 Browse trending, popular, top-rated, and upcoming movies
- 🔍 Search functionality
- 🎭 Filter movies by genre
- 📱 Responsive design for all devices
- ⚡ Fast and optimized performance
- 🌓 Dark mode support
- 🎥 Detailed movie pages with cast, trailers, and recommendations
- 🧪 Built-in test pages for API and component testing

## Prerequisites

- Node.js 16.8 or later
- npm or yarn
- TMDB API key (get it from [TMDB API](https://www.themoviedb.org/settings/api))

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/movie-streaming-app.git
   cd movie-streaming-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your TMDB API key:
   ```env
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Test Pages

We've included some test pages to help you verify that everything is working correctly:

- `/test/movie` - Run tests for the movie details functionality
- `/test/api` - Test the TMDB API connection and view the response data

## Environment Variables

- `NEXT_PUBLIC_TMDB_API_KEY`: Your TMDB API key (required)
- `NEXT_PUBLIC_BASE_URL`: Base URL for API requests (default: https://api.themoviedb.org/3)

## Development

### Environment Variables

```
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
```

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## Project Structure

- `/app` - Next.js app router pages and layouts
- `/components` - Reusable UI components
- `/lib` - Utility functions and API calls
- `/public` - Static assets
- `/styles` - Global styles and CSS modules
- `/types` - TypeScript type definitions

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type checking
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TMDB API](https://www.themoviedb.org/documentation/api) - Movie data
- [React Icons](https://react-icons.github.io/react-icons/) - Icons
- [SWR](https://swr.vercel.app/) - Data fetching

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This project is for educational purposes only. It uses the TMDB API but is not endorsed or certified by TMDB.
