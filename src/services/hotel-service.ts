import httpStatus from 'http-status';
import { notFoundError } from '@/errors';
import { PaymentError } from '@/errors/payment-error';
import { enrollmentRepository, hotelsRepository, ticketsRepository } from '@/repositories';

async function receiveHotels(userId: number) {
  await checkConditions(userId);
  const hotels = await hotelsRepository.findHotels();
  if (hotels.length === 0) throw notFoundError();
  return hotels.map((hotel) => {
    return {
      id: hotel.id,
      name: hotel.name,
      image: hotel.image,
      createdAt: hotel.createdAt.toISOString(),
      updatedAt: hotel.updatedAt.toISOString(),
    };
  });
}

async function receiveHotelById(userId: number, hotelId: number) {
  await checkConditions(userId);
  const hotel = await hotelsRepository.findHotelById(hotelId);
  if (!hotel) throw notFoundError();
  return hotel;
}

async function checkConditions(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  const userTicket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!userTicket) {
    throw notFoundError();
  }

  if (userTicket.status !== 'PAID') {
    throw PaymentError('O status do ticket deve ser Pago', httpStatus.PAYMENT_REQUIRED);
  }

  if (userTicket.TicketType.isRemote) {
    throw PaymentError('O tipo de ticket não deve ser remoto', httpStatus.PAYMENT_REQUIRED);
  }

  if (!userTicket.TicketType.includesHotel) {
    throw PaymentError('O TicketType deve incluir hotéis', httpStatus.PAYMENT_REQUIRED);
  }
}

export const hotelsService = {
  receiveHotels,
  receiveHotelById,
};
