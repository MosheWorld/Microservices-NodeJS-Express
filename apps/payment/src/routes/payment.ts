import { Request, Response } from 'express';
import { Payment } from '../types';
import { NIL as NIL_UUID } from 'uuid';
import { HttpStatusCode } from 'axios';
import { IPaymentService } from '../service';
import { IPaymentRoute } from './payment.interface';
import { isNullOrUndefined, getUserDetailsFromRequest } from '@nodejs-microservices/utils';

export class PaymentRoute implements IPaymentRoute {
    private service: IPaymentService;

    constructor(service: IPaymentService) {
        this.service = service;
    }

    getById(req: Request, res: Response) {
        const { id } = req.params;

        if (isNullOrUndefined(id) || id === NIL_UUID) {
            res.status(HttpStatusCode.BadRequest).json({ message: 'Missing id' });
            return;
        }

        const payment: Payment = this.service.getById(id);
        return res.status(HttpStatusCode.Ok).json(payment);
    }

    search(req: Request, res: Response) {
        const { email } = req.query;

        if (isNullOrUndefined(email)) {
            res.status(HttpStatusCode.BadRequest).json({ message: 'Missing email' });
            return;
        }

        const payments: Payment[] = this.service.search(email as string);
        return res.status(HttpStatusCode.Ok).json(payments);
    }

    create(req: Request, res: Response) {
        const { productId, creditCardNumber, quantity } = req.body;

        if (isNullOrUndefined(productId, creditCardNumber, quantity) || isNaN(quantity)) {
            res.status(HttpStatusCode.BadRequest).json({ message: 'Missing productId, creditCardNumber or quantity' });
            return;
        }

        const { email } = getUserDetailsFromRequest(req);
        const payment: Payment = this.service.create(email, productId, creditCardNumber, quantity);
        return res.status(HttpStatusCode.Ok).json(payment);
    }
}
