/**
 * Cache Service
 *
 * A reusable caching utility using Redis for storing and retrieving cached data.
 * Helps reduce API rate limits and improve response times.
 */

import redisConnection from "../config/redis.config.js";

/**
 * Default cache TTL (Time To Live) in seconds
 */
const DEFAULT_TTL = 300; // 5 minutes

/**
 * Twitter-specific cache TTL (Time To Live) in seconds
 * Basic tier allows only 1 request per day
 */
export const TWITTER_TTL = 86400; // 1 day

/**
 * Twitter stale time - after this duration, fetch fresh data on next request
 */
export const TWITTER_STALE_TIME = 900; // 15 minutes

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
 * Stale-while-revalidate caching pattern
 * Returns cached data immediately if available, but fetches fresh data
 * in the background if the cache is older than staleTime.
 *
 * @param {string} key - Cache key
 * @param {Function} fetchFn - Async function to fetch fresh data
 * @param {number} ttl - Total time to live in seconds (default: 1 day)
 * @param {number} staleTime - Time after which data is considered stale (default: 15 minutes)
 * @returns {Promise<object>} - Cached or freshly fetched data
 */
export async function withStaleWhileRevalidate(
    key,
    fetchFn,
    ttl = TWITTER_TTL,
    staleTime = TWITTER_STALE_TIME
) {
    const timestampKey = `${key}:timestamp`;

    try {
        // Get cached data and its timestamp
        const [cached, timestampStr] = await Promise.all([
            redisConnection.get(key),
            redisConnection.get(timestampKey),
        ]);

        if (cached) {
            const parsedData = JSON.parse(cached);

            // Validate cached data - if status is true but data is missing, treat as invalid
            if (parsedData.status === true && parsedData.data === undefined) {
                console.log(
                    `⚠️ Cache INVALID for key: ${key} (missing data field), fetching fresh data...`
                );
                // Delete the invalid cache entry
                await Promise.all([
                    redisConnection.del(key),
                    redisConnection.del(timestampKey),
                ]);
                // Fall through to fetch fresh data below
            } else {
                const cachedTime = timestampStr
                    ? parseInt(timestampStr, 10)
                    : 0;
                const now = Date.now();
                const ageInSeconds = (now - cachedTime) / 1000;

                console.log(
                    `📦 Cache HIT for key: ${key} (age: ${Math.round(
                        ageInSeconds
                    )}s)`
                );

                // Check if cache is stale (older than staleTime)
                if (ageInSeconds > staleTime) {
                    console.log(
                        `🔄 Cache is stale (>${staleTime}s), fetching fresh data in background...`
                    );

                    // Fetch fresh data in background (don't await)
                    fetchFn()
                        .then(async (freshData) => {
                            if (
                                freshData &&
                                freshData.status !== false &&
                                freshData.data !== undefined
                            ) {
                                await Promise.all([
                                    redisConnection.setex(
                                        key,
                                        ttl,
                                        JSON.stringify(freshData)
                                    ),
                                    redisConnection.setex(
                                        timestampKey,
                                        ttl,
                                        Date.now().toString()
                                    ),
                                ]);
                                console.log(
                                    `✅ Background refresh completed for key: ${key}`
                                );
                            }
                        })
                        .catch((err) => {
                            console.error(
                                `❌ Background refresh failed for key ${key}:`,
                                err.message
                            );
                        });
                }

                // Return cached data immediately
                return parsedData;
            }
        }

        console.log(`📭 Cache MISS for key: ${key}, fetching fresh data...`);

        // No cache, fetch fresh data
        const data = await fetchFn();

        // Cache successful responses with timestamp (only if data field exists)
        if (data && data.status !== false && data.data !== undefined) {
            await Promise.all([
                redisConnection.setex(key, ttl, JSON.stringify(data)),
                redisConnection.setex(timestampKey, ttl, Date.now().toString()),
            ]);
            console.log(`💾 Cache SET for key: ${key} (TTL: ${ttl}s)`);
        }

        return data;
    } catch (error) {
        console.error(`❌ Cache error for key ${key}:`, error.message);
        // On error, try to fetch fresh data
        return await fetchFn();
    }
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
    withStaleWhileRevalidate,
    invalidateTwitterCache,
    CACHE_KEYS,
};
