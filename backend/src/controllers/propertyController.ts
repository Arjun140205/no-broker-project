import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

// POST /properties - Create a new property (auth required)
export const createProperty = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { title, description, price, location, type } = req.body;

    // Validate required fields
    if (!title || !description || !price || !location || !type) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        required: ['title', 'description', 'price', 'location', 'type'],
        received: Object.keys(req.body || {})
      });
    }

    // Validate property type
    const validTypes = ['flat', 'house', 'pg'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        message: 'Invalid property type', 
        validTypes,
        received: type
      });
    }

    // Validate price
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ 
        message: 'Price must be a positive number',
        received: price
      });
    }

    const property = await prisma.property.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        price: numericPrice,
        location: location.trim(),
        type,
        ownerId: req.userId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Property created successfully',
      property,
    });
  } catch (error) {
    console.error('[CREATE PROPERTY ERROR]', error);
    res.status(500).json({ 
      message: 'Failed to create property', 
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// GET /properties - Get all properties (public)
export const getAllProperties = async (req: Request, res: Response) => {
  try {
    // Most basic implementation possible to diagnose issues
    console.log('GET /properties - Fetching all properties with ultra-simplified approach');
    
    // Return a static mock response for diagnosis
    return res.json({
      properties: [
        {
          id: "mock-property-1",
          title: "Mock Property 1",
          description: "This is a mock property to diagnose API issues",
          price: 1000,
          location: "Test Location",
          type: "flat",
          createdAt: new Date().toISOString(),
          owner: {
            id: "mock-user-1",
            name: "Test User",
            email: "test@example.com",
            role: "owner"
          }
        }
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
      _debug: {
        timestamp: new Date().toISOString(),
        message: "This is a mock response to diagnose API issues"
      }
    });
  } catch (error) {
    console.error('[GET ALL PROPERTIES ERROR]', error);
    res.status(500).json({ 
      message: 'Failed to fetch properties', 
      error: error instanceof Error ? error.message : String(error),
      _debug: {
        timestamp: new Date().toISOString(),
        message: "Error occurred in the getAllProperties function"
      }
    });
  }
};

// GET /properties/:id - Get single property details
export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Property ID is required' });
    }
    
    console.log(`GET /properties/${id} - Fetching property with mock response`);
    
    // Return a mock property response
    return res.json({
      id: id,
      title: `Mock Property ${id}`,
      description: "This is a detailed mock property to diagnose API issues. It includes all the fields you would expect from a real property, including a detailed description, amenities, and contact details for the owner.",
      price: 1200,
      location: "123 Mock Street, Test City, Test Country",
      type: "flat",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      amenities: ["WiFi", "Air Conditioning", "Parking"],
      images: [
        "https://via.placeholder.com/800x600.png?text=Mock+Property+Image+1",
        "https://via.placeholder.com/800x600.png?text=Mock+Property+Image+2"
      ],
      owner: {
        id: "mock-user-1",
        name: "Property Owner",
        email: "owner@example.com",
        role: "owner",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      messages: [
        {
          id: "mock-message-1",
          content: "Is this property still available?",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          sender: {
            id: "mock-user-2",
            name: "Interested Seeker",
            email: "seeker@example.com"
          }
        }
      ],
      _debug: {
        mock: true,
        timestamp: new Date().toISOString(),
        message: "This is a mock property details response for development purposes"
      }
    });
  } catch (error) {
    console.error('[GET PROPERTY BY ID ERROR]', error);
    res.status(500).json({ 
      message: 'Failed to fetch property', 
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// GET /my-properties - Get logged-in user's properties
export const getMyProperties = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Since we're using authenticateToken middleware, check for both user and userId
    if (!req.user || !req.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    // Validate pagination params
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ message: 'Invalid page number' });
    }
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 50) {
      return res.status(400).json({ message: 'Invalid limit (1-50)' });
    }

    console.log(`GET /properties/my-properties - Fetching user properties with mock response`);
    
    // Generate a few mock properties
    const mockProperties = Array(3).fill(null).map((_, index) => ({
      id: `mock-property-${index + 1}`,
      title: `Mock Property ${index + 1}`,
      description: `This is mock property ${index + 1} owned by the current user.`,
      price: 1000 + (index * 200),
      location: `${index + 1} Mock Street, Test City, Test Country`,
      type: ['flat', 'house', 'pg'][index % 3],
      createdAt: new Date(Date.now() - (index * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      updatedAt: new Date(Date.now() - (index * 3 * 24 * 60 * 60 * 1000)).toISOString(),
      images: [
        `https://via.placeholder.com/800x600.png?text=Mock+Property+${index + 1}+Image+1`,
        `https://via.placeholder.com/800x600.png?text=Mock+Property+${index + 1}+Image+2`
      ],
      messages: [
        {
          id: `mock-message-${index + 1}`,
          content: `Is property ${index + 1} still available?`,
          timestamp: new Date(Date.now() - ((index + 1) * 24 * 60 * 60 * 1000)).toISOString(),
          sender: {
            id: `mock-seeker-${index + 1}`,
            name: `Seeker ${index + 1}`,
            email: `seeker${index + 1}@example.com`
          }
        }
      ],
      ownerId: req.userId
    }));

    // Create mock pagination
    const totalCount = 3;
    const totalPages = Math.ceil(totalCount / limitNum);
    
    return res.json({
      properties: mockProperties,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      _debug: {
        mock: true,
        timestamp: new Date().toISOString(),
        message: "This is a mock my-properties response for development purposes"
      }
    });

    // Original code commented out:
    /*
    const [properties, totalCount] = await Promise.all([
      prisma.property.findMany({
        where: { ownerId: req.userId },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          messages: {
            select: {
              id: true,
              content: true,
              timestamp: true,
              sender: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
      prisma.property.count({ where: { ownerId: req.userId } }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      properties,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
    */
  } catch (error) {
    console.error('[GET MY PROPERTIES ERROR]', error);
    res.status(500).json({ 
      message: 'Failed to fetch your properties', 
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// DELETE /properties/:id - Delete property (owner only)
export const deleteProperty = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Property ID is required' });
    }
    
    console.log(`DELETE /properties/${id} - Mock delete property`);
    
    // Mock response - always succeed in development
    return res.json({ 
      message: 'Property deleted successfully',
      deletedProperty: {
        id: id,
        title: `Mock Property ${id}`,
      },
      _debug: {
        mock: true,
        timestamp: new Date().toISOString(),
        message: "This is a mock property deletion response for development purposes"
      }
    });
    
    /* Original implementation commented out
    // First, check if property exists and verify ownership
    const property = await prisma.property.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        ownerId: true,
      },
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.ownerId !== req.userId) {
      return res.status(403).json({ 
        message: 'Access denied. You can only delete your own properties' 
      });
    }

    // Delete associated messages first (cascade delete)
    await prisma.message.deleteMany({
      where: { propertyId: id },
    });

    // Delete the property
    await prisma.property.delete({
      where: { id },
    });

    res.json({ 
      message: 'Property deleted successfully',
      deletedProperty: {
        id: property.id,
        title: property.title,
      },
    });
    */
  } catch (error) {
    console.error('[DELETE PROPERTY ERROR]', error);
    res.status(500).json({ 
      message: 'Failed to delete property', 
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
