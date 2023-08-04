import { Factory } from './factory';
import { ShopService } from '../service';
import { ShopRoute } from '../routes/shop';

describe('Factory', () => {
    it('should return an instance of ShopRoute', () => {
        expect(Factory.getRouteInstance()).toBeInstanceOf(ShopRoute);
    });

    it('should return an instance of ShopService', () => {
        expect(Factory.getServiceInstance()).toBeInstanceOf(ShopService);
    });
});
