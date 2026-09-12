import 'dotenv/config';

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io'
import pinoHttp from 'pino-http';
import { logger } from './logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { authRouter } from './auth/auth.route';
import { projectRouter } from './projects/project.routes';
import { ticketRouter , projectTicketRouter} from './tickets/ticket.routes';
import { projectLabelRouter } from './labels/label.routes';
import cors from 'cors';
import { setIO } from './lib/socket';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173'}
});

setIO(io);
io.on('connection', (socket) => {
  logger.info(`Socket Conneceted: ${socket.id}`);

  socket.on('join-project', (projectId:string) => {
  socket.join(`project:${projectId}`);
});

  socket.on('disconnect', () => {
    logger.info(`Socket disconnect: ${socket.id}`)
  });
});


app.use(cors({ origin: 'http://localhost:5173' })); // Adjust the origin as needed
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
httpServer.listen(PORT, () => logger.info(`Server is running on port ${PORT}`));
