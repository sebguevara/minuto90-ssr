import { z } from 'zod'

const envSchema = z.object({
  PRIVATE_GOAL_SERVE_API_KEY: z.string().min(1),
  PRIVATE_GOALSERVE_BASE_URL: z.string().min(1),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.coerce.number().default(0),
  REDIS_URL: z.string().optional(),
  NEXT_PUBLIC_BASE_URL: z.string().min(1),
  NEXT_PUBLIC_LOGO_BASE_URL: z.string().min(1),

  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export type Env = z.infer<typeof envSchema>
const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.issues)
  throw new Error('Invalid environment variables')
}

export const env = parsed.data
