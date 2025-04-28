# NetView - Netflix Clone

A Netflix-like platform built with React, TypeScript, and Firebase.

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Set up Authentication (Email/Password)
   - Create a Firestore database
   - Get your Firebase configuration

4. Create a TMDB API key:
   - Go to [TMDB](https://www.themoviedb.org/) and create an account
   - Go to your account settings and create an API key

5. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_TMDB_API_KEY=your-tmdb-api-key
   ```

6. Start the development server:
   ```
   npm run dev
   ```

## Features

- User authentication (signup, login, logout)
- Browse movies and TV shows
- View details for specific titles
- Search functionality
- Add to watchlist/favorites
- Responsive design for all devices

## Technologies Used

- React
- TypeScript
- Firebase (Authentication, Firestore)
- Tailwind CSS
- TMDB API
- React Router
- Axios

## Project Structure

- `/src/components`: Reusable UI components
- `/src/context`: React context providers
- `/src/firebase`: Firebase configuration
- `/src/pages`: Application pages
- `/src/services`: API and Firebase service functions
- `/src/types`: TypeScript interfaces and types