import * as connection from '@notifications/queues/connection';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from '@notifications/queues/email.consumer';
import { Channel } from 'amqplib';

jest.mock('@notifications/queues/connection');
jest.mock('amqplib');
jest.mock('@crunchydeer30/microservices-course-shared');

describe('Email Consumer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('consumeEmailMessages method', () => {
    it('should be called', async () => {
      const channel = {
        assertExchange: jest.fn(),
        assertQueue: jest.fn(),
        publish: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn(),
      };
      jest.spyOn(channel, 'assertExchange');
      jest.spyOn(channel, 'assertQueue').mockReturnValue({
        queue: 'auth-email-queue',
        messageCount: 0,
        consumerCount: 0,
      });
      jest.spyOn(connection, 'createConnection').mockReturnValue(channel as never);
      const connectionChannel = await connection.createConnection();
      await consumeAuthEmailMessages(connectionChannel as Channel);
      expect(connectionChannel!.assertExchange).toHaveBeenCalledWith('auth-notifications', 'direct');
      expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.bindQueue).toHaveBeenCalledWith('auth-email-queue', 'auth-notifications', 'auth-email');
    });
  });

  describe('consumeOrderEmailMessages method', () => {
    it('should be called', async () => {
      const channel = {
        assertExchange: jest.fn(),
        assertQueue: jest.fn(),
        publish: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn(),
      };
      jest.spyOn(channel, 'assertExchange');
      jest.spyOn(channel, 'assertQueue').mockReturnValue({
        queue: 'order-email-queue',
        messageCount: 0,
        consumerCount: 0,
      });
      jest.spyOn(connection, 'createConnection').mockReturnValue(channel as never);
      const connectionChannel = await connection.createConnection();
      await consumeOrderEmailMessages(connectionChannel as Channel);
      expect(connectionChannel!.assertExchange).toHaveBeenCalledWith('order-notifications', 'direct');
      expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.bindQueue).toHaveBeenCalledWith('order-email-queue', 'order-notifications', 'order-email');
    });
  });
});
