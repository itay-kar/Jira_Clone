import {Response , NextFunction} from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';
import { ForbiddenError , NotFoundError } from '../errors';

export function requireProjectRole(...allowedRoles: ('ADMIN' | 'MEMBER')[]) {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        const projectId = req.params.projectId || req.params.id;
        const membership = await prisma.projectMembership.findUnique({
            where: {
                projectId_userId: { projectId , userId: req.userId! },
            },
        });

        if (!membership) throw NotFoundError('Membership not found');

        if (!allowedRoles.includes(membership.role)) {
            throw ForbiddenError('You do not have permission to perform this action');
        }

        next();
    };
}
