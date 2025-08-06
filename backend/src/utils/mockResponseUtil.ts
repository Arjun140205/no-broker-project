import { Response } from 'express';

// This utility file provides mock response helpers for development when database is unavailable

/**
 * Helper function to determine if we should use mock responses
 * This can be controlled via environment variable or automatically detected from database errors
 */
export const shouldUseMockResponses = (): boolean => {
  // Check if environment variable is set to enable mock responses
  const useMockEnv = process.env.USE_MOCK_RESPONSES?.toLowerCase();
  if (useMockEnv === 'true' || useMockEnv === '1') {
    return true;
  }
  
  // Add any other logic to determine if mock responses should be used
  // For example, you might want to check if a global flag was set after a database error
  
  // For now, we'll default to using mock responses during development
  return process.env.NODE_ENV !== 'production';
};

/**
 * Adds a debug object to responses when using mock data
 */
export const createMockDebugInfo = (message: string = 'This is a mock response for development purposes') => {
  return {
    mock: true,
    timestamp: new Date().toISOString(),
    message
  };
};

/**
 * Handle database errors gracefully by returning mock data when needed
 */
export const handleDatabaseError = (error: any, res: Response, errorMessage: string, mockResponse: any) => {
  console.error(`[DATABASE ERROR] ${errorMessage}:`, error);
  
  if (shouldUseMockResponses()) {
    console.log(`Returning mock response due to database error: ${errorMessage}`);
    // Add debug info to mock response
    if (typeof mockResponse === 'object' && mockResponse !== null) {
      mockResponse._debug = createMockDebugInfo(`Mock response provided due to error: ${errorMessage}`);
    }
    return res.json(mockResponse);
  } else {
    // In production, return an actual error
    return res.status(500).json({ 
      message: errorMessage,
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
