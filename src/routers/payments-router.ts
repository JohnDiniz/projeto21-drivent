import { Router } from 'express';
import { getPayment, createTicketPayments } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const paymentsRouter = Router();

paymentsRouter.all('/*', authenticateToken).get('/', getPayment).post('/process', createTicketPayments);

export { paymentsRouter };
