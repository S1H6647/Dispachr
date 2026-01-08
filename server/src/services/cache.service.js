/**
 * Cache Service
 *
 * A reusable caching utility using Redis for storing and retrieving cached data.
 * Helps reduce API rate limits and improve response times.
 */

import redisConnection from "../config/redis.config.js";

/**
 * Default cache TTL (Time To Live) in seconds
 * Set to 5 minutes for Twitter API data
 */
const DEFAULT_TTL = 300; // 5 minutes

/**
 * Cache key prefixes for different data types
 */
export const CACHE_KEYS = {
    TWITTER_USER: "twitter:user",
    TWITTER_TWEETS: "twitter:tweets",
    TWITTER_MY_DATA: "twitter:mydata",
};

/**
 * Get data from cache
 * @param {string} key - Cache key
 * @returns {Promise<object|null>} - Cached data or null if not found
 */
export async function getFromCache(key) {
    try {
        const cached = await redisConnection.get(key);
        if (cached) {
            const parsedData = JSON.parse(cached);
            console.log(`📦 Cache HIT for key: ${key}`);
            console.log(
                `📦 Cached response:`,
                JSON.stringify(parsedData, null, 2)
            );
            return parsedData;
        }
        console.log(`📭 Cache MISS for key: ${key}`);
        return null;
    } catch (error) {
        console.error(`❌ Cache get error for key ${key}:`, error.message);
        return null;
    }
}

/**
 * Set data in cache with optional TTL
 * @param {string} key - Cache key
 * @param {object} data - Data to cache
 * @param {number} ttl - Time to live in seconds (default: 5 minutes)
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
export async function setInCache(key, data, ttl = DEFAULT_TTL) {
    try {
        await redisConnection.setex(key, ttl, JSON.stringify(data));
        console.log(`💾 Cache SET for key: ${key} (TTL: ${ttl}s)`);
        return true;
    } catch (error) {
        console.error(`❌ Cache set error for key ${key}:`, error.message);
        return false;
    }
}

/**
 * Delete data from cache
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
export async function deleteFromCache(key) {
    try {
        await redisConnection.del(key);
        console.log(`🗑️ Cache DELETED for key: ${key}`);
        return true;
    } catch (error) {
        console.error(`❌ Cache delete error for key ${key}:`, error.message);
        return false;
    }
}

/**
 * Delete multiple cache keys by pattern
 * @param {string} pattern - Key pattern to match (e.g., "twitter:*")
 * @returns {Promise<number>} - Number of keys deleted
 */
export async function deleteByPattern(pattern) {
    try {
        const keys = await redisConnection.keys(pattern);
        if (keys.length > 0) {
            await redisConnection.del(...keys);
            console.log(
                `🗑️ Cache DELETED ${keys.length} keys matching: ${pattern}`
            );
            return keys.length;
        }
        return 0;
    } catch (error) {
        console.error(`❌ Cache delete by pattern error:`, error.message);
        return 0;
    }
}

/**
 * Wrapper function for caching async operations
 * @param {string} key - Cache key
 * @param {Function} fetchFn - Async function to fetch data if not cached
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<object>} - Cached or freshly fetched data
 */
export async function withCache(key, fetchFn, ttl = DEFAULT_TTL) {
    // Try to get from cache first
    const cached = await getFromCache(key);
    if (cached) {
        return cached;
    }

    // Fetch fresh data
    const data = await fetchFn();

    // Only cache successful responses
    if (data && data.status !== false) {
        await setInCache(key, data, ttl);
    }

    return data;
}

/**
 * Invalidate Twitter cache (useful after creating/deleting tweets)
 * @param {string} userId - Optional user ID to invalidate specific user's cache
 */
export async function invalidateTwitterCache(userId = null) {
    if (userId) {
        await deleteFromCache(`${CACHE_KEYS.TWITTER_USER}:${userId}`);
        await deleteFromCache(`${CACHE_KEYS.TWITTER_TWEETS}:${userId}`);
    }
    await deleteFromCache(CACHE_KEYS.TWITTER_MY_DATA);
    console.log("🔄 Twitter cache invalidated");
}

export default {
    getFromCache,
    setInCache,
    deleteFromCache,
    deleteByPattern,
    withCache,
    invalidateTwitterCache,
    CACHE_KEYS,
};
