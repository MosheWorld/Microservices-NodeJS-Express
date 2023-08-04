import { IShopService, ShopService } from '../service';
import { ShopRoute } from '../routes/shop';
import { IShopRoute } from '../routes/shop.interface';

export class Factory {
    static getRouteInstance(): IShopRoute {
        return new ShopRoute(Factory.getServiceInstance());
    }

    static getServiceInstance(): IShopService {
        return new ShopService();
    }
}
