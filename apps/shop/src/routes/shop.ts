import { Request, Response } from 'express';
import { IShopService } from '../service';
import { HttpStatusCode } from 'axios';
import { DataSummary } from '../types';
import { IShopRoute } from './shop.interface';
import { getUserDetailsFromRequest, getAuthorizationTokenFromRequest } from '@nodejs-microservices/utils';

export class ShopRoute implements IShopRoute {
    private service: IShopService;

    constructor(service: IShopService) {
        this.service = service;
    }

    async getAllUserData(req: Request, res: Response) {
        const { email } = getUserDetailsFromRequest(req);
        const token = getAuthorizationTokenFromRequest(req);

        const dataSummary: DataSummary = await this.service.getAllUserData(token, email);
        res.status(HttpStatusCode.Ok).json(dataSummary);
    }

    async createSampleData(req: Request, res: Response) {
        const token = getAuthorizationTokenFromRequest(req);

        try {
            await this.service.createSampleData(token);
        } catch (error) {
            res.status(HttpStatusCode.InternalServerError).json({ message: error.message });
            return;
        }

        res.status(HttpStatusCode.Ok).json({ message: 'Added sample data successfully' });
    }

    async deleteUserData(req: Request, res: Response) {
        const { email } = getUserDetailsFromRequest(req);

        try {
            await this.service.deleteUserData(email);
        } catch (error) {
            res.status(HttpStatusCode.InternalServerError).json({ message: error.message });
            return;
        }

        res.status(HttpStatusCode.Ok).json({ message: 'Message sent successfully' });
    }
}
