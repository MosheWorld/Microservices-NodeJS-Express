import express from 'express';
import { Factory } from '../factory';
import { validateTokenAndSetUserInfoMiddleware } from '@nodejs-microservices/utils';
import { IShopRoute } from './shop.interface';

const router = express.Router({ mergeParams: true });

router.use(validateTokenAndSetUserInfoMiddleware);

const shopRoute: IShopRoute = Factory.getRouteInstance();
router.get('/', shopRoute.getAllUserData.bind(shopRoute));
router.post('/', shopRoute.createSampleData.bind(shopRoute));
router.delete('/', shopRoute.deleteUserData.bind(shopRoute));

export { router };
