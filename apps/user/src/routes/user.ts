import { Request, Response } from 'express';
import { IUserService } from '../service';
import { HttpStatusCode } from 'axios';
import { TokenPayload } from '../types';
import { IUserRoute } from './user.interface';
import { isNullOrUndefined } from '@nodejs-microservices/utils';

export class UserRoute implements IUserRoute {
    private service: IUserService;

    constructor(service: IUserService) {
        this.service = service;
    }

    async signup(req: Request, res: Response) {
        const { email, password } = req.body;

        if (isNullOrUndefined(email) || isNullOrUndefined(password)) {
            res.status(HttpStatusCode.BadRequest).json({ message: 'Missing email or password' });
            return;
        }

        const token = await this.service.signup(email, password);
        return res.status(HttpStatusCode.Ok).json({ token });
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        if (isNullOrUndefined(email) || isNullOrUndefined(password)) {
            res.status(HttpStatusCode.BadRequest).json({ message: 'Missing email or password' });
            return;
        }

        const token = await this.service.login(email, password);
        if (isNullOrUndefined(token)) {
            res.status(HttpStatusCode.Unauthorized).json({ message: 'Invalid email or password' });
            return;
        }

        return res.status(HttpStatusCode.Ok).json({ token });
    }

    async validateToken(req: Request, res: Response) {
        const { token } = req.body;

        let tokenPayload: TokenPayload;
        try {
            tokenPayload = await this.service.validateToken(token);
        } catch (error) {
            res.status(HttpStatusCode.Unauthorized).json({ message: error.message });
            return;
        }

        return res.status(HttpStatusCode.Ok).json(tokenPayload);
    }
}
