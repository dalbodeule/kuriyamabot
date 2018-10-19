import * as Redis from 'redis'
import * as bluebird from 'bluebird'
import { config as global, config } from '../config'

declare module 'redis' {
  export interface RedisClient extends NodeJS.EventEmitter {
    getAsync(key: string): Promise<string|null>;
    setAsync(key: string, value: string, mode?: string, duration?: number): Promise<any>;
  }
}

let redisConfig = {
  host: global.redis.host,
  port: global.redis.port,
  password: global.redis.password,
  db: global.redis.database
}

if (redisConfig.password === '') {
  delete redisConfig.password
}

const oldRedis = Redis.createClient(redisConfig)
const db = bluebird.promisifyAll(oldRedis) as Redis.RedisClient

export default db
