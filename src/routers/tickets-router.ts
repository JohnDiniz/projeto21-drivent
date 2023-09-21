import { Router } from 'express';
import { getTicketTypes } from '@/controllers';

const ticketsRouter = Router();

ticketsRouter.get('/types', getTicketTypes);

export { ticketsRouter };
