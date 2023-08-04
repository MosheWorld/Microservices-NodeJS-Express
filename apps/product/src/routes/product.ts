import { Request, Response } from 'express';
import { Product } from '../types';
import { NIL as NIL_UUID } from 'uuid';
import { HttpStatusCode } from 'axios';
import { IProductService } from '../service';
import { IProductRoute } from './product.interface';
import { isNullOrUndefined, getUserDetailsFromRequest } from '@nodejs-microservices/utils';

export class ProductRoute implements IProductRoute {
    private service: IProductService;

    constructor(service: IProductService) {
        this.service = service;
    }

    getById(req: Request, res: Response) {
        const { id } = req.params;

        if (isNullOrUndefined(id) || id === NIL_UUID) {
            res.status(HttpStatusCode.BadRequest).json({ message: 'Missing id' });
            return;
        }

        const product: Product = this.service.getById(id);
        return res.status(HttpStatusCode.Ok).json(product);
    }

    search(req: Request, res: Response) {
        const { email, price } = req.query;

        if (isNullOrUndefined(email) && isNullOrUndefined(price)) {
            res.status(HttpStatusCode.BadRequest).json({ message: 'Missing email and price' });
            return;
        }

        const products: Product[] = this.service.search(email as string, price as string);
        return res.status(HttpStatusCode.Ok).json(products);
    }

    create(req: Request, res: Response) {
        const { name, description, price } = req.body;

        if (isNullOrUndefined(name, description, price) || isNaN(price)) {
            res.status(HttpStatusCode.BadRequest).json({ message: 'Missing name, description or price' });
            return;
        }

        const { email } = getUserDetailsFromRequest(req);
        const product: Product = this.service.create(email, name, description, price);
        return res.status(HttpStatusCode.Ok).json(product);
    }
}
