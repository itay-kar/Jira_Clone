import {z} from 'zod';

export const createTicketSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    type: z.enum(['BUG', 'TASK' , 'STORY']).default('TASK'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH' , 'URGENT']).default('MEDIUM'),
    assigneeId: z.uuid().optional(),
    columnId: z.uuid(),
});

export const updateTicketSchema = z.object({
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().optional(),
    type: z.enum(['BUG', 'TASK' , 'STORY']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH' , 'URGENT']).optional(),
    assigneeId: z.uuid().nullable().optional(),
});

export const moveTicketSchema = z.object({
    columnId: z.uuid(),
    order: z.number().int(),
});

export const createCommentSchema = z.object({
    body: z.string().min(1, 'Comment body is required'),
});