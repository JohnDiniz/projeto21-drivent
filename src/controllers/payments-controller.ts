import { Response } from 'express';
import { PrismaClient, TicketStatus } from '@prisma/client';
import { AuthenticatedRequest } from '@/middlewares';

const prisma = new PrismaClient();

export async function getPayment(req: AuthenticatedRequest, res: Response) {
  const { ticketId } = req.query;

  if (!ticketId) {
    return res.status(400).json({ error: 'O parâmetro ticketId é obrigatório' });
  }

  try {
    // Verifique se o ingresso (ticket) existe
    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(ticketId) },
      include: {
        Payment: true,
      },
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ingresso não encontrado' });
    }

    if (!ticket.Payment) {
      return res.status(401).json({ error: 'Informações de pagamento não encontradas' });
    }

    const paymentInfo = {
      id: ticket.Payment.id,
      ticketId: ticket.Payment.ticketId,
      value: ticket.Payment.value,
      cardIssuer: ticket.Payment.cardIssuer,
      cardLastDigits: ticket.Payment.cardLastDigits,
      createdAt: ticket.Payment.createdAt,
      updatedAt: ticket.Payment.updatedAt,
    };

    return res.status(200).json(paymentInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function createTicketPayments(req: AuthenticatedRequest, res: Response) {
  try {
    const { ticketId, cardData } = req.body;

    if (!ticketId || !cardData) {
      return res.status(400).json({ error: 'Os parâmetros ticketId e cardData são obrigatórios' });
    }

    const userId = req.userId;

    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
      },
    });

    if (!enrollment) {
      return res.status(404).json({ error: 'Usuário não cadastrado no evento' });
    }

    const existingTicket = await prisma.ticket.findFirst({
      where: {
        id: ticketId,
      },
    });

    if (!existingTicket) {
      return res.status(404).json({ error: 'O ingresso não foi encontrado' });
    }

    const ticket = await prisma.ticket.findUnique({
      where: {
        id: ticketId,
      },
      include: {
        TicketType: true,
      },
    });

    if (!ticket) {
      return res.status(401).json({ error: 'Usuário não possui ingresso' });
    }

    const existingTicketOwn = await prisma.ticket.findFirst({
      where: {
        enrollmentId: enrollment.id,
        id: ticketId,
      },
    });

    if (!existingTicketOwn) {
      return res.status(401).json({ error: 'Usuário não possui ingresso' });
    }

    const createdPayment = await prisma.payment.create({
      data: {
        ticketId,
        value: ticket.TicketType.price,
        cardIssuer: cardData.issuer,
        cardLastDigits: cardData.number.slice(-4),
      },
    });

    await prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        status: TicketStatus.PAID,
      },
    });

    return res.status(200).json(createdPayment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
