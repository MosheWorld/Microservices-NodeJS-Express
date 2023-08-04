import { Payment } from '../types';

export interface IPaymentDal {
    getById(id: string): Payment;
    search(email: string): Payment[];
    create(payment: Payment): void;
    delete(id: string): void;
}
