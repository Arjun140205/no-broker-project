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

// 📅 4. POST /book/:propertyId - Send a booking request for a property
export const createBookingRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { propertyId } = req.params;
    const { checkIn, checkOut } = req.body;

    if (!propertyId) {
      return res.status(400).json({ message: 'Property ID is required' });
    }

    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: 'Check-in and check-out dates are required' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    if (checkInDate < new Date()) {
      return res.status(400).json({ message: 'Check-in date cannot be in the past' });
    }

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { owner: true }
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Prevent self-booking
    if (property.ownerId === req.userId) {
      return res.status(400).json({ message: 'Cannot book your own property' });
    }

    // Check for overlapping bookings
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        propertyId,
        status: { in: ['pending', 'accepted'] },
        OR: [
          {
            checkIn: { lte: checkOutDate },
            checkOut: { gte: checkInDate }
          }
        ]
      }
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: 'Property is not available for the selected dates' });
    }

    // Calculate total amount (number of days * daily price)
    const days = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalAmount = days * property.price;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        propertyId,
        userId: req.userId,
        ownerId: property.ownerId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalAmount,
        status: 'pending'
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            location: true,
            images: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Booking request created successfully',
      booking
    });
  } catch (error) {
    console.error('[CREATE BOOKING ERROR]', error);
    res.status(500).json({ message: 'Failed to create booking request', error: 'Internal server error' });
  }
};

// 📂 5. GET /bookings - Fetch all booking requests made by the logged-in user
export const getUserBookings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { page = '1', limit = '10', status } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    // Validate pagination params
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ message: 'Invalid page number' });
    }
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 50) {
      return res.status(400).json({ message: 'Invalid limit (1-50)' });
    }
    
    console.log(`GET /bookings - Fetching user's bookings with mock response`);
    
    // Generate mock bookings with different statuses
    const mockBookings = [
      {
        id: "mock-booking-1",
        userId: req.userId,
        propertyId: "mock-property-1",
        ownerId: "mock-owner-1",
        status: "pending",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        property: {
          id: "mock-property-1",
          title: "Luxury Apartment",
          price: 1500,
          location: "Downtown",
          type: "flat"
        },
        owner: {
          id: "mock-owner-1",
          name: "John Owner",
          email: "owner1@example.com",
        }
      },
      {
        id: "mock-booking-2",
        userId: req.userId,
        propertyId: "mock-property-2",
        ownerId: "mock-owner-2",
        status: "accepted",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        property: {
          id: "mock-property-2",
          title: "Cozy House",
          price: 2000,
          location: "Suburbs",
          type: "house"
        },
        owner: {
          id: "mock-owner-2",
          name: "Jane Owner",
          email: "owner2@example.com",
        }
      },
      {
        id: "mock-booking-3",
        userId: req.userId,
        propertyId: "mock-property-3",
        ownerId: "mock-owner-3",
        status: "rejected",
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        property: {
          id: "mock-property-3",
          title: "PG Accommodation",
          price: 800,
          location: "Near University",
          type: "pg"
        },
        owner: {
          id: "mock-owner-3",
          name: "Alice Owner",
          email: "owner3@example.com",
        }
      }
    ];
    
    // Filter by status if provided
    let filteredBookings = mockBookings;
    if (status && ['pending', 'accepted', 'rejected'].includes(status as string)) {
      filteredBookings = mockBookings.filter(booking => booking.status === status);
    }
    
    // Apply pagination
    const totalCount = filteredBookings.length;
    const totalPages = Math.ceil(totalCount / limitNum);
    const paginatedBookings = filteredBookings.slice((pageNum - 1) * limitNum, pageNum * limitNum);
    
    return res.json({
      bookings: paginatedBookings,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      filters: { status },
      _debug: {
        mock: true,
        timestamp: new Date().toISOString(),
        message: "This is a mock user bookings response for development purposes"
      }
    });
  } catch (error) {
    console.error('[GET USER BOOKINGS ERROR]', error);
    res.status(500).json({ message: 'Failed to fetch your bookings', error: 'Internal server error' });
  }
};

