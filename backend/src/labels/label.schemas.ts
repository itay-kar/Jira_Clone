import { z } from 'zod';

export const createLabelSchema = z.object({
  name: z.string().min(1),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a hex code like #FF5733').optional(),
});