import 'dotenv/config';

import express from 'express';
import pinoHttp from 'pino-http';
import { logger } from './logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { authRouter } from './auth/auth.route';
import { projectRouter } from './projects/project.routes';
import { ticketRouter , projectTicketRouter} from './tickets/ticket.routes';
import { projectLabelRouter } from './labels/label.routes';

const app = express();
app.use(express.json());
app.use(pinoHttp({ logger }));
app.use('/v1/auth', authRouter);
app.use('/v1/projects', projectRouter);
app.use('/v1/projects/:projectId/tickets', projectTicketRouter);
app.use('/v1/tickets', ticketRouter);
app.use('/v1/projects/:projectId/labels', projectLabelRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`));
