import { jest } from '@jest/globals';

// Mock dependencies before importing
jest.unstable_mockModule('../schema/user.schema.js', () => ({
    default: {
        findAll: jest.fn(),
        findOne: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        scope: jest.fn(),
    }
}));

jest.unstable_mockModule('argon2', () => ({
    default: {
        hash: jest.fn(),
        verify: jest.fn(),
    }
}));

jest.unstable_mockModule('../utils/user.caplitalize.js', () => ({
    caplitalizeEachWord: jest.fn((str) => str),
}));

const { default: userSchema } = await import('../schema/user.schema.js');
const { default: argon2 } = await import('argon2');
const { caplitalizeEachWord } = await import('../utils/user.caplitalize.js');
const {
    getAllUser,
    getUserById,
    createUser,
    deleteUserById,
    editUserById,
    getCurrentUser,
    CheckPassword,
} = await import('../controller/user.controller.js');

describe('User Controller', () => {
    let mockRequest;
    let mockResponse;

    beforeEach(() => {
        mockRequest = {
            body: {},
            params: {},
            user: {},
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();

        // Mock capitalize function to return input as-is
        caplitalizeEachWord.mockImplementation((str) => str);
    });

    describe('getAllUser', () => {
        it('should return all users with 200 status', async () => {
            const mockUsers = [
                { id: 1, fullName: 'User 1', email: 'user1@example.com' },
                { id: 2, fullName: 'User 2', email: 'user2@example.com' },
            ];

            userSchema.findAll = jest.fn().mockResolvedValue(mockUsers);

            await getAllUser({}, mockResponse);

            expect(userSchema.findAll).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                data: mockUsers,
                message: 'Successfully fetched all users.',
            });
        });

        it('should return 500 if fetching fails', async () => {
            userSchema.findAll = jest.fn().mockRejectedValue(new Error('DB Error'));

            await getAllUser({}, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Failed to fetch all users',
            });
        });
    });

    describe('getUserById', () => {
        it('should return user by id with 200 status', async () => {
            mockRequest.params = { id: '1' };
            const mockUser = { id: 1, fullName: 'Test User', email: 'test@example.com' };

            userSchema.findByPk = jest.fn().mockResolvedValue(mockUser);

            await getUserById(mockRequest, mockResponse);

            expect(userSchema.findByPk).toHaveBeenCalledWith('1');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                data: mockUser,
                message: 'User successfully fetched.',
            });
        });

        it('should return 404 if user not found', async () => {
            mockRequest.params = { id: '999' };

            userSchema.findByPk = jest.fn().mockResolvedValue(null);

            await getUserById(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'User not found.',
            });
        });

        it('should return 500 if fetching fails', async () => {
            mockRequest.params = { id: '1' };

            userSchema.findByPk = jest.fn().mockRejectedValue(new Error('DB Error'));

            await getUserById(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Failed to fetch user',
            });
        });
    });

    describe('createUser', () => {
        it('should create user and return 201 status', async () => {
            mockRequest.body = {
                fullName: 'New User',
                email: 'newuser@example.com',
                password: 'Password123!',
                confirmPassword: 'Password123!',
            };

            const mockCreatedUser = {
                id: 1,
                fullName: 'New User',
                email: 'newuser@example.com',
            };

            userSchema.findOne = jest.fn().mockResolvedValue(null);
            userSchema.create = jest.fn().mockResolvedValue(mockCreatedUser);
            argon2.hash = jest.fn().mockResolvedValue('hashedPassword');

            await createUser(mockRequest, mockResponse);

            expect(argon2.hash).toHaveBeenCalledWith('Password123!');
            expect(userSchema.create).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: true,
                    message: 'User successfully created.',
                })
            );
        });

        it('should return 400 if required fields are missing', async () => {
            mockRequest.body = {
                fullName: 'New User',
                email: 'newuser@example.com',
            };

            await createUser(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Invalid payload',
            });
        });

        it('should return 400 if passwords do not match', async () => {
            mockRequest.body = {
                fullName: 'New User',
                email: 'newuser@example.com',
                password: 'Password123!',
                confirmPassword: 'Different123!',
            };

            await createUser(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Password did not match.',
            });
        });

        it('should return 400 if email is invalid', async () => {
            mockRequest.body = {
                fullName: 'New User',
                email: 'invalid-email',
                password: 'Password123!',
                confirmPassword: 'Password123!',
            };

            await createUser(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Invalid email.',
            });
        });

        it('should return 400 if password is weak', async () => {
            mockRequest.body = {
                fullName: 'New User',
                email: 'newuser@example.com',
                password: 'weak',
                confirmPassword: 'weak',
            };

            await createUser(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.',
            });
        });

        it('should return 409 if email already exists', async () => {
            mockRequest.body = {
                fullName: 'New User',
                email: 'existing@example.com',
                password: 'Password123!',
                confirmPassword: 'Password123!',
            };

            const existingUser = { id: 1, email: 'existing@example.com' };
            userSchema.findOne = jest.fn().mockResolvedValue(existingUser);

            await createUser(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(409);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Email already registered.',
            });
        });

        it('should return 500 if creation fails', async () => {
            mockRequest.body = {
                fullName: 'New User',
                email: 'newuser@example.com',
                password: 'Password123!',
                confirmPassword: 'Password123!',
            };

            userSchema.findOne = jest.fn().mockResolvedValue(null);
            argon2.hash = jest.fn().mockResolvedValue('hashedPassword');
            userSchema.create = jest.fn().mockRejectedValue(new Error('DB Error'));

            await createUser(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Failed to create user.',
            });
        });
    });

    describe('deleteUserById', () => {
        it('should delete user and return 200 status', async () => {
            mockRequest.params = { id: '1' };

            const mockUser = {
                id: 1,
                destroy: jest.fn().mockResolvedValue(true),
            };

            userSchema.findByPk = jest.fn().mockResolvedValue(mockUser);

            await deleteUserById(mockRequest, mockResponse);

            expect(userSchema.findByPk).toHaveBeenCalledWith('1');
            expect(mockUser.destroy).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: 'User successfully deleted.',
            });
        });

        it('should return 404 if user not found', async () => {
            mockRequest.params = { id: '999' };

            userSchema.findByPk = jest.fn().mockResolvedValue(null);

            await deleteUserById(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'User not found.',
            });
        });

        it('should return 500 if deletion fails', async () => {
            mockRequest.params = { id: '1' };

            const mockUser = {
                id: 1,
                destroy: jest.fn().mockRejectedValue(new Error('DB Error')),
            };

            userSchema.findByPk = jest.fn().mockResolvedValue(mockUser);

            await deleteUserById(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Failed to delete user',
            });
        });
    });

    describe('editUserById', () => {
        it('should update user and return 200 status', async () => {
            mockRequest.params = { id: '1' };
            mockRequest.body = {
                fullName: 'Updated Name',
            };

            const mockUser = {
                id: 1,
                fullName: 'Old Name',
                email: 'test@example.com',
                update: jest.fn().mockResolvedValue(true),
            };

            userSchema.findByPk = jest.fn().mockResolvedValue(mockUser);

            await editUserById(mockRequest, mockResponse);

            expect(mockUser.update).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    id: 1,
                    fullName: 'Old Name',
                    email: 'test@example.com',
                },
                message: 'User successfully updated.',
            });
        });

        it('should return 404 if user not found', async () => {
            mockRequest.params = { id: '999' };
            mockRequest.body = {
                fullName: 'Updated Name',
            };

            userSchema.findByPk = jest.fn().mockResolvedValue(null);

            await editUserById(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'User not found.',
            });
        });

        it('should return 500 if update fails', async () => {
            mockRequest.params = { id: '1' };
            mockRequest.body = {
                fullName: 'Updated Name',
            };

            const mockUser = {
                id: 1,
                update: jest.fn().mockRejectedValue(new Error('DB Error')),
            };

            userSchema.findByPk = jest.fn().mockResolvedValue(mockUser);

            await editUserById(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Failed to edit user',
            });
        });
    });

    describe('getCurrentUser', () => {
        it('should return current user with 200 status', async () => {
            mockRequest.user = {
                id: 1,
                fullName: 'Current User',
                email: 'current@example.com',
            };

            await getCurrentUser(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                user: {
                    id: 1,
                    fullName: 'Current User',
                    email: 'current@example.com',
                },
                status: true,
            });
        });

        it('should return 500 if getting current user fails', async () => {
            mockRequest.user = undefined;

            await getCurrentUser(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: false,
                message: 'Failed to get the current user',
            });
        });
    });

    describe('CheckPassword', () => {
        it('should change password successfully', async () => {
            mockRequest.user = { id: 1 };
            mockRequest.body = {
                currentPassword: 'OldPassword123!',
                newPassword: 'NewPassword123!',
                confirmPassword: 'NewPassword123!',
            };

            const mockUser = {
                id: 1,
                password: 'hashedOldPassword',
            };

            userSchema.scope = jest.fn().mockReturnValue({
                findByPk: jest.fn().mockResolvedValue(mockUser),
            });
            argon2.verify = jest.fn().mockResolvedValue(true);
            argon2.hash = jest.fn().mockResolvedValue('hashedNewPassword');
            userSchema.update = jest.fn().mockResolvedValue([1]);

            await CheckPassword(mockRequest, mockResponse);

            expect(argon2.verify).toHaveBeenCalledWith('hashedOldPassword', 'OldPassword123!');
            expect(argon2.hash).toHaveBeenCalledWith('NewPassword123!');
            expect(userSchema.update).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: true,
                message: 'Password successfully changed',
            });
        });

        it('should return 400 if no password provided', async () => {
            mockRequest.user = { id: 1 };
            mockRequest.body = {
                newPassword: 'NewPassword123!',
                confirmPassword: 'NewPassword123!',
            };

            await CheckPassword(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: false,
                message: 'No password provided',
            });
        });

        it('should return 404 if user not found', async () => {
            mockRequest.user = { id: 1 };
            mockRequest.body = {
                currentPassword: 'OldPassword123!',
                newPassword: 'NewPassword123!',
                confirmPassword: 'NewPassword123!',
            };

            userSchema.scope = jest.fn().mockReturnValue({
                findByPk: jest.fn().mockResolvedValue(null),
            });

            await CheckPassword(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: false,
                message: 'User not found',
            });
        });

        it('should return 400 if passwords do not match', async () => {
            mockRequest.user = { id: 1 };
            mockRequest.body = {
                currentPassword: 'OldPassword123!',
                newPassword: 'NewPassword123!',
                confirmPassword: 'DifferentPassword123!',
            };

            const mockUser = {
                id: 1,
                password: 'hashedOldPassword',
            };

            userSchema.scope = jest.fn().mockReturnValue({
                findByPk: jest.fn().mockResolvedValue(mockUser),
            });

            await CheckPassword(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: false,
                message: "Password doesn't match",
            });
        });

        it('should return 401 if current password is invalid', async () => {
            mockRequest.user = { id: 1 };
            mockRequest.body = {
                currentPassword: 'WrongPassword123!',
                newPassword: 'NewPassword123!',
                confirmPassword: 'NewPassword123!',
            };

            const mockUser = {
                id: 1,
                password: 'hashedOldPassword',
            };

            userSchema.scope = jest.fn().mockReturnValue({
                findByPk: jest.fn().mockResolvedValue(mockUser),
            });
            argon2.verify = jest.fn().mockResolvedValue(false);

            await CheckPassword(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: false,
                message: 'Invalid password',
            });
        });

        it('should return 500 if password change fails', async () => {
            mockRequest.user = { id: 1 };
            mockRequest.body = {
                currentPassword: 'OldPassword123!',
                newPassword: 'NewPassword123!',
                confirmPassword: 'NewPassword123!',
            };

            userSchema.scope = jest.fn().mockReturnValue({
                findByPk: jest.fn().mockRejectedValue(new Error('DB Error')),
            });

            await CheckPassword(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: false,
                message: 'Failed to check current password',
            });
        });
    });
});
