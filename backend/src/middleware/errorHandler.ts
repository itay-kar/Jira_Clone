import {Request, Response, NextFunction} from 'express';
import {AppError} from '../errors';
import {logger} from '../logger';

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AppError) {
        logger.warn({ err , path: req.path}, err.message);
        return res.status(err.statusCode).json({
            error: {
                code: err.code,
                message: err.message,
            },
        });
    }

    logger.error({ err , path: req.path}, 'Unhandled error');
    return res.status(500).json({
        error: {
            code: 'INTERNAL_ERROR',
            message: `An unexpected error occurred`,
        },
    });
}

export function notFoundHandler(req: Request, res: Response) {
    res.status(404).json({
        error: {
            code: 'NOT_FOUND',
            message: `No route for ${req.method} ${req.path}`},
        });
    }