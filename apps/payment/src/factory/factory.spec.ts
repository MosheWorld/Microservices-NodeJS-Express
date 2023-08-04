import { Factory } from './factory';
import { PaymentDal } from '../dal';
import { PaymentService } from '../service';
import { PaymentRoute } from '../routes';
import { Handler } from '../queue-message';

describe('Factory', () => {
    it('should return an instance of PaymentRoute', () => {
        expect(Factory.getRouteInstance()).toBeInstanceOf(PaymentRoute);
    });

    it('should return an instance of PaymentService', () => {
        expect(Factory.getServiceInstance()).toBeInstanceOf(PaymentService);
    });

    it('should return an instance of PaymentDal', () => {
        expect(Factory.getDalInstance()).toBeInstanceOf(PaymentDal);
    });

    it('should return an instance of Handler', () => {
        expect(Factory.getHandlerInstance()).toBeInstanceOf(Handler);
    });
});
