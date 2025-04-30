# API Integration Guide

This document provides instructions on how to transition from mock data to real API integrations for the Quiz Generator application.

## Overview

The application is designed to work with mock data by default, making it easy to develop and test without requiring real API keys. However, when you're ready to use real services, simply provide the necessary API keys as described below.

The application now uses a PostgreSQL database for persistent storage, providing a robust foundation for storing quiz data, questions, and user results.

## 1. Firebase Authentication

### Current Status
- The app uses mock Firebase authentication when no valid Firebase credentials are provided
- Test user credentials: `test@example.com` / `password123`
- Google sign-in is also mocked

### How to Use Real Firebase
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Add a web app to your project
3. In the Firebase console, go to Authentication and enable Email/Password and Google sign-in methods
4. Add your app domain to the authorized domains list (both development and production domains)
5. Set the following environment variables:
   - `VITE_FIREBASE_API_KEY` - Your Firebase API key
   - `VITE_FIREBASE_PROJECT_ID` - Your Firebase project ID
   - `VITE_FIREBASE_APP_ID` - Your Firebase app ID

Once these variables are set, the app will automatically switch to using real Firebase authentication.

### Implementation Details
- Mock/real logic is in `client/src/lib/firebase.ts`
- The system checks for valid Firebase credentials at startup
- No code changes are needed to switch between mock and real implementations

## 2. PostgreSQL Database Integration

### Current Status
- The app uses a PostgreSQL database for persistent storage
- Database schema and relations are defined in `shared/schema.ts`
- Database connection is configured in `server/db.ts`
- Implementation uses Drizzle ORM for database operations

### Database Schema
The database includes the following tables:
- `users` - User information
- `quizzes` - Quiz metadata
- `questions` - Quiz questions
- `options` - Question answer options
- `quiz_results` - User quiz results

Tables are properly related with foreign keys to maintain data integrity.

### Configuration
1. The application requires a PostgreSQL database connection string 
2. Set the following environment variable:
   - `DATABASE_URL` - Your PostgreSQL connection string (format: `postgres://username:password@host:port/database`)

### Implementation Details
- Database operations are implemented in `server/storage.ts` using the `DatabaseStorage` class
- The application will automatically use the database for storage when the `DATABASE_URL` is available
- Schema changes can be applied using the command: `npm run db:push`

## 3. OpenAI Integration

### Current Status
- The app uses mock quiz generation data when no valid OpenAI API key is provided
- Mock quizzes are available for several topics (JavaScript, Python, History, AI)
- Quiz generation with custom topics will use fallback mock data

### How to Use Real OpenAI
1. Create an OpenAI account at [OpenAI Platform](https://platform.openai.com/)
2. Generate an API key from your account settings
3. Set the following environment variable:
   - `OPENAI_API_KEY` - Your OpenAI API key

Once this variable is set, the app will automatically switch to generating quizzes using the real OpenAI API.

### Implementation Details
- Mock/real logic is in `server/openai.ts`
- The system detects if a valid API key is available at startup
- GPT-4o is used for quiz generation by default
- If you need to customize the model or generation parameters, modify the `generateQuiz` function in `server/openai.ts`

## 4. Testing the Integration

After adding your API keys, you should test that the real services are working correctly:

### Test Firebase Authentication
1. Try registering a new user
2. Sign in with the registered credentials
3. Test Google sign-in functionality
4. Verify that user state persists across page refreshes

### Test OpenAI Integration
1. Create a new quiz with a custom topic
2. Verify that the generated questions are relevant to your topic
3. Check that code snippets are included when requested

## 5. Environment Variables

For local development, you can create a `.env` file in the project root with your API keys:

```
# Database configuration
DATABASE_URL=postgres://username:password@host:port/database

# OpenAI API key for quiz generation
OPENAI_API_KEY=sk-yourapikeyhere

# Firebase configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
```

For deployment, make sure to set these environment variables in your hosting platform.

## 6. Troubleshooting

If you encounter issues when switching to real APIs:

### Firebase Issues
- Check that all required environment variables are set correctly
- Verify that the authentication methods are enabled in Firebase console
- Make sure your domain is added to the authorized domains list
- Check browser console for specific error messages

### OpenAI Issues
- Verify that your API key is valid and has sufficient quota
- Check server logs for detailed error messages
- If you see rate limit errors, you may need to upgrade your OpenAI plan

## 7. Next Steps for Production

Before deploying to production, consider:

1. Adding proper error handling and fallbacks for API failures
2. Implementing caching strategies to reduce API calls
3. Setting up monitoring for API usage and costs
4. Adding usage limits to prevent excessive API consumption