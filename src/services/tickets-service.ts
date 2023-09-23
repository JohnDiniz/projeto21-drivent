import { findAllTicketTypes, findTicketByUserId, checkUserEnrollment, createNewTicket } from '@/repositories';
import { TicketType, Ticket } from '@/protocols';

export async function getFormattedTicketTypes(): Promise<TicketType[]> {
  const ticketTypes = await findAllTicketTypes();

  return ticketTypes.map((type) => ({
    id: type.id,
    name: type.name,
    price: type.price,
    isRemote: type.isRemote,
    includesHotel: type.includesHotel,
    createdAt: type.createdAt,
    updatedAt: type.updatedAt,
  }));
}

export async function findUserTicket(userId: number): Promise<Ticket | null> {
  const userTicket = await findTicketByUserId(userId);
  return userTicket;
}

export async function createTicketService(userId: number, ticketTypeId: number) {
  const enrollment = await checkUserEnrollment(userId);

  if (!enrollment) {
    return null;
  }

  const newTicket = await createNewTicket(ticketTypeId, enrollment.id);

  return {
    id: newTicket.id,
    status: newTicket.status,
    ticketTypeId: newTicket.ticketTypeId,
    enrollmentId: newTicket.enrollmentId,
    TicketType: {
      id: newTicket.TicketType.id,
      name: newTicket.TicketType.name,
      price: newTicket.TicketType.price,
      isRemote: newTicket.TicketType.isRemote,
      includesHotel: newTicket.TicketType.includesHotel,
      createdAt: newTicket.TicketType.createdAt,
      updatedAt: newTicket.TicketType.updatedAt,
    },
    createdAt: newTicket.createdAt,
    updatedAt: newTicket.updatedAt,
  };
}
