import {Router} from 'express';
import { createProjectSchema, updateProjectSchema } from './project.schemas';
import { createProject, listProjectsForUser, getProjectById, updateProject } from './project.service';
import { requireAuth , AuthRequest } from '../middleware/auth';
import { requireProjectRole } from '../middleware/requireProjectRole';
import { ValidationError } from '../errors';

export const projectRouter = Router();

projectRouter.use(requireAuth);

projectRouter.get('/', async (req: AuthRequest, res) => {
    const projects = await listProjectsForUser(req.userId!);
    res.json(projects);
});

projectRouter.post('/', async (req: AuthRequest, res) => {
    const parsed = createProjectSchema.safeParse(req.body);
    if (!parsed.success) {
        throw ValidationError(parsed.error.issues[0].message);
    }

    const project = await createProject(req.userId!, parsed.data.name , parsed.data.key);
    res.status(201).json(project);
});

projectRouter.get('/:id', async (req, res) => {
    const project = await getProjectById(req.params.id);
    res.json(project);
});

projectRouter.patch('/:id', requireProjectRole('ADMIN'), async (req, res) => {
    const parsed = updateProjectSchema.safeParse(req.body);
    if (!parsed.success) {
        throw ValidationError(parsed.error.issues[0].message);
    }

    const project = await updateProject(req.params.id as string, parsed.data.name!);
    res.json(project);
});