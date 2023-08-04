import { Payment } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { IPaymentDal } from '../dal';
import { IPaymentService } from './payment.interface';

export class PaymentService implements IPaymentService {
    private dal: IPaymentDal;

    constructor(dal: IPaymentDal) {
        this.dal = dal;
    }

    getById(id: string): Payment {
        return this.dal.getById(id);
    }

    search(email: string): Payment[] {
        return this.dal.search(email);
    }

    create(email: string, productId: string, creditCardNumber: string, quantity: number): Payment {
        const payment: Payment = {
            id: uuidv4(),
            userEmail: email,
            productId,
            creditCardNumber,
            quantity,
            date: new Date().toISOString(),
        };

        this.dal.create(payment);
        return payment;
    }

    delete(id: string): void {
        this.dal.delete(id);
    }
}
