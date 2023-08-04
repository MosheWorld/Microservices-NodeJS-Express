import { Request, Response } from 'express';

export interface IUserRoute {
    signup(req: Request, res: Response);
    login(req: Request, res: Response);
    validateToken(req: Request, res: Response);
}
