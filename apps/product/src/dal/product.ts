import { Product } from '../types';
import { IProductDal } from './product.interface';

const products: Product[] = [];

export class ProductDal implements IProductDal {
    getById(id: string): Product {
        return products.find((p: Product) => p.id === id);
    }

    search(email: string, price: number): Product[] {
        let filteredProducts = products;

        if (email) {
            filteredProducts = filteredProducts.filter((p: Product) => p.userEmail === email);
        }

        if (price) {
            filteredProducts = filteredProducts.filter((p: Product) => p.price === price);
        }

        return filteredProducts;
    }

    create(product: Product): void {
        products.push(product);
    }

    delete(id: string): void {
        const index = products.findIndex((p: Product) => p.id === id);
        if (index !== -1) {
            products.splice(index, 1);
        }
    }
}
