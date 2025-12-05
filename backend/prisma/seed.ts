import { PrismaClient, Role, PropertyType, BookingStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const owner = await prisma.user.create({
    data: {
      name: 'Owner User',
      email: 'owner@example.com',
      passwordHash: await bcrypt.hash('password123', 10),
      role: 'owner',
    },
  });

  const seeker = await prisma.user.create({
    data: {
      name: 'Seeker User',
      email: 'seeker@example.com',
      passwordHash: await bcrypt.hash('password123', 10),
      role: 'seeker',
    },
  });

  // Create property
  const property = await prisma.property.create({
    data: {
      title: 'Test Apartment',
      description: 'A beautiful test apartment',
      price: 1500,
      location: 'Test City',
      city: 'Test City',
      state: 'Test State',
      type: 'flat',
      images: ['/properties/images/1.jpg', '/properties/images/2.jpg'],
      amenities: ['WiFi', 'Parking', 'AC'],
      owner: { connect: { id: owner.id } },
    },
  });

  // Create chat
  const chat = await prisma.chat.create({
    data: {
      buyer: { connect: { id: seeker.id } },
      owner: { connect: { id: owner.id } },
      property: { connect: { id: property.id } },
    },
  });

  // Create a message
  await prisma.message.create({
    data: {
      content: 'Hello, I am interested in this property!',
      sender: { connect: { id: seeker.id } },
      chat: { connect: { id: chat.id } },
      property: { connect: { id: property.id } },
    },
  });

  // Create a booking
  await prisma.booking.create({
    data: {
      property: { connect: { id: property.id } },
      user: { connect: { id: seeker.id } },
      owner: { connect: { id: owner.id } },
      checkIn: new Date('2025-12-10'),
      checkOut: new Date('2025-12-15'),
      totalAmount: 7500,
      status: 'pending',
    },
  });

  console.log('Seed data created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
