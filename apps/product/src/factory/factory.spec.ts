import { Factory } from './factory';
import { ProductDal } from '../dal';
import { ProductService } from '../service';
import { ProductRoute } from '../routes';
import { Handler } from '../queue-message';

describe('Factory', () => {
    it('should return an instance of ProductRoute', () => {
        expect(Factory.getRouteInstance()).toBeInstanceOf(ProductRoute);
    });

    it('should return an instance of ProductService', () => {
        expect(Factory.getServiceInstance()).toBeInstanceOf(ProductService);
    });

    it('should return an instance of ProductDal', () => {
        expect(Factory.getDalInstance()).toBeInstanceOf(ProductDal);
    });

    it('should return an instance of Handler', () => {
        expect(Factory.getHandlerInstance()).toBeInstanceOf(Handler);
    });
});
