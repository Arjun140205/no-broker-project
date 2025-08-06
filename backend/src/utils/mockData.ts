// This file contains mock data for development when the database is unavailable

/**
 * Mock property data
 */
export const mockProperties = [
  {
    id: "mock-property-1",
    title: "Luxury Apartment in Downtown",
    description: "A beautiful apartment in the heart of the city with all modern amenities.",
    price: 1500,
    location: "Downtown City Center",
    type: "flat",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    amenities: ["WiFi", "AC", "Parking", "Gym", "Swimming Pool"],
    images: [
      "https://via.placeholder.com/800x600.png?text=Luxury+Apartment+Image+1",
      "https://via.placeholder.com/800x600.png?text=Luxury+Apartment+Image+2"
    ],
    owner: {
      id: "mock-owner-1",
      name: "John Owner",
      email: "owner1@example.com",
      role: "owner",
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: "mock-property-2",
    title: "Spacious House in Suburbs",
    description: "A family-friendly house with a large garden and plenty of space.",
    price: 2500,
    location: "Peaceful Suburban Neighborhood",
    type: "house",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    amenities: ["WiFi", "Garden", "Parking", "Pet Friendly"],
    images: [
      "https://via.placeholder.com/800x600.png?text=Spacious+House+Image+1",
      "https://via.placeholder.com/800x600.png?text=Spacious+House+Image+2"
    ],
    owner: {
      id: "mock-owner-2",
      name: "Jane Owner",
      email: "owner2@example.com",
      role: "owner",
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: "mock-property-3",
    title: "Affordable PG Near University",
    description: "Budget-friendly accommodation for students near the university campus.",
    price: 800,
    location: "University District",
    type: "pg",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    amenities: ["WiFi", "Meals Included", "Study Room"],
    images: [
      "https://via.placeholder.com/800x600.png?text=PG+Accommodation+Image+1",
      "https://via.placeholder.com/800x600.png?text=PG+Accommodation+Image+2"
    ],
    owner: {
      id: "mock-owner-3",
      name: "Alice Owner",
      email: "owner3@example.com",
      role: "owner",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  }
];

/**
 * Mock user data
 */
export const mockUsers = [
  {
    id: "mock-user-1",
    name: "John Seeker",
    email: "seeker1@example.com",
    role: "seeker",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "mock-user-2",
    name: "Jane Seeker",
    email: "seeker2@example.com",
    role: "seeker",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "mock-owner-1",
    name: "John Owner",
    email: "owner1@example.com",
    role: "owner",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  }
];

/**
 * Mock booking data
 */
export const mockBookings = [
  {
    id: "mock-booking-1",
    userId: "mock-user-1",
    propertyId: "mock-property-1",
    ownerId: "mock-owner-1",
    status: "pending",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    property: {
      id: "mock-property-1",
      title: "Luxury Apartment in Downtown",
      price: 1500,
      location: "Downtown City Center",
      type: "flat"
    },
    user: {
      id: "mock-user-1",
      name: "John Seeker",
      email: "seeker1@example.com",
      role: "seeker"
    },
    owner: {
      id: "mock-owner-1",
      name: "John Owner",
      email: "owner1@example.com"
    }
  },
  {
    id: "mock-booking-2",
    userId: "mock-user-1",
    propertyId: "mock-property-2",
    ownerId: "mock-owner-2",
    status: "accepted",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    property: {
      id: "mock-property-2",
      title: "Spacious House in Suburbs",
      price: 2500,
      location: "Peaceful Suburban Neighborhood",
      type: "house"
    },
    user: {
      id: "mock-user-1",
      name: "John Seeker",
      email: "seeker1@example.com",
      role: "seeker"
    },
    owner: {
      id: "mock-owner-2",
      name: "Jane Owner",
      email: "owner2@example.com"
    }
  },
  {
    id: "mock-booking-3",
    userId: "mock-user-2",
    propertyId: "mock-property-1",
    ownerId: "mock-owner-1",
    status: "rejected",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    property: {
      id: "mock-property-1",
      title: "Luxury Apartment in Downtown",
      price: 1500,
      location: "Downtown City Center",
      type: "flat"
    },
    user: {
      id: "mock-user-2",
      name: "Jane Seeker",
      email: "seeker2@example.com",
      role: "seeker"
    },
    owner: {
      id: "mock-owner-1",
      name: "John Owner",
      email: "owner1@example.com"
    }
  }
];

/**
 * Mock messages data
 */
export const mockMessages = [
  {
    id: "mock-message-1",
    content: "Hello, I'm interested in your property. Is it still available?",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    propertyId: "mock-property-1",
    senderId: "mock-user-1",
    receiverId: "mock-owner-1",
    sender: {
      id: "mock-user-1",
      name: "John Seeker",
      email: "seeker1@example.com"
    }
  },
  {
    id: "mock-message-2",
    content: "Yes, it's available. When would you like to see it?",
    timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
    propertyId: "mock-property-1",
    senderId: "mock-owner-1",
    receiverId: "mock-user-1",
    sender: {
      id: "mock-owner-1",
      name: "John Owner",
      email: "owner1@example.com"
    }
  },
  {
    id: "mock-message-3",
    content: "I'd like to schedule a viewing for this weekend if possible.",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    propertyId: "mock-property-1",
    senderId: "mock-user-1",
    receiverId: "mock-owner-1",
    sender: {
      id: "mock-user-1",
      name: "John Seeker",
      email: "seeker1@example.com"
    }
  }
];
