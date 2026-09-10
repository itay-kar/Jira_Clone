import 'dotenv/config';

import express from 'express';
import pinoHttp from 'pino-http';
import { logger } from './logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import {authRouter} from './auth/auth.route';

const app = express();
app.use(express.json());
app.use(pinoHttp({ logger }));
app.use('/v1/auth', authRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`));
