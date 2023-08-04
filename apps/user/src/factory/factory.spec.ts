import { Factory } from './factory';
import { UserDal } from '../dal/user';
import { UserService } from '../service/user';
import { UserRoute } from '../routes/user';

describe('Factory', () => {
    it('should return an instance of UserRoute', () => {
        expect(Factory.getRouteInstance()).toBeInstanceOf(UserRoute);
    });

    it('should return an instance of UserService', () => {
        expect(Factory.getServiceInstance()).toBeInstanceOf(UserService);
    });

    it('should return an instance of UserDal', () => {
        expect(Factory.getDalInstance()).toBeInstanceOf(UserDal);
    });
});
