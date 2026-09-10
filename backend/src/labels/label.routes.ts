import { Router, Request } from 'express';
import { createLabelSchema } from './label.schemas';
import { createLabel, listLabelsForProject } from './label.service';
import { requireAuth } from '../middleware/auth';
import { ValidationError } from '../errors';

interface ProjectParams {
  projectId: string;
}

// Nested under /v1/projects/:projectId/labels
export const projectLabelRouter = Router({ mergeParams: true });
projectLabelRouter.use(requireAuth);

projectLabelRouter.get('/', async (req: Request<ProjectParams>, res) => {
  const labels = await listLabelsForProject(req.params.projectId);
  res.json(labels);
});

projectLabelRouter.post('/', async (req: Request<ProjectParams>, res) => {
  const parsed = createLabelSchema.safeParse(req.body);
  if (!parsed.success) throw ValidationError(parsed.error.issues[0].message);

  const label = await createLabel(req.params.projectId, parsed.data.name, parsed.data.color);
  res.status(201).json(label);
});