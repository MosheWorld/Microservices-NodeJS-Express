import { Handler, IHandler } from '../queue-message';
import { IPaymentDal, PaymentDal } from '../dal';
import { IPaymentService, PaymentService } from '../service';
import { PaymentRoute } from '../routes/payment';
import { IPaymentRoute } from '../routes/payment.interface';

export class Factory {
    static getRouteInstance(): IPaymentRoute {
        return new PaymentRoute(Factory.getServiceInstance());
    }

    static getServiceInstance(): IPaymentService {
        return new PaymentService(Factory.getDalInstance());
    }

    static getDalInstance(): IPaymentDal {
        return new PaymentDal();
    }

    static getHandlerInstance(): IHandler {
        return new Handler(Factory.getServiceInstance());
    }
}
