import { jest } from '@jest/globals';

// Mock Redis configuration
jest.mock('../config/redis.config.js', () => ({
    default: {
        on: jest.fn(),
        quit: jest.fn(),
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
    }
}));

// Mock environment variables
process.env.ACCESS_TOKEN_SECRET = 'test-secret-key-for-jwt-tokens';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';
process.env.NODE_ENV = 'test';
