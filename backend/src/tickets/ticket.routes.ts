import { Router , Request } from 'express';
import { createTicketSchema, updateTicketSchema , moveTicketSchema , createCommentSchema } from './ticket.schemas';
import { createTicket, getTicketById, listTicketsForProject, updateTicket , moveTicket, addComment } from './ticket.service';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { ValidationError } from '../errors';
import { attachLabelToTicket, detachLabelFromTicket } from '../labels/label.service'; // add to imports

interface ProjectParams {
    projectId: string;
}

export const projectTicketRouter = Router({ mergeParams: true }); 
projectTicketRouter.use(requireAuth);

projectTicketRouter.get('/', async (req : Request<ProjectParams>, res) => {
    const projectId = req.params.projectId as string;
    const { assigneeId, priority, labelId } = req.query as Record<string, string|undefined>;
    const tickets = await listTicketsForProject(projectId, { assigneeId, priority, labelId });
    res.json(tickets);
});


projectTicketRouter.post('/', async (req : Request<ProjectParams>, res) => {
  const projectId = req.params.projectId as string;
  const parsed = createTicketSchema.safeParse(req.body);
  if (!parsed.success) throw ValidationError(parsed.error.issues[0].message);

  const { columnId, ...data } = parsed.data;
  const ticket = await createTicket(projectId, columnId, data);
  res.status(201).json(ticket);
});

// Standalone /v1/tickets/:id routes
export const ticketRouter = Router();
ticketRouter.use(requireAuth);

ticketRouter.get('/:id', async (req, res) => {
  const ticket = await getTicketById(req.params.id as string);
  res.json(ticket);
});

ticketRouter.patch('/:id', async (req, res) => {
  const parsed = updateTicketSchema.safeParse(req.body);
  if (!parsed.success) throw ValidationError(parsed.error.issues[0].message);

  const ticket = await updateTicket(req.params.id as string, parsed.data);
  res.json(ticket);
});

ticketRouter.patch('/:id/move', async (req, res) => {
  const parsed = moveTicketSchema.safeParse(req.body);
  if (!parsed.success) throw ValidationError(parsed.error.issues[0].message);

  const ticket = await moveTicket(req.params.id as string, parsed.data.columnId, parsed.data.order);
  res.json(ticket);
});

ticketRouter.post('/:id/comments', async (req: AuthRequest, res) => {
  const parsed = createCommentSchema.safeParse(req.body);
  if (!parsed.success) throw ValidationError(parsed.error.issues[0].message);

  const comment = await addComment(req.params.id as string, req.userId!, parsed.data.body);
  res.status(201).json(comment);
});

ticketRouter.post('/:id/labels/:labelId', async (req, res) => {
  const result = await attachLabelToTicket(req.params.id as string, req.params.labelId as string);
  res.status(201).json(result);
});

ticketRouter.delete('/:id/labels/:labelId', async (req, res) => {
  await detachLabelFromTicket(req.params.id as string, req.params.labelId as string);
  res.status(204).send();
});