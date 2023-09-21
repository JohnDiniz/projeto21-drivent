import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '@/middlewares';
import { TicketType } from '@/protocols';

const prisma = new PrismaClient();

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketTypes: TicketType[] = await prisma.ticketType.findMany();

    if (ticketTypes.length === 0) {
      return res.status(204).send();
    }

    const formattedTicketTypes: TicketType[] = ticketTypes.map(
      ({ id, name, price, isRemote, includesHotel, createdAt, updatedAt }) => ({
        id,
        name,
        price,
        isRemote,
        includesHotel,
        createdAt,
        updatedAt,
      }),
    );

    return res.status(200).json(formattedTicketTypes);
  } catch (error) {
    console.error('Erro ao buscar tipos de ingresso:', error);
    return res.status(500).json({ error: 'Erro ao buscar tipos de ingresso.' });
  } finally {
    await prisma.$disconnect();
  }
}
