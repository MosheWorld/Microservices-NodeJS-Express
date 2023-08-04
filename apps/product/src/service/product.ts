import { Product } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { IProductDal } from '../dal';
import { IProductService } from './product.interface';

export class ProductService implements IProductService {
    private dal: IProductDal;

    constructor(dal: IProductDal) {
        this.dal = dal;
    }

    getById(id: string): Product {
        return this.dal.getById(id);
    }

    search(email: string, price: string): Product[] {
        const parsedPrice = parseInt(price);
        return this.dal.search(email, parsedPrice);
    }

    create(email: string, name: string, description: string, price: number): Product {
        const product: Product = { id: uuidv4(), userEmail: email, name, description, price };
        this.dal.create(product);
        return product;
    }

    delete(id: string): void {
        this.dal.delete(id);
    }
}
