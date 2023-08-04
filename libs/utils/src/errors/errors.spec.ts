import { HttpStatusCode } from 'axios';
import { Request, Response, NextFunction } from 'express';
import { apiErrorHandler, BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError, BaseError } from './errors';

describe('Errors', () => {
    describe('Error Classes', () => {
        test.each([
            [BadRequestError, HttpStatusCode.BadRequest, 'Bad Request'],
            [UnauthorizedError, HttpStatusCode.Unauthorized, 'Unauthorized'],
            [ForbiddenError, HttpStatusCode.Forbidden, 'Forbidden'],
            [NotFoundError, HttpStatusCode.NotFound, 'Not Found'],
            [InternalServerError, HttpStatusCode.InternalServerError, 'Internal Server Error'],
        ])('%p should have the correct status code and default message', (ErrorClass, expectedStatusCode, expectedDefaultMessage) => {
            const error = new ErrorClass();
            expect(error.status).toBe(expectedStatusCode);
            expect(error.message).toBe(expectedDefaultMessage);
        });

        test('should have custom messages', () => {
            const customMessage = 'Custom Message';

            const badRequestError = new BadRequestError(customMessage);
            expect(badRequestError.message).toBe(customMessage);

            const unauthorizedError = new UnauthorizedError(customMessage);
            expect(unauthorizedError.message).toBe(customMessage);

            const forbiddenError = new ForbiddenError(customMessage);
            expect(forbiddenError.message).toBe(customMessage);

            const notFoundError = new NotFoundError(customMessage);
            expect(notFoundError.message).toBe(customMessage);

            const internalServerError = new InternalServerError(customMessage);
            expect(internalServerError.message).toBe(customMessage);
        });
    });

    describe('apiErrorHandler', () => {
        const mockRequest: Partial<Request> = {};
        const mockResponse: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const mockNext: NextFunction = jest.fn();

        afterEach(() => jest.clearAllMocks());

        test.each([
            [HttpStatusCode.BadRequest, 'Bad Request Error', HttpStatusCode.BadRequest],
            [HttpStatusCode.Unauthorized, 'Unauthorized Error', HttpStatusCode.Unauthorized],
            [HttpStatusCode.Forbidden, 'Forbidden Error', HttpStatusCode.Forbidden],
            [HttpStatusCode.NotFound, 'Not Found Error', HttpStatusCode.NotFound],
            [HttpStatusCode.InternalServerError, 'Internal Server Error', HttpStatusCode.InternalServerError],
            [503, 'Unknown Error', HttpStatusCode.InternalServerError],
            [undefined, 'Some unknown error', HttpStatusCode.InternalServerError],
        ])('should handle %p correctly', (statusCode, errorMessage, expectedStatus) => {
            // Arrange
            const error = statusCode ? new BaseError(errorMessage, statusCode) : new Error(errorMessage);

            // Act
            apiErrorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

            // Assert
            const expectedStatusCode = expectedStatus;
            const expectedErrorMessage = error.message;

            expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: expectedErrorMessage });
            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });
});