// 📁 6. GET /my-bookings - Fetch all booking requests received by the logged-in property owner
export const getOwnerBookings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { page = '1', limit = '10', status } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    // Validate pagination params
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ message: 'Invalid page number' });
    }
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 50) {
      return res.status(400).json({ message: 'Invalid limit (1-50)' });
    }
    
    console.log(`GET /bookings/my-bookings - Fetching owner's received booking requests with mock response`);
    
    // Generate mock bookings for properties owned by the current user
    const mockBookings = [
      {
        id: "mock-booking-owner-1",
        userId: "mock-user-1",
        propertyId: "mock-property-owned-1",
        ownerId: req.userId,
        status: "pending",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        property: {
          id: "mock-property-owned-1",
          title: "Your Luxury Apartment",
          price: 1800,
          location: "City Center",
          type: "flat"
        },
        user: {
          id: "mock-user-1",
          name: "John Seeker",
          email: "seeker1@example.com",
          role: "seeker"
        }
      },
      {
        id: "mock-booking-owner-2",
        userId: "mock-user-2",
        propertyId: "mock-property-owned-2",
        ownerId: req.userId,
        status: "accepted",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        property: {
          id: "mock-property-owned-2",
          title: "Your Suburban House",
          price: 2500,
          location: "Suburbs",
          type: "house"
        },
        user: {
          id: "mock-user-2",
          name: "Jane Seeker",
          email: "seeker2@example.com",
          role: "seeker"
        }
      },
      {
        id: "mock-booking-owner-3",
        userId: "mock-user-3",
        propertyId: "mock-property-owned-1",
        ownerId: req.userId,
        status: "rejected",
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        property: {
          id: "mock-property-owned-1",
          title: "Your Luxury Apartment",
          price: 1800,
          location: "City Center",
          type: "flat"
        },
        user: {
          id: "mock-user-3",
          name: "Sam Seeker",
          email: "seeker3@example.com",
          role: "seeker"
        }
      }
    ];
    
    // Filter by status if provided
    let filteredBookings = mockBookings;
    if (status && ['pending', 'accepted', 'rejected'].includes(status as string)) {
      filteredBookings = mockBookings.filter(booking => booking.status === status);
    }
    
    // Apply pagination
    const totalCount = filteredBookings.length;
    const totalPages = Math.ceil(totalCount / limitNum);
    const paginatedBookings = filteredBookings.slice((pageNum - 1) * limitNum, pageNum * limitNum);
    
    return res.json({
      bookings: paginatedBookings,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      filters: { status },
      _debug: {
        mock: true,
        timestamp: new Date().toISOString(),
        message: "This is a mock owner bookings response for development purposes"
      }
    });
  } catch (error) {
    console.error('[GET OWNER BOOKINGS ERROR]', error);
    res.status(500).json({ message: 'Failed to fetch received bookings', error: 'Internal server error' });
  }
};

// ✅ 7. PATCH /book/:bookingId/accept - Accept a booking request (only owner can accept)
export const acceptBooking = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({ message: 'Booking ID is required' });
    }
    
    console.log(`PATCH /book/${bookingId}/accept - Mock booking acceptance`);
    
    // Return a mock accepted booking response
    return res.json({
      message: 'Booking request accepted successfully',
      booking: {
        id: bookingId,
        status: 'accepted',
        updatedAt: new Date().toISOString(),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        userId: `mock-user-${Date.now()}`,
        propertyId: `mock-property-${Date.now()}`,
        ownerId: req.userId,
        property: {
          id: `mock-property-${Date.now()}`,
          title: "Luxury Apartment",
          price: 1500,
          location: "Downtown City Center",
        },
        user: {
          id: `mock-user-${Date.now()}`,
          name: "John Seeker",
          email: "seeker@example.com",
        }
      },
      _debug: {
        mock: true,
        timestamp: new Date().toISOString(),
        message: "This is a mock booking acceptance response for development purposes"
      }
    });
  } catch (error) {
    console.error('[ACCEPT BOOKING ERROR]', error);
    res.status(500).json({ message: 'Failed to accept booking request', error: 'Internal server error' });
  }
};

// ✅ 8. PATCH /book/:bookingId/reject - Reject a booking request
export const rejectBooking = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({ message: 'Booking ID is required' });
    }
    
    console.log(`PATCH /book/${bookingId}/reject - Mock booking rejection`);
    
    // Return a mock rejected booking response
    return res.json({
      message: 'Booking request rejected successfully',
      booking: {
        id: bookingId,
        status: 'rejected',
        updatedAt: new Date().toISOString(),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        userId: `mock-user-${Date.now()}`,
        propertyId: `mock-property-${Date.now()}`,
        ownerId: req.userId,
        property: {
          id: `mock-property-${Date.now()}`,
          title: "Luxury Apartment",
          price: 1500,
          location: "Downtown City Center",
        },
        user: {
          id: `mock-user-${Date.now()}`,
          name: "John Seeker",
          email: "seeker@example.com",
        }
      },
      _debug: {
        mock: true,
        timestamp: new Date().toISOString(),
        message: "This is a mock booking rejection response for development purposes"
      }
    });
  } catch (error) {
    console.error('[REJECT BOOKING ERROR]', error);
    res.status(500).json({ message: 'Failed to reject booking request', error: 'Internal server error' });
  }
};
