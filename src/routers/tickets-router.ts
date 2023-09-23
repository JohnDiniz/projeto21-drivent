import { Router } from 'express';
import { getTicketTypes, getUserTicket, createTicket } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketTypes)
  .get('/', getUserTicket)
  .post('/', createTicket);

export { ticketsRouter };
