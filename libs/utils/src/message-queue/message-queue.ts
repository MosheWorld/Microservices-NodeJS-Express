import * as amqp from 'amqplib';
import { isNullOrUndefined } from '../utils';
import { InternalServerError } from '../errors';
import { getMessageQueueNames, QueueNames } from './queues';
import { ProductQueueMessage, PaymentQueueMessage } from './types';

let connection = null;
let channel = null;

type MessageCallback = { content: string };

export class MessageQueue {
    static async initialize(messageQueueUrl: string) {
        try {
            connection = await amqp.connect(messageQueueUrl);
            channel = await connection.createChannel();
            for (const queueName of getMessageQueueNames()) {
                await channel.assertQueue(queueName);
            }
        } catch (error) {
            throw new InternalServerError('rror while creating channel or asserting queues');
        }
    }

    static async sendMessage(queueName: QueueNames, message: ProductQueueMessage | PaymentQueueMessage): Promise<void> {
        if (!channel) {
            throw new Error('Channel is not initialized. Call initialize() first.');
        }

        await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    }

    static async registerQueue<T>(queueName: QueueNames, onMessageReceived: (message: T) => void): Promise<void> {
        if (!channel) {
            throw new Error('Channel is not initialized. Call initialize() first.');
        }

        try {
            await channel.consume(queueName, (msg: MessageCallback) => {
                if (!isNullOrUndefined(msg)) {
                    onMessageReceived(JSON.parse(msg.content));
                    channel?.ack(msg);
                }
            });
        } catch (error) {
            throw new InternalServerError('Error while registering to a queue');
        }
    }

    static async closeChannel(): Promise<void> {
        if (channel) {
            await channel.close();
            channel = null;
        }

        if (connection) {
            await connection.close();
            connection = null;
        }
    }
}
