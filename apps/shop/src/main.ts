import cors from 'cors';
import express from 'express';
import { router } from './routes';
import { registerMessageQueues } from './queue-message';
import { apiErrorHandler } from '@nodejs-microservices/utils';

registerMessageQueues();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', router);
app.use(apiErrorHandler);

const host = process.env.SHOP_SERVICE_HOST;
const port = Number(process.env.SHOP_SERVICE_PORT);
app.listen(port, host, () => {
    console.log(`Service is ready and running on path: http://${host}:${port}`);
});
