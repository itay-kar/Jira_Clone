import {prisma} from '../lib/prisma';
import {NotFoundError} from '../errors';
import { getIO } from '../lib/socket';
import { Prisma } from '../generated/prisma/client';

export async function createTicket(projectId: string, columnId: string, data: { title: string; description?: string; type: string; assigneeId?: string; priority: string }) { 
    const lastTicket = await prisma.ticket.findFirst({
        where: { columnId },
        orderBy: { order: 'desc' },
    });

    const order = (lastTicket?.order ?? 0) + 1000;

    const created = await prisma.ticket.create({
        data: {
            ...data,
            projectId,
            columnId,
            order,
        } as Prisma.TicketUncheckedCreateInput, // Type assertion to satisfy TypeScript
        include: { assignee: true , labels: { include: { label: true } } },
    });

    getIO().to(`project:${created.projectId}`).emit(`ticket:created`, created);

    return created;
}

export async function getTicketById(ticketId: string) {
    const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
        include: { 
            assignee: true,
            comments: { include: { author: true } , orderBy: { createdAt: 'asc' } },
            labels: { include: { label: true } },
        },
    });

    if (!ticket) {
        throw NotFoundError('Ticket not found');
    }
    
    return ticket;
}

export async function listTicketsForProject(projectId: string , filters: { assigneeId?: string; priority?: string; labelId?: string }) {
    return prisma.ticket.findMany({
        where: {
            projectId,
            ...(filters.assigneeId && { assigneeId: filters.assigneeId }),
            ...(filters.priority && { priority: filters.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' }),
            ...(filters.labelId && { labels: { some: { labelId: filters.labelId } } }),
        },
        include: { assignee: true , labels: { include: { label: true } } },
        orderBy: { order: 'asc' },
    });
}

export async function updateTicket(ticketId: string, data: Record<string, unknown>) {
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
        throw NotFoundError('Ticket not found');
    }

    const updated = await prisma.ticket.update({
        where: { id: ticketId },
        data,
        include: { assignee: true , labels: { include: { label: true } } },
    });

    getIO().to(`project:${updated.projectId}`).emit('ticket:updated',updated);

    return updated;
}

export async function moveTicket(ticketId: string, columnId: string, order: number) {
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
        throw NotFoundError('Ticket not found');
    }
    
    const updated = await prisma.ticket.update({
        where: { id: ticketId },
        data: { columnId, order },
        include: { assignee: true , labels: { include: { label: true } } },
    });

    getIO().to(`project:${updated.projectId}`).emit('ticket:moved',updated);

    return updated;
}

export async function addComment(ticketId: string, authorId: string, body: string) {
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
        throw NotFoundError('Ticket not found');
    }

    return prisma.comment.create({
        data: {
            ticketId,
            authorId,
            body,
        },
        include: { author: true },
    });
}

