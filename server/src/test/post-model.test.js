import SequelizeMock from 'sequelize-mock';

const dbMock = new SequelizeMock();

export const PostModelMock = dbMock.define('Post', {
    id: 1,
    title: 'Test Post Title',
    description: 'Test post description',
    platforms: ['website'], // TODO: Add 'facebook', 'twitter' when tokens are available
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
});

describe('Post Model Mock', () => {
    beforeEach(() => {
        PostModelMock.$clearQueue();
    });

    describe('Model Definition', () => {
        it('should have correct default values', () => {
            const post = PostModelMock.build();
            
            expect(post.id).toBe(1);
            expect(post.title).toBe('Test Post Title');
            expect(post.description).toBe('Test post description');
            expect(post.platforms).toEqual(['website']); // TODO: Add 'facebook', 'twitter' when tokens are available
            expect(post.publishedAt).toBeInstanceOf(Date);
            expect(post.createdAt).toBeInstanceOf(Date);
            expect(post.updatedAt).toBeInstanceOf(Date);
        });

        it('should create a post with custom values', () => {
            const customData = {
                id: 2,
                title: 'Custom Post',
                description: 'Custom description',
                platforms: ['website'],
            };

            const post = PostModelMock.build(customData);

            expect(post.id).toBe(2);
            expect(post.title).toBe('Custom Post');
            expect(post.description).toBe('Custom description');
            expect(post.platforms).toEqual(['website']);
        });
    });

    describe('CRUD Operations', () => {
        it('should find all posts', async () => {
            const posts = await PostModelMock.findAll();
            
            expect(Array.isArray(posts)).toBe(true);
        });

        it('should find a post by id', async () => {
            const post = await PostModelMock.findOne({ where: { id: 1 } });
            
            expect(post).toBeDefined();
            expect(post.id).toBe(1);
        });

        it('should create a new post', async () => {
            const newPost = {
                title: 'New Post',
                description: 'New post description',
                platforms: ['website'],
            };

            const createdPost = await PostModelMock.create(newPost);

            expect(createdPost.title).toBe('New Post');
            expect(createdPost.description).toBe('New post description');
            expect(createdPost.platforms).toEqual(['website']);
        });

        it('should update a post', async () => {
            const post = PostModelMock.build({ id: 1 });
            
            post.title = 'Updated Title';
            const updatedPost = await post.save();

            expect(updatedPost.title).toBe('Updated Title');
        });

        it('should delete a post', async () => {
            const post = PostModelMock.build({ id: 1 });
            
            await post.destroy();

            expect(post).toBeDefined();
        });
    });

    describe('Validation', () => {
        it('should have required fields', () => {
            const post = PostModelMock.build();

            expect(post.title).toBeDefined();
            expect(post.description).toBeDefined();
        });

        it('should handle platforms as JSON array', () => {
            const post = PostModelMock.build({
                platforms: ['website'], // TODO: Add 'twitter', 'facebook' when tokens are available
            });

            expect(Array.isArray(post.platforms)).toBe(true);
            expect(post.platforms).toHaveLength(1);
        });

        it('should handle empty platforms array', () => {
            const post = PostModelMock.build({
                platforms: [],
            });

            expect(post.platforms).toEqual([]);
        });
    });
});
