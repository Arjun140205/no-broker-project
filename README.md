# EstoSpaces - Property Rental Platform

EstoSpaces is a full-stack property rental marketplace that connects property owners with potential tenants.

## Project Structure

This repository contains both backend and frontend components:

- `backend/` - Node.js/Express API with TypeScript and Prisma ORM
- `frontend/` - Next.js web application with React and TypeScript

## Getting Started

### Prerequisites

- Node.js v16+
- npm or yarn
- PostgreSQL database (or compatible alternative)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env file with your database connection string

# Run development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local with your API URL

# Run development server
npm run dev
```

## Features

- User authentication (login/register)
- Property listing and search
- Real-time chat between users
- Booking system
- User dashboard

## Development

When making changes:

1. Create feature branches: `git checkout -b feature/your-feature-name`
2. Make changes and test
3. Commit with descriptive messages
4. Push to GitHub and create Pull Request

## License

This project is licensed under the MIT License.
