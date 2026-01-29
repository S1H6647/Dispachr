import {
    getAllPosts,
    getTwitterPosts,
    getFacebookPosts,
    getPostById,
    createPost,
    deletePostById,
    deleteTweetById,
    editPostById,
    editFacebookPostById,
    editTweetsById,
    dispatchPost,
    deleteFacebookPosts,
    getPostChart,
} from '../controller/post.controller.js';
import postSchema from '../schema/post.schema.js';
import {
    createTweetService,
    deleteTweetService,
    getMyDataService,
    getUserTweetsService,
    updateTweetPost,
} from '../services/twitter.service.js';
import {
    createFacebookPost,
    deleteFacebookPost,
    getFacebookPost,
    updateFacebookPost,
} from '../services/facebook.service.js';
import { caplitalizeFirstWord } from '../utils/user.caplitalize.js';
import { jest } from '@jest/globals';

// Mock dependencies
jest.mock('../schema/post.schema.js');
jest.mock('../services/twitter.service.js');
jest.mock('../services/facebook.service.js');
jest.mock('../utils/user.caplitalize.js');

describe('Post Controller', () => {
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
        };
        jest.clearAllMocks();
        
        // Mock capitalize function to return input as-is
        caplitalizeFirstWord.mockImplementation((str) => str);
    });

    describe('getAllPosts', () => {
        it('should return all posts with 200 status', async () => {
            const mockPosts = [
                { id: 1, title: 'Post 1', description: 'Description 1' },
                { id: 2, title: 'Post 2', description: 'Description 2' },
            ];

            postSchema.findAll = jest.fn().mockResolvedValue(mockPosts);

            await getAllPosts({}, mockResponse);

            expect(postSchema.findAll).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                data: mockPosts,
                message: 'Successfully fetched all the posts.',
            });
        });

        it('should return 500 if fetching fails', async () => {
            postSchema.findAll = jest.fn().mockRejectedValue(new Error('DB Error'));

            await getAllPosts({}, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Failed to fetch all posts.',
            });
        });
    });

    describe('getPostById', () => {
        it('should return post by id with 200 status', async () => {
            mockRequest.params = { id: '1' };
            const mockPost = { id: 1, title: 'Post 1', description: 'Description 1' };

            postSchema.findByPk = jest.fn().mockResolvedValue(mockPost);

            await getPostById(mockRequest, mockResponse);

            expect(postSchema.findByPk).toHaveBeenCalledWith('1');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                data: mockPost,
                message: 'Post successfully fetched.',
            });
        });

        it('should return 404 if post not found', async () => {
            mockRequest.params = { id: '999' };

            postSchema.findByPk = jest.fn().mockResolvedValue(null);

            await getPostById(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Post not found.',
            });
        });

        it('should return 500 if fetching fails', async () => {
            mockRequest.params = { id: '1' };

            postSchema.findByPk = jest.fn().mockRejectedValue(new Error('DB Error'));

            await getPostById(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Failed to fetch post.',
            });
        });
    });

    describe('createPost', () => {
        it('should create post and return 201 status', async () => {
            mockRequest.body = {
                title: 'New Post',
                description: 'New Description',
            };

            const mockCreatedPost = {
                id: 1,
                title: 'New Post',
                description: 'New Description',
            };

            postSchema.create = jest.fn().mockResolvedValue(mockCreatedPost);

            await createPost(mockRequest, mockResponse);

            expect(postSchema.create).toHaveBeenCalledWith({
                title: 'New Post',
                description: 'New Description',
            });
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                data: mockCreatedPost,
                message: 'Post successfully created.',
            });
        });

        it('should return 400 if title is missing', async () => {
            mockRequest.body = {
                description: 'New Description',
            };

            await createPost(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Invalid payload',
            });
        });

        it('should return 400 if description is missing', async () => {
            mockRequest.body = {
                title: 'New Post',
            };

            await createPost(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Invalid payload',
            });
        });

        it('should return 500 if creation fails', async () => {
            mockRequest.body = {
                title: 'New Post',
                description: 'New Description',
            };

            postSchema.create = jest.fn().mockRejectedValue(new Error('DB Error'));

            await createPost(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Failed to create post.',
            });
        });
    });

    describe('deletePostById', () => {
        it('should delete post and return 200 status', async () => {
            mockRequest.params = { id: '1' };

            const mockPost = {
                id: 1,
                destroy: jest.fn().mockResolvedValue(true),
            };

            postSchema.findByPk = jest.fn().mockResolvedValue(mockPost);

            await deletePostById(mockRequest, mockResponse);

            expect(postSchema.findByPk).toHaveBeenCalledWith('1');
            expect(mockPost.destroy).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: true,
                message: 'Post successfully deleted',
            });
        });

        it('should return 404 if post not found', async () => {
            mockRequest.params = { id: '999' };

            postSchema.findByPk = jest.fn().mockResolvedValue(null);

            await deletePostById(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Post not found.',
            });
        });

        it('should return 500 if deletion fails', async () => {
            mockRequest.params = { id: '1' };

            const mockPost = {
                id: 1,
                destroy: jest.fn().mockRejectedValue(new Error('DB Error')),
            };

            postSchema.findByPk = jest.fn().mockResolvedValue(mockPost);

            await deletePostById(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: false,
                message: 'Failed to delete post.',
            });
        });
    });

    describe('editPostById', () => {
        it('should update post and return 200 status', async () => {
            mockRequest.params = { id: '1' };
            mockRequest.body = {
                title: 'Updated Title',
                description: 'Updated Description',
            };

            const mockPost = {
                id: 1,
                title: 'Old Title',
                description: 'Old Description',
                update: jest.fn().mockResolvedValue(true),
            };

            postSchema.findByPk = jest.fn().mockResolvedValue(mockPost);

            await editPostById(mockRequest, mockResponse);

            expect(mockPost.update).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: true,
                message: 'Post successfully updated',
            });
        });

        it('should return 404 if post not found', async () => {
            mockRequest.params = { id: '999' };
            mockRequest.body = {
                title: 'Updated Title',
                description: 'Updated Description',
            };

            postSchema.findByPk = jest.fn().mockResolvedValue(null);

            await editPostById(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Post not found.',
            });
        });

        it('should return 400 if payload is invalid', async () => {
            mockRequest.params = { id: '1' };
            mockRequest.body = {
                title: 'Updated Title',
            };

            const mockPost = {
                id: 1,
                title: 'Old Title',
                description: 'Old Description',
            };

            postSchema.findByPk = jest.fn().mockResolvedValue(mockPost);

            await editPostById(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Invalid payload',
            });
        });

        it('should return 500 if update fails', async () => {
            mockRequest.params = { id: '1' };
            mockRequest.body = {
                title: 'Updated Title',
                description: 'Updated Description',
            };

            const mockPost = {
                id: 1,
                update: jest.fn().mockRejectedValue(new Error('DB Error')),
            };

            postSchema.findByPk = jest.fn().mockResolvedValue(mockPost);

            await editPostById(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Failed to update post.',
            });
        });
    });

    describe('dispatchPost', () => {
        it('should dispatch post to website only', async () => {
            mockRequest.body = {
                title: 'Test Post',
                description: 'Test Description',
                platforms: ['website'],
            };

            const mockCreatedPost = {
                id: 1,
                title: 'Test Post',
                description: 'Test Description',
            };

            postSchema.create = jest.fn().mockResolvedValue(mockCreatedPost);

            await dispatchPost(mockRequest, mockResponse);

            expect(postSchema.create).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(201);
        });

        it('should return 500 if dispatch fails', async () => {
            mockRequest.body = {
                title: 'Test Post',
                description: 'Test Description',
                platforms: ['website'],
            };

            postSchema.create = jest.fn().mockRejectedValue(new Error('DB Error'));

            await dispatchPost(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
        });
    });

    // TODO: Add tests for Twitter and Facebook when tokens are available
    describe('getTwitterPosts', () => {
        it.skip('should fetch Twitter posts', async () => {
            // TODO: Implement when Twitter tokens are available
        });
    });

    describe('getFacebookPosts', () => {
        it.skip('should fetch Facebook posts', async () => {
            // TODO: Implement when Facebook tokens are available
        });
    });

    describe('deleteTweetById', () => {
        it.skip('should delete Twitter post', async () => {
            // TODO: Implement when Twitter tokens are available
        });
    });

    describe('deleteFacebookPosts', () => {
        it.skip('should delete Facebook post', async () => {
            // TODO: Implement when Facebook tokens are available
        });
    });

    describe('editFacebookPostById', () => {
        it.skip('should update Facebook post', async () => {
            // TODO: Implement when Facebook tokens are available
        });
    });

    describe('editTweetsById', () => {
        it.skip('should update Twitter post', async () => {
            // TODO: Implement when Twitter tokens are available
        });
    });

    describe('getPostChart', () => {
        it('should return chart data for website posts', async () => {
            const mockWebsitePosts = [
                {
                    id: 1,
                    title: 'Post 1',
                    createdAt: new Date('2026-01-20'),
                },
                {
                    id: 2,
                    title: 'Post 2',
                    createdAt: new Date('2026-01-20'),
                },
            ];

            postSchema.findAll = jest.fn().mockResolvedValue(mockWebsitePosts);
            getFacebookPost.mockResolvedValue({ data: [] });

            await getPostChart(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: true,
                    message: 'Chart data successfully fetched',
                    data: expect.any(Array),
                })
            );
        });

        it('should return 500 if chart data fetch fails', async () => {
            postSchema.findAll = jest.fn().mockRejectedValue(new Error('DB Error'));

            await getPostChart(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: false,
                    error: 'DB Error',
                })
            );
        });
    });
});
