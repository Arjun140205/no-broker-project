# Estospaces Frontend

This is the frontend application for Estospaces, a property booking platform built with Next.js and TypeScript.

## Tech Stack

- Next.js
- TypeScript
- Axios for API requests
- JWT-based Authentication
- Tailwind CSS for styling

## Getting Started

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Set up environment variables:

Create a `.env.local` file in the root directory with the following content:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Replace the URL with your backend API URL.

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## API Layer Structure

The API layer is organized as follows:

- `/services/api.ts` - Axios instance setup with JWT authentication and API service functions
- `/hooks/useAuth.ts` - Authentication hook for managing user login, registration, and session

## Available API Services

### Authentication

- `registerUser(data)` - Register a new user
- `loginUser(credentials)` - Log in a user and get JWT token
- `getCurrentUser()` - Get the currently authenticated user
- `logout()` - Log out the current user (client-side)

### Properties

- `getAllProperties()` - Get all available properties
- `getMyProperties()` - Get properties owned by the authenticated user
- `getPropertyById(id)` - Get a specific property by ID
- `createProperty(data)` - Create a new property listing
- `updateProperty(id, data)` - Update an existing property
- `deleteProperty(id)` - Delete a property

### Bookings

- `sendBookingRequest(propertyId)` - Send a booking request for a property
- `getMyBookings()` - Get bookings made by the current user
- `getReceivedBookings()` - Get booking requests received as a property owner
- `acceptBooking(bookingId)` - Accept a booking request
- `rejectBooking(bookingId)` - Reject a booking request

### Chat

- `startChat(propertyId)` - Start or continue a chat about a property
- `getAllChats()` - Get all chats for the current user
- `sendMessage(chatId, messageData)` - Send a message in a chat
- `getChatMessages(chatId)` - Get all messages from a specific chat

## Pages

- `/login` - User login
- `/register` - User registration
- `/` - Homepage with all property listings
- `/dashboard/my-properties` - User's posted properties
- `/dashboard/bookings` - User's booking requests
- `/dashboard/requests` - Booking requests received as an owner
- `/dashboard/chat` - Chat interface
