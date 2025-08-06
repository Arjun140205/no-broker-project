# Mock Data System Implementation

This document explains the mock data system implemented to allow frontend development to continue while the backend database connectivity issues are being resolved.

## Overview

The mock data system provides realistic API responses without requiring a functional database connection. This allows frontend development to proceed in parallel with backend database troubleshooting.

## How It Works

The system works in the following ways:

1. **Automatic Fallback**: When database operations fail, the system automatically falls back to providing mock responses.

2. **Environment Control**: You can explicitly enable mock mode by setting `USE_MOCK_RESPONSES=true` in your environment variables.

3. **Development Mode**: Mock data is automatically used in development environments.

4. **Debug Information**: All mock responses include a `_debug` property that clearly indicates they are mock responses.

## Key Components

### 1. Mock Response Utilities (`/src/utils/mockResponseUtil.ts`)

Provides helper functions to:
- Determine if mock responses should be used
- Create debug information for mock responses
- Handle database errors gracefully

### 2. Mock Data Repository (`/src/utils/mockData.ts`)

Contains pre-defined mock data for:
- Properties
- Users
- Bookings
- Messages

### 3. Environment Configuration (`/src/config/environment.ts`)

Centralizes environment settings including:
- Database connection strings
- Mock data mode control
- JWT secrets
- Server port settings

### 4. Updated Route Handlers

Multiple route handlers have been updated to use mock data, including:
- Authentication routes (`/me` endpoint in authRoutes.ts)
- Property routes (property listing endpoints in propertyController.ts)
- Booking routes (booking creation and listing in bookingController.ts)

### 5. Authentication Middleware Updates

Authentication middleware now provides mock user data when the database is unavailable, allowing authenticated routes to function without a working database.

## Testing the System

You can verify the mock system is working by:

1. Checking the `/api/status` endpoint to confirm mock mode status
2. Testing the `/test-db` endpoint to see database connection status
3. Making requests to any API endpoint - they should all return valid mock responses

## Next Steps

Once the database connectivity issues are resolved:

1. Set `USE_MOCK_RESPONSES=false` in your environment
2. Revert to production mode with `NODE_ENV=production`
3. The system will automatically start using the real database

## Implementation Notes

- No changes to frontend code are required
- All API responses maintain the same structure and format
- Mock data is designed to be realistic and representative
