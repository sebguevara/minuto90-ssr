import { getRedisClient } from '@/lib/redis'

export interface CacheOptions {
  ttl?: number
}

const serialize = (value: unknown): string => JSON.stringify(value)
const deserialize = <T>(value: string): T => JSON.parse(value) as T

export const cacheRepository = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const redis = getRedisClient()
      const data = await redis.get(key)
      if (!data) return null
      return deserialize<T>(data)
    } catch (error) {
      console.error(`[Cache Error] GET ${key}:`, error)
      return null
    }
  },

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    try {
      const redis = getRedisClient()
      const ttl = options?.ttl || 60
      await redis.setex(key, ttl, serialize(value))
    } catch (error) {
      console.error(`[Cache Error] SET ${key}:`, error)
    }
  },

  async getMany<T>(keys: string[]): Promise<(T | null)[]> {
    if (keys.length === 0) return []
    try {
      const redis = getRedisClient()
      const data = await redis.mget(keys)
      return data.map((item) => (item ? deserialize<T>(item) : null))
    } catch (error) {
      console.error(`[Cache Error] MGET:`, error)
      return keys.map(() => null)
    }
  },

  async setMany(data: Record<string, any>, ttl: number): Promise<void> {
    if (Object.keys(data).length === 0) return
    try {
      const redis = getRedisClient()
      const pipeline = redis.pipeline()
      for (const key in data) {
        pipeline.setex(key, ttl, serialize(data[key]))
      }
      await pipeline.exec()
    } catch (error) {
      console.error(`[Cache Error] MSET:`, error)
    }
  },

  async delete(key: string): Promise<void> {
    try {
      const redis = getRedisClient()
      await redis.del(key)
    } catch (error) {
      console.error(`[Cache Error] DELETE ${key}:`, error)
    }
  },
}
