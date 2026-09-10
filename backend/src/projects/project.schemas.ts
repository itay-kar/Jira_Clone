import {z} from 'zod';

export const createProjectSchema = z.object({
    name : z.string().min(1, 'Project name is required'),
    key : z.string().min(2).max(10).toUpperCase(),
});

export const updateProjectSchema = z.object({
    name : z.string().min(1, 'Project name is required').optional(),
});

