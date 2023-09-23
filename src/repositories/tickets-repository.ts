import { PrismaClient, TicketType } from '@prisma/client';

const prisma = new PrismaClient();

export async function findAllTicketTypes(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

export async function findTicketByUserId(userId: number) {
  try {
    const ticket = await prisma.ticket.findFirst({
      where: {
        Enrollment: {
          userId: userId,
        },
      },
      include: {
        TicketType: true,
      },
    });

    return ticket;
  } catch (error) {
    throw error;
  }
}

export async function createTicket(ticketData: any) {
  try {
    const createdTicket = await prisma.ticket.create({
      data: ticketData,
    });

    return createdTicket;
  } catch (error) {
    throw error;
  }
}

export async function checkUserEnrollment(userId: number) {
  return await prisma.enrollment.findFirst({
    where: { userId },
  });
}

export async function createNewTicket(ticketTypeId: number, enrollmentId: number) {
  return await prisma.ticket.create({
    data: {
      status: 'RESERVED',
      ticketTypeId,
      enrollmentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    include: {
      TicketType: true,
    },
  });
}
