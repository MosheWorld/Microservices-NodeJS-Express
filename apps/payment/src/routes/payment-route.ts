import express from 'express';
import { Factory } from '../factory';
import { IPaymentRoute } from './payment.interface';
import { validateTokenAndSetUserInfoMiddleware } from '@nodejs-microservices/utils';

const router = express.Router({ mergeParams: true });

router.use(validateTokenAndSetUserInfoMiddleware);

const paymentRoute: IPaymentRoute = Factory.getRouteInstance();
router.get('/:id', paymentRoute.getById.bind(paymentRoute));
router.get('/', paymentRoute.search.bind(paymentRoute));
router.post('/', paymentRoute.create.bind(paymentRoute));

export { router };
