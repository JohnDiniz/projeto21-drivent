import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '@/middlewares';
import { TicketType } from '@/protocols';

const prisma = new PrismaClient();

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketTypes: TicketType[] = await prisma.ticketType.findMany();

    if (ticketTypes.length === 0) {
      // Return an empty array with a 200 status when there are no ticket types.
      return res.status(401).json([]);
    }

    // If there are ticket types, format and send them as JSON.
    const formattedTicketTypes = ticketTypes.map((type) => ({
      id: type.id,
      name: type.name,
      price: type.price,
      isRemote: type.isRemote,
      includesHotel: type.includesHotel,
      createdAt: type.createdAt,
      updatedAt: type.updatedAt,
    }));

    return res.status(200).json(formattedTicketTypes);
  } catch (error) {
    console.error('Error fetching ticket types:', error);
    return res.status(500).json({ error: 'Error fetching ticket types.' });
  } finally {
    // Always disconnect from the Prisma client to prevent resource leaks.
    await prisma.$disconnect();
  }
}
