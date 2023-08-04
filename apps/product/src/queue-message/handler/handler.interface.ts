import { ProductQueueMessage } from '@nodejs-microservices/utils';

export interface IHandler {
    handle(message: ProductQueueMessage): void;
}
