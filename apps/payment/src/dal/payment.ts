import { Payment } from '../types';
import { IPaymentDal } from './payment.interface';

const payments: Payment[] = [];

export class PaymentDal implements IPaymentDal {
    getById(id: string): Payment {
        return payments.find((p: Payment) => p.id === id);
    }

    search(email: string): Payment[] {
        let filteredPayment = payments;

        if (email) {
            filteredPayment = filteredPayment.filter((p: Payment) => p.userEmail === email);
        }

        return filteredPayment;
    }

    create(payment: Payment): void {
        payments.push(payment);
    }

    delete(id: string): void {
        const index = payments.findIndex((p: Payment) => p.id === id);
        if (index !== -1) {
            payments.splice(index, 1);
        }
    }
}
