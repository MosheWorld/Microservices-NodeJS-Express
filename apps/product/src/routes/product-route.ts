import express from 'express';
import { Factory } from '../factory';
import { IProductRoute } from './product.interface';
import { validateTokenAndSetUserInfoMiddleware } from '@nodejs-microservices/utils';

const router = express.Router({ mergeParams: true });

router.use(validateTokenAndSetUserInfoMiddleware);

const productRoute: IProductRoute = Factory.getRouteInstance();
router.get('/:id', productRoute.getById.bind(productRoute));
router.get('/', productRoute.search.bind(productRoute));
router.post('/', productRoute.create.bind(productRoute));

export { router };
