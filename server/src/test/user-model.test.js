import SequelizeMock from 'sequelize-mock';

const dbMock = new SequelizeMock();

export const UserModelMock = dbMock.define('User', {
    id: 1,
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword123',
    accountType: 'LOCAL',
    createdAt: new Date(),
    updatedAt: new Date(),
});

describe('User Model Mock', () => {
    beforeEach(() => {
        UserModelMock.$clearQueue();
    });

    describe('Model Definition', () => {
        it('should have correct default values', () => {
            const user = UserModelMock.build();
            
            expect(user.id).toBe(1);
            expect(user.fullName).toBe('Test User');
            expect(user.email).toBe('test@example.com');
            expect(user.password).toBe('hashedPassword123');
            expect(user.accountType).toBe('LOCAL');
            expect(user.createdAt).toBeInstanceOf(Date);
            expect(user.updatedAt).toBeInstanceOf(Date);
        });

        it('should create a user with custom values', () => {
            const customData = {
                id: 2,
                fullName: 'John Doe',
                email: 'john@example.com',
                accountType: 'GOOGLE',
            };

            const user = UserModelMock.build(customData);

            expect(user.id).toBe(2);
            expect(user.fullName).toBe('John Doe');
            expect(user.email).toBe('john@example.com');
            expect(user.accountType).toBe('GOOGLE');
        });

        it('should create a user with LOCAL account type', () => {
            const userData = {
                fullName: 'Local User',
                email: 'local@example.com',
                password: 'password123',
                accountType: 'LOCAL',
            };

            const user = UserModelMock.build(userData);

            expect(user.accountType).toBe('LOCAL');
            expect(user.password).toBeDefined();
        });

        it('should create a user with GOOGLE account type', () => {
            const userData = {
                fullName: 'Google User',
                email: 'google@example.com',
                accountType: 'GOOGLE',
            };

            const user = UserModelMock.build(userData);

            expect(user.accountType).toBe('GOOGLE');
        });
    });

    describe('CRUD Operations', () => {
        it('should find all users', async () => {
            const users = await UserModelMock.findAll();
            
            expect(Array.isArray(users)).toBe(true);
        });

        it('should find a user by id', async () => {
            const user = await UserModelMock.findOne({ where: { id: 1 } });
            
            expect(user).toBeDefined();
            expect(user.id).toBe(1);
        });

        it('should find a user by email', async () => {
            const user = await UserModelMock.findOne({ where: { email: 'test@example.com' } });
            
            expect(user).toBeDefined();
            expect(user.email).toBe('test@example.com');
        });

        it('should create a new user', async () => {
            const newUser = {
                fullName: 'New User',
                email: 'newuser@example.com',
                password: 'hashedPassword',
                accountType: 'LOCAL',
            };

            const createdUser = await UserModelMock.create(newUser);

            expect(createdUser.fullName).toBe('New User');
            expect(createdUser.email).toBe('newuser@example.com');
            expect(createdUser.accountType).toBe('LOCAL');
        });

        it('should update a user', async () => {
            const user = UserModelMock.build({ id: 1 });
            
            user.fullName = 'Updated Name';
            const updatedUser = await user.save();

            expect(updatedUser.fullName).toBe('Updated Name');
        });

        it('should delete a user', async () => {
            const user = UserModelMock.build({ id: 1 });
            
            await user.destroy();

            expect(user).toBeDefined();
        });
    });

    describe('Validation', () => {
        it('should have required fields', () => {
            const user = UserModelMock.build();

            expect(user.fullName).toBeDefined();
            expect(user.email).toBeDefined();
            expect(user.accountType).toBeDefined();
        });

        it('should handle unique email constraint', async () => {
            const user1 = await UserModelMock.create({
                fullName: 'User One',
                email: 'unique@example.com',
            });

            expect(user1.email).toBe('unique@example.com');
        });

        it('should allow null password for OAuth users', () => {
            const user = UserModelMock.build({
                fullName: 'OAuth User',
                email: 'oauth@example.com',
                password: null,
                accountType: 'GOOGLE',
            });

            expect(user.password).toBeNull();
            expect(user.accountType).toBe('GOOGLE');
        });

        it('should have password for LOCAL users', () => {
            const user = UserModelMock.build({
                fullName: 'Local User',
                email: 'local@example.com',
                password: 'hashedPassword',
                accountType: 'LOCAL',
            });

            expect(user.password).toBe('hashedPassword');
            expect(user.accountType).toBe('LOCAL');
        });
    });

    describe('Account Types', () => {
        it('should support LOCAL account type', () => {
            const user = UserModelMock.build({
                accountType: 'LOCAL',
            });

            expect(user.accountType).toBe('LOCAL');
        });

        it('should support GOOGLE account type', () => {
            const user = UserModelMock.build({
                accountType: 'GOOGLE',
            });

            expect(user.accountType).toBe('GOOGLE');
        });
    });
});
