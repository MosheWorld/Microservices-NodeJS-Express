import { Product } from '../types';

export interface IProductDal {
    getById(id: string): Product;
    search(email: string, price: number): Product[];
    create(product: Product): void;
    delete(id: string): void;
}
