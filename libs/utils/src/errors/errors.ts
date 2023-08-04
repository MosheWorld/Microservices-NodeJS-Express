import { HttpStatusCode } from 'axios';
import { Request, Response, NextFunction } from 'express';

export class BaseError extends Error {
    public status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export class BadRequestError extends BaseError {
    constructor(message = 'Bad Request', status: number = HttpStatusCode.BadRequest) {
        super(message, status);
    }
}

export class UnauthorizedError extends BaseError {
    constructor(message = 'Unauthorized', status: number = HttpStatusCode.Unauthorized) {
        super(message, status);
    }
}

export class ForbiddenError extends BaseError {
    constructor(message = 'Forbidden', status: number = HttpStatusCode.Forbidden) {
        super(message, status);
    }
}

export class NotFoundError extends BaseError {
    constructor(message = 'Not Found', status: number = HttpStatusCode.NotFound) {
        super(message, status);
    }
}

export class InternalServerError extends BaseError {
    constructor(message = 'Internal Server Error', status: number = HttpStatusCode.InternalServerError) {
        super(message, status);
    }
}

export function apiErrorHandler(error: Error, _: Request, res: Response, next: NextFunction): void {
    if (error instanceof BaseError) {
        switch (error.status) {
            case HttpStatusCode.BadRequest:
                res.status(HttpStatusCode.BadRequest).json({ message: error.message });
                break;
            case HttpStatusCode.Unauthorized:
                res.status(HttpStatusCode.Unauthorized).json({ message: error.message });
                break;
            case HttpStatusCode.Forbidden:
                res.status(HttpStatusCode.Forbidden).json({ message: error.message });
                break;
            case HttpStatusCode.NotFound:
                res.status(HttpStatusCode.NotFound).json({ message: error.message });
                break;
            case HttpStatusCode.InternalServerError:
                res.status(HttpStatusCode.InternalServerError).json({ message: error.message });
                break;
            default:
                res.status(HttpStatusCode.InternalServerError).json({ message: error.message });
        }
    } else {
        res.status(HttpStatusCode.InternalServerError).json({ message: error.message });
    }

    next(error);
}
