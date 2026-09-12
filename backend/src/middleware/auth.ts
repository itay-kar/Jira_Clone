import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors';

export interface AuthRequest extends Request {
    userId?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        throw UnauthorizedError('Missing token');
    }

    const token = header.slice(7);
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };
        req.userId = payload.sub;
        next();
    } catch {
        throw UnauthorizedError('Invalid token');
    }
}