import Redis from 'ioredis'
import { env } from './env'

let redis: Redis | null = null

export function getRedisClient(): Redis {
  if (redis) return redis

  try {
    if (env.REDIS_URL) {
      // Usar REDIS_URL (producción o desarrollo)
      redis = new Redis(env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) return null
          const delay = Math.min(times * 50, 2000)
          return delay
        },
        enableReadyCheck: true,
        lazyConnect: false,
      })
    } else {
      redis = new Redis({
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        password: env.REDIS_PASSWORD || undefined,
        db: env.REDIS_DB,
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) return null
          const delay = Math.min(times * 50, 2000)
          return delay
        },
        enableReadyCheck: true,
        lazyConnect: false,
      })
    }

    redis.on('connect', () => {
      console.log('✅ Redis: Conectando...')
    })

    redis.on('ready', () => {
      console.log('✅ Redis: Listo para usar')
    })

    redis.on('error', (err) => {
      console.error('❌ Redis error:', err.message)
    })

    redis.on('close', () => {
      console.log('⚠️ Redis: Conexión cerrada')
    })

    return redis
  } catch (error) {
    console.error('❌ Error al crear cliente Redis:', error)
    throw error
  }
}

export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit()
    redis = null
    console.log('✅ Redis: Conexión cerrada correctamente')
  }
}

export { redis }
