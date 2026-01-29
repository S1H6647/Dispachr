import { login, logout, forgetPassword, resetPassword, googleLogin } from '../controller/auth.controller.js';
import userSchema from '../schema/user.schema.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { sendResetPasswordEmail } from '../services/email.service.js';
import { jest } from '@jest/globals';

// Mock dependencies
jest.mock('../schema/user.schema.js');
jest.mock('argon2');
jest.mock('jsonwebtoken');
jest.mock('../services/email.service.js');
jest.mock('../middleware/createToken.js', () => ({
    createToken: jest.fn((response, token, isRemember) => {
        response.cookie('auth-token', token);
    })
}));

describe('Auth Controller', () => {
    let mockRequest;
    let mockResponse;

    beforeEach(() => {
        mockRequest = {
            body: {},
            params: {},
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            cookie: jest.fn().mockReturnThis(),
            clearCookie: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should return 400 if validation fails', async () => {
            mockRequest.body = {
                email: 'invalid-email',
                password: 'short',
            };

            await login(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: false,
                    message: 'Validation failed',
                })
            );
        });

        it('should return 401 if user does not exist', async () => {
            mockRequest.body = {
                email: 'test@example.com',
                password: 'password123',
            };

            userSchema.scope = jest.fn().mockReturnValue({
                findOne: jest.fn().mockResolvedValue(null),
            });

            await login(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: false,
                    message: "The user doesn't exist!",
                })
            );
        });

        it('should return 401 if password is invalid', async () => {
            mockRequest.body = {
                email: 'test@example.com',
                password: 'wrongpassword',
            };

            const mockUser = {
                id: 1,
                email: 'test@example.com',
                password: 'hashedPassword',
                fullName: 'Test User',
            };

            userSchema.scope = jest.fn().mockReturnValue({
                findOne: jest.fn().mockResolvedValue(mockUser),
            });

            argon2.verify = jest.fn().mockResolvedValue(false);

            await login(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: false,
                    message: 'Invalid password.',
                })
            );
        });

        it('should return 200 and token on successful login', async () => {
            mockRequest.body = {
                email: 'test@example.com',
                password: 'password123',
                isRemember: false,
            };

            const mockUser = {
                id: 1,
                email: 'test@example.com',
                password: 'hashedPassword',
                fullName: 'Test User',
            };

            userSchema.scope = jest.fn().mockReturnValue({
                findOne: jest.fn().mockResolvedValue(mockUser),
            });

            argon2.verify = jest.fn().mockResolvedValue(true);
            jwt.sign = jest.fn().mockReturnValue('mock-token');

            await login(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: true,
                    message: 'Login successful',
                    data: {
                        id: 1,
                        fullName: 'Test User',
                        email: 'test@example.com',
                    },
                })
            );
        });

        it('should use longer expiry when isRemember is true', async () => {
            mockRequest.body = {
                email: 'test@example.com',
                password: 'password123',
                isRemember: true,
            };

            const mockUser = {
                id: 1,
                email: 'test@example.com',
                password: 'hashedPassword',
                fullName: 'Test User',
            };

            userSchema.scope = jest.fn().mockReturnValue({
                findOne: jest.fn().mockResolvedValue(mockUser),
            });

            argon2.verify = jest.fn().mockResolvedValue(true);
            jwt.sign = jest.fn().mockReturnValue('mock-token');

            await login(mockRequest, mockResponse);

            expect(jwt.sign).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
                { expiresIn: '24h' }
            );
        });
    });

    describe('logout', () => {
        it('should clear cookie and return 200', async () => {
            await logout({}, mockResponse);

            expect(mockResponse.clearCookie).toHaveBeenCalledWith('auth-token', {
                secure: true,
                httpOnly: true,
                path: '/',
                sameSite: 'lax',
            });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: true,
                    message: 'Logged out successfully',
                })
            );
        });
    });

    describe('forgetPassword', () => {
        it('should return 400 if email is missing', async () => {
            mockRequest.body = {};

            await forgetPassword(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Invalid payload',
                })
            );
        });

        it('should return 404 if user not found', async () => {
            mockRequest.body = { email: 'notfound@example.com' };

            userSchema.findOne = jest.fn().mockResolvedValue(null);

            await forgetPassword(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: "We couldn't find an account associated with this email.",
                })
            );
        });

        it('should send reset email and return 200 on success', async () => {
            mockRequest.body = { email: 'test@example.com' };

            const mockUser = {
                id: 1,
                email: 'test@example.com',
                fullName: 'Test User',
            };

            userSchema.findOne = jest.fn().mockResolvedValue(mockUser);
            jwt.sign = jest.fn().mockReturnValue('reset-token');
            sendResetPasswordEmail.mockResolvedValue(true);

            await forgetPassword(mockRequest, mockResponse);

            expect(sendResetPasswordEmail).toHaveBeenCalledWith(
                'test@example.com',
                'reset-token',
                'Test User'
            );
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: true,
                    message: 'A password reset link has been sent to your email.',
                })
            );
        });
    });

    describe('resetPassword', () => {
        it('should return 400 if token is missing', async () => {
            mockRequest.params = {};
            mockRequest.body = {
                newPassword: 'newpass123',
                confirmPassword: 'newpass123',
            };

            await resetPassword(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Token missing',
                })
            );
        });

        it('should return 400 if passwords are missing', async () => {
            mockRequest.params = { token: 'valid-token' };
            mockRequest.body = {};

            await resetPassword(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Missing required fields',
                })
            );
        });

        it('should return 400 if passwords do not match', async () => {
            mockRequest.params = { token: 'valid-token' };
            mockRequest.body = {
                newPassword: 'newpass123',
                confirmPassword: 'different123',
            };

            await resetPassword(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Passwords do not match',
                })
            );
        });

        it('should return 401 if token is invalid', async () => {
            mockRequest.params = { token: 'invalid-token' };
            mockRequest.body = {
                newPassword: 'newpass123',
                confirmPassword: 'newpass123',
            };

            jwt.verify = jest.fn().mockImplementation(() => {
                throw new Error('Invalid token');
            });

            await resetPassword(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Invalid or expired reset token',
                })
            );
        });

        it('should return 404 if user not found', async () => {
            mockRequest.params = { token: 'valid-token' };
            mockRequest.body = {
                newPassword: 'newpass123',
                confirmPassword: 'newpass123',
            };

            jwt.verify = jest.fn().mockReturnValue({ id: 1 });
            userSchema.findByPk = jest.fn().mockResolvedValue(null);

            await resetPassword(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'User not found',
                })
            );
        });

        it('should reset password successfully', async () => {
            mockRequest.params = { token: 'valid-token' };
            mockRequest.body = {
                newPassword: 'newpass123',
                confirmPassword: 'newpass123',
            };

            const mockUser = {
                id: 1,
                update: jest.fn().mockResolvedValue(true),
            };

            jwt.verify = jest.fn().mockReturnValue({ id: 1 });
            userSchema.findByPk = jest.fn().mockResolvedValue(mockUser);
            argon2.hash = jest.fn().mockResolvedValue('hashed-new-password');

            await resetPassword(mockRequest, mockResponse);

            expect(argon2.hash).toHaveBeenCalledWith('newpass123');
            expect(mockUser.update).toHaveBeenCalledWith({
                password: 'hashed-new-password',
            });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: true,
                    message: 'Password has been reset successfully. You can now log in.',
                })
            );
        });
    });

    describe('googleLogin', () => {
        it('should return 400 if required fields are missing', async () => {
            mockRequest.body = { email: 'test@example.com' };

            await googleLogin(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Missing required fields',
                })
            );
        });

        it('should create new user if not exists', async () => {
            mockRequest.body = {
                fullName: 'Google User',
                email: 'google@example.com',
            };

            userSchema.findOne = jest.fn().mockResolvedValue(null);
            userSchema.create = jest.fn().mockResolvedValue({
                id: 1,
                fullName: 'Google User',
                email: 'google@example.com',
                accountType: 'GOOGLE',
            });
            jwt.sign = jest.fn().mockReturnValue('google-token');

            await googleLogin(mockRequest, mockResponse);

            expect(userSchema.create).toHaveBeenCalledWith({
                fullName: 'Google User',
                email: 'google@example.com',
                accountType: 'GOOGLE',
            });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });

        it('should login existing google user', async () => {
            mockRequest.body = {
                fullName: 'Google User',
                email: 'google@example.com',
            };

            const mockUser = {
                id: 1,
                fullName: 'Google User',
                email: 'google@example.com',
                accountType: 'GOOGLE',
            };

            userSchema.findOne = jest.fn().mockResolvedValue(mockUser);
            jwt.sign = jest.fn().mockReturnValue('google-token');

            await googleLogin(mockRequest, mockResponse);

            expect(userSchema.create).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: true,
                    message: 'Login successful',
                    data: {
                        id: 1,
                        fullName: 'Google User',
                        email: 'google@example.com',
                    },
                })
            );
        });
    });
});
