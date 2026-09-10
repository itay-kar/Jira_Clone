export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code: string;
    public readonly isOperational: boolean;

    constructor(statusCode: number, code: string, message: string) {
        super(message);

        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

    export const NotFoundError = (resource: string) => {
        return new AppError(404, 'NOT_FOUND', `${resource} not found`);
    };

    export const UnauthorizedError = (message = 'Unauthorized') => {
        return new AppError(401, 'UNAUTHORIZED', message);
    };

    export const ForbiddenError = (message = 'Forbidden') => {
        return new AppError(403, 'FORBIDDEN', message);
    };

    export const ValidationError = (message: string) => {
        return new AppError(422, 'VALIDATION_ERROR', message);
    }