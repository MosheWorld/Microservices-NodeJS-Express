import express from 'express';
import { Factory } from '../factory';
import { IUserRoute } from './user.interface';

const router = express.Router({ mergeParams: true });

const userRoute: IUserRoute = Factory.getRouteInstance();
router.post('/signup', userRoute.signup.bind(userRoute));
router.post('/login', userRoute.login.bind(userRoute));
router.post('/validate-token', userRoute.validateToken.bind(userRoute));

export { router };
