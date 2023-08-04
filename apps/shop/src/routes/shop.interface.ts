import { Request, Response } from 'express';

export interface IShopRoute {
    getAllUserData(req: Request, res: Response);
    createSampleData(req: Request, res: Response);
    deleteUserData(req: Request, res: Response);
}
