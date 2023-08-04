import cors from 'cors';
import express from 'express';
import { router } from './routes';
import { apiErrorHandler } from '@nodejs-microservices/utils';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', router);
app.use(apiErrorHandler);

const host = process.env.USER_SERVICE_HOST;
const port = Number(process.env.USER_SERVICE_PORT);
app.listen(port, host, () => {
    console.log(`Service is ready and running on path: http://${host}:${port}`);
});
