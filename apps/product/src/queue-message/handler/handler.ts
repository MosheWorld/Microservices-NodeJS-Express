import { Product } from '../../types';
import { IHandler } from './handler.interface';
import { IProductService } from '../../service/product.interface';
import { isNullOrUndefined, ProductQueueMessage } from '@nodejs-microservices/utils';

export class Handler implements IHandler {
    private service: IProductService;

    constructor(service: IProductService) {
        this.service = service;
    }

    handle(message: ProductQueueMessage): void {
        try {
            if (isNullOrUndefined(message.emailToDelete)) {
                return;
            }

            const products: Product[] = this.service.search(message.emailToDelete, null);
            for (const product of products) {
                this.service.delete(product.id);
            }
        } catch (error) {
            // We are logging the error here to prevent it from being propagated and causing the application to crash
            console.error(error);
        }
    }
}
