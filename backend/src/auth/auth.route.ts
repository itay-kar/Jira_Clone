import {Router} from 'express';
import { registerSchema , loginSchema } from './auth.schemas';
import { registerUser, loginUser } from './auth.service';
import { ValidationError } from '../errors';

export const authRouter = Router();

authRouter.post('/register', async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        throw ValidationError(parsed.error.issues[0].message);
    }

    const { email, password, name } = parsed.data;
    const token = await registerUser(email, password, name);
    res.status(201).json({ token });
});

authRouter.post('/login', async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        throw ValidationError(parsed.error.issues[0].message);
    }
    
    const { email, password } = parsed.data;
    const token = await loginUser(email, password);
    res.json({ token });
});