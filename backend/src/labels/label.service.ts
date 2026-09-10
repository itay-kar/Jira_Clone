import { prisma } from '../lib/prisma';
import { AppError, NotFoundError } from '../errors';

export async function createLabel(projectId: string, name: string, color?: string) {
  const existing = await prisma.label.findUnique({
    where: { projectId_name: { projectId, name } },
  });
  if (existing) throw new AppError(409, 'LABEL_EXISTS', 'A label with this name already exists');

  return prisma.label.create({
    data: { projectId, name, color: color ?? '#999999' },
  });
}

export async function listLabelsForProject(projectId: string) {
  return prisma.label.findMany({ where: { projectId }, orderBy: { name: 'asc' } });
}

export async function attachLabelToTicket(ticketId: string, labelId: string) {
  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (!ticket) throw NotFoundError('Ticket');

  const label = await prisma.label.findUnique({ where: { id: labelId } });
  if (!label) throw NotFoundError('Label');

  return prisma.ticketLabel.create({
    data: { ticketId, labelId },
  });
}

export async function detachLabelFromTicket(ticketId: string, labelId: string) {
  await prisma.ticketLabel.delete({
    where: { ticketId_labelId: { ticketId, labelId } },
  });
}