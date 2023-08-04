import { HttpStatusCode } from 'axios';
import { UserInfoFromToken } from '../types';
import { Request, Response, NextFunction } from 'express';
import { isTokenStructureValid, validateTokenAndGetEmail } from '../utils';

export const USER_KEY = 'user';
export const AUTHORIZATION_KEY = 'authorization';

export async function validateTokenAndSetUserInfoMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader: string = req.headers[AUTHORIZATION_KEY];

    const token = authorizationHeader as string;
    if (!isTokenStructureValid(token)) {
        res.status(HttpStatusCode.Unauthorized).json({ message: 'Invalid token structure' });
        return;
    }

    let userEmail: string;
    try {
        userEmail = await validateTokenAndGetEmail(token);
    } catch (error) {
        const status: number = error.response.status;
        if (status === HttpStatusCode.Unauthorized) {
            res.status(HttpStatusCode.Unauthorized).json({ message: 'Invalid token' });
        } else if (status === HttpStatusCode.InternalServerError) {
            res.status(HttpStatusCode.InternalServerError).json({ message: error.message });
        }

        return;
    }

    const userInfoFromToken: UserInfoFromToken = { email: userEmail };
    req[USER_KEY] = userInfoFromToken;

    next();
}

export function getUserDetailsFromRequest(request: Request): UserInfoFromToken {
    return request[USER_KEY];
}

export function getHeaderWithTokenAndContentType(token: string): { Authorization: string; 'Content-Type': string } {
    return {
        Authorization: token,
        'Content-Type': 'application/json',
    };
}

export function getAuthorizationTokenFromRequest(request: Request): string {
    return request.headers[AUTHORIZATION_KEY] as string;
}
