import { Factory } from '../factory';
import { IHandler } from './handler';
import { ProductQueueMessage, MessageQueue, QueueNames } from '@nodejs-microservices/utils';

export async function registerMessageQueues() {
    const handler: IHandler = Factory.getHandlerInstance();
    await MessageQueue.initialize(process.env.MESSAGE_QUEUE_URL);
    await MessageQueue.registerQueue<ProductQueueMessage>(QueueNames.productMessageQueue, handler.handle.bind(handler));
}
