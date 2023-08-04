import { Payment } from '../../types';
import { IPaymentService } from '../../service';
import { IHandler } from './handler.interface';
import { isNullOrUndefined, PaymentQueueMessage } from '@nodejs-microservices/utils';

export class Handler implements IHandler {
    private service: IPaymentService;

    constructor(service: IPaymentService) {
        this.service = service;
    }

    handle(message: PaymentQueueMessage): void {
        try {
            if (isNullOrUndefined(message.emailToDelete)) {
                return;
            }

            const payments: Payment[] = this.service.search(message.emailToDelete);
            for (const payment of payments) {
                this.service.delete(payment.id);
            }
        } catch (error) {
            // We are logging the error here to prevent it from being propagated and causing the application to crash
            console.error(error);
        }
    }
}
