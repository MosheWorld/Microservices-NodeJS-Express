import { MessageQueue } from '@nodejs-microservices/utils';

export async function registerMessageQueues() {
    await MessageQueue.initialize(process.env.MESSAGE_QUEUE_URL);
}
