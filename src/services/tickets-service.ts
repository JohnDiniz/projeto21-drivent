import { findAllTicketTypes, findTicketByUserId, checkUserEnrollment, createNewTicket } from '@/repositories';
import { TicketType, Ticket } from '@/protocols';

export async function getFormattedTicketTypes(): Promise<TicketType[]> {
  const ticketTypes = await findAllTicketTypes();
  return ticketTypes;
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

  return newTicket;
}
