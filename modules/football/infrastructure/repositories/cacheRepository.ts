import { getRedisClient } from '@/lib/redis'

export interface CacheOptions {
  ttl?: number // Time to live en segundos
  prefix?: string // Prefijo para keys (ej: 'fixtures:', 'logos:')
}

export const cacheRepository = {
  /**
   * Obtener valor del caché
   */
  async get<T>(key: string, options?: CacheOptions): Promise<T | null> {
    try {
      const redis = getRedisClient()
      const fullKey = options?.prefix ? `${options.prefix}${key}` : key

      const data = await redis.get(fullKey)

      if (!data) {
        return null
      }

      return JSON.parse(data) as T
    } catch (error) {
      console.error(`[Cache Error] Error al obtener ${key}:`, error)
      return null // Fail gracefully
    }
  },

  /**
   * Guardar valor en caché
   */
  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    try {
      const redis = getRedisClient()
      const fullKey = options?.prefix ? `${options.prefix}${key}` : key
      const ttl = options?.ttl || 60 // Default 1 minuto

      await redis.setex(fullKey, ttl, JSON.stringify(value))
    } catch (error) {
      console.error(`[Cache Error] Error al guardar ${key}:`, error)
      // No lanzar error, solo logear
    }
  },

  /**
   * Eliminar valor del caché
   */
  async delete(key: string, options?: CacheOptions): Promise<void> {
    try {
      const redis = getRedisClient()
      const fullKey = options?.prefix ? `${options.prefix}${key}` : key

      await redis.del(fullKey)
      console.log(`[Cache Delete] ${fullKey}`)
    } catch (error) {
      console.error(`[Cache Error] Error al eliminar ${key}:`, error)
    }
  },

  /**
   * Verificar si existe una key
   */
  async exists(key: string, options?: CacheOptions): Promise<boolean> {
    try {
      const redis = getRedisClient()
      const fullKey = options?.prefix ? `${options.prefix}${key}` : key

      const result = await redis.exists(fullKey)
      return result === 1
    } catch (error) {
      console.error(`[Cache Error] Error al verificar ${key}:`, error)
      return false
    }
  },

  /**
   * Obtener TTL restante de una key
   */
  async ttl(key: string, options?: CacheOptions): Promise<number> {
    try {
      const redis = getRedisClient()
      const fullKey = options?.prefix ? `${options.prefix}${key}` : key

      return await redis.ttl(fullKey)
    } catch (error) {
      console.error(`[Cache Error] Error al obtener TTL de ${key}:`, error)
      return -1
    }
  },
}
