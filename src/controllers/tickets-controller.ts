import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import { getFormattedTicketTypes, findUserTicket, createTicketService } from '@/services';

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketTypes = await getFormattedTicketTypes();

    if (ticketTypes.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(ticketTypes);
  } catch (error) {
    console.error('Error fetching ticket types:', error);
    return res.status(500).json({ error: 'Error fetching ticket types.' });
  }
}

export async function getUserTicket(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId; // Acessa o userId em vez de user
    console.log(userId);
    const userTicket = await findUserTicket(userId);

    if (!userTicket) {
      return res.status(404).json({ error: 'Ticket not found for this user.' });
    }

    return res.status(200).json(userTicket);
  } catch (error) {
    console.error('Error fetching user ticket:', error);
    return res.status(500).json({ error: 'Error fetching user ticket.' });
  }
}

export async function createTicket(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const { ticketTypeId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID not provided.' });
  }

  if (!ticketTypeId) {
    return res.status(400).json({ error: 'ticketTypeId is required in the request body.' });
  }

  try {
    const result = await createTicketService(userId, ticketTypeId);
    if (!result) {
      return res.status(404).json({ error: 'User is not enrolled in the event.' });
    }
    return res.status(201).json(result);
  } catch (error) {
    console.error('Error creating user ticket:', error);
    return res.status(500).json({ error: 'Error creating user ticket.' });
  }
}

// export async function createTicket(req: AuthenticatedRequest, res: Response) {
//   const userId = req.userId; // Acessa o userId em vez de user

//   if (!userId) {
//     return res.status(400).json({ error: 'User ID not provided.' });
//   }

//   const { ticketTypeId } = req.body; // Obtenha o ID do tipo de ingresso do corpo da solicitação

//   if (!ticketTypeId) {
//     return res.status(400).json({ error: 'ticketTypeId is required in the request body.' });
//   }

//   try {
//     // Verifique se o usuário já se cadastrou no evento (na parte de enrollments)
//     const enrollment = await prisma.enrollment.findFirst({
//       where: { userId },
//     });

//     if (!enrollment) {
//       return res.status(404).json({ error: 'User is not enrolled in the event.' });
//     }

//     // Crie um novo ingresso reservado para o usuário
//     const newTicket = await prisma.ticket.create({
//       data: {
//         status: 'RESERVED',
//         ticketTypeId,
//         enrollmentId: enrollment.id,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       include: {
//         TicketType: true,
//       },
//     });

//     return res.status(201).json({
//       id: newTicket.id,
//       status: newTicket.status,
//       ticketTypeId: newTicket.ticketTypeId,
//       enrollmentId: newTicket.enrollmentId,
//       TicketType: {
//         id: newTicket.TicketType.id,
//         name: newTicket.TicketType.name,
//         price: newTicket.TicketType.price,
//         isRemote: newTicket.TicketType.isRemote,
//         includesHotel: newTicket.TicketType.includesHotel,
//         createdAt: newTicket.TicketType.createdAt,
//         updatedAt: newTicket.TicketType.updatedAt,
//       },
//       createdAt: newTicket.createdAt,
//       updatedAt: newTicket.updatedAt,
//     });
//   } catch (error) {
//     console.error('Error creating user ticket:', error);
//     return res.status(500).json({ error: 'Error creating user ticket.' });
//   }
// }
