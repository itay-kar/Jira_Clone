import {prisma} from '../lib/prisma';

import {AppError, NotFoundError} from '../errors';

const DEFAULT_COLUMNS = ['To Do', 'In Progress', 'Done'];

export async function createProject(ownerId: string, name: string, key: string) {
    const existing = await prisma.project.findUnique({ where: { key } });
    if (existing) {
        throw new AppError(409, 'PROJECT_EXISTS', 'Project with this key already exists');
    }

    return prisma.project.create({
        data: {
            name,
            key,
            ownerId,
            members: {
                create: {
                    userId: ownerId,
                    role: 'ADMIN',
                },
            },
            board: {
                create: {
                    name: 'Main Board',
                    columns: {
                        create: DEFAULT_COLUMNS.map((name, index) => ({
                            name,
                            order: (index+1) * 1000,
                        })),
                    },
                },
            },
        },
        include: { board: { include: { columns: true } } },
    });
}

export async function listProjectsForUser(userId: string) {
    return prisma.project.findMany({
        where: {
            members: {
                some: { userId },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
}

export async function getProjectById(projectId: string) {
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            board: { include: { columns: true } } },
        });

        if (!project) {
            throw NotFoundError('Project not found');
        }
        
        return project;
    }

export async function updateProject(projectId: string, name: string) {
    const project = await prisma.project.update({
        where: { id: projectId },
        data: { name },
    });

    return project
}

export async function deleteProject(projectId: string) {
  await prisma.project.delete({ where: { id: projectId } });
}