import { Handler, IHandler } from '../queue-message';
import { IProductDal, ProductDal } from '../dal';
import { IProductService, ProductService } from '../service';
import { ProductRoute } from '../routes/product';
import { IProductRoute } from '../routes/product.interface';

export class Factory {
    static getRouteInstance(): IProductRoute {
        return new ProductRoute(Factory.getServiceInstance());
    }

    static getServiceInstance(): IProductService {
        return new ProductService(Factory.getDalInstance());
    }

    static getDalInstance(): IProductDal {
        return new ProductDal();
    }

    static getHandlerInstance(): IHandler {
        return new Handler(Factory.getServiceInstance());
    }
}
