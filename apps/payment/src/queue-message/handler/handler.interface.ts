import { PaymentQueueMessage } from '@nodejs-microservices/utils';

export interface IHandler {
    handle(message: PaymentQueueMessage): void;
}
