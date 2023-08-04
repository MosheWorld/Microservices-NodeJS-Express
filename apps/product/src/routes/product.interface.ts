import { Request, Response } from 'express';

export interface IProductRoute {
    getById(req: Request, res: Response);
    search(req: Request, res: Response);
    create(req: Request, res: Response);
}
