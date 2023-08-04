import { HttpStatusCode } from 'axios';
import { Request, Response, NextFunction } from 'express';
import { isTokenStructureValid, validateTokenAndGetEmail } from '../utils';
import { getUserDetailsFromRequest, validateTokenAndSetUserInfoMiddleware, getAuthorizationTokenFromRequest, getHeaderWithTokenAndContentType, AUTHORIZATION_KEY, USER_KEY } from './middleware';

jest.mock('../utils', () => ({
    isTokenStructureValid: jest.fn(() => true),
    validateTokenAndGetEmail: jest.fn(() => Promise.resolve('test@example.com')),
}));

describe('middleware', () => {
    describe('validateTokenAndSetUserInfoMiddleware', () => {
        let req: Partial<Request>;
        let res: Partial<Response>;
        let next: NextFunction;

        beforeEach(() => {
            req = {
                headers: {},
            };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            next = jest.fn();
        });

        afterEach(() => jest.clearAllMocks());

        it('should return 401 Unauthorized if token structure is invalid', async () => {
            // Arrange
            req.headers = { [AUTHORIZATION_KEY]: 'invalid_token' };
            (isTokenStructureValid as jest.Mock).mockReturnValueOnce(false);

            // Act
            await validateTokenAndSetUserInfoMiddleware(req as Request, res as Response, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(HttpStatusCode.Unauthorized);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token structure' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should return 401 Unauthorized if token verification fails', async () => {
            // Arrange
            req.headers = { [AUTHORIZATION_KEY]: 'valid_token' };
            const error = new Error('Invalid token');
            error['response'] = { status: HttpStatusCode.Unauthorized };
            (validateTokenAndGetEmail as jest.Mock).mockRejectedValueOnce(error);

            // Act
            await validateTokenAndSetUserInfoMiddleware(req as Request, res as Response, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(HttpStatusCode.Unauthorized);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should return 500 Internal Server Error for other catch block errors', async () => {
            // Arrange
            req.headers = { [AUTHORIZATION_KEY]: 'valid_token' };
            const error = new Error('Some other error');
            error['response'] = { status: HttpStatusCode.InternalServerError };
            (validateTokenAndGetEmail as jest.Mock).mockRejectedValueOnce(error);

            // Act
            await validateTokenAndSetUserInfoMiddleware(req as Request, res as Response, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(HttpStatusCode.InternalServerError);
            expect(res.json).toHaveBeenCalledWith({ message: 'Some other error' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should set user info from token and call next if token is valid', async () => {
            // Arrange
            req.headers = { [AUTHORIZATION_KEY]: 'valid_token' };

            // Act
            await validateTokenAndSetUserInfoMiddleware(req as Request, res as Response, next);

            // Assert
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
            expect(req[USER_KEY]).toEqual({ email: 'test@example.com' });
        });
    });

    describe('getUserDetailsFromRequest', () => {
        it('should return the user details from the request object', () => {
            // Arrange
            const userEmail = 'test@example.com';
            const reqMock: Partial<Request> = {
                [USER_KEY]: { email: userEmail },
            } as unknown;

            // Act
            const userInfo = getUserDetailsFromRequest(reqMock as Request);

            // Assert
            expect(userInfo).toEqual({ email: userEmail });
        });

        it('should return undefined if user details are not present in the request object', () => {
            // Arrange
            const reqMock: Partial<Request> = {};

            // Act
            const userInfo = getUserDetailsFromRequest(reqMock as Request);

            // Assert
            expect(userInfo).toEqual(undefined);
        });
    });

    describe('getHeaderWithTokenAndContentType', () => {
        it('should return header object with token and content type', () => {
            // Arrange
            const token = 'your-auth-token';
            const expectedHeader = {
                Authorization: token,
                'Content-Type': 'application/json',
            };

            // Act
            const result = getHeaderWithTokenAndContentType(token);

            // Assert
            expect(result).toEqual(expectedHeader);
        });
    });

    describe('getAuthorizationTokenFromRequest', () => {
        it('should return token from Request', () => {
            const mockToken = 'Bearer valid_token';
            const req: Partial<Request> = {
                headers: {
                    [AUTHORIZATION_KEY]: mockToken,
                },
            };

            // Act
            const token = getAuthorizationTokenFromRequest(req as Request);

            // Assert
            expect(token).toEqual(mockToken);
        });
    });
});
