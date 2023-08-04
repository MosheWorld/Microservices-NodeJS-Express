import { Product } from '../types';

export interface IProductService {
    getById(id: string): Product;
    search(email: string, price: string): Product[];
    create(email: string, name: string, description: string, price: number): Product;
    delete(id: string): void;
}
