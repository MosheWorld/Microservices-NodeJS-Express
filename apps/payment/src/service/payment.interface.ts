import { Payment } from '../types';

export interface IPaymentService {
    getById(id: string): Payment;
    search(email: string): Payment[];
    create(email: string, productId: string, creditCardNumber: string, quantity: number): Payment;
    delete(id: string): void;
}
