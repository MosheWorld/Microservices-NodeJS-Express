import { IUserDal, UserDal } from '../dal';
import { IUserService, UserService } from '../service';
import { UserRoute } from '../routes/user';
import { IUserRoute } from '../routes/user.interface';

export class Factory {
    static getRouteInstance(): IUserRoute {
        return new UserRoute(Factory.getServiceInstance());
    }

    static getServiceInstance(): IUserService {
        return new UserService(Factory.getDalInstance());
    }

    static getDalInstance(): IUserDal {
        return new UserDal();
    }
}
