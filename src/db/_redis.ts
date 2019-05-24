import * as bluebird from "bluebird"
import * as Redis from "redis"
import { config } from "../config"

declare module "redis" {
// tslint:disable-next-line: interface-name
  export interface RedisClient extends NodeJS.EventEmitter {
    getAsync(key: string): Promise<string|null>
    setAsync(key: string, value: string, mode?: string, duration?: number): Promise<any>
  }
}

const redisConfig = {
  db: config.redis.database,
  host: config.redis.host,
  password: config.redis.password,
  port: config.redis.port,
}

if (redisConfig.password === "") {
  delete redisConfig.password
}

const oldRedis = Redis.createClient(redisConfig)
const db = bluebird.promisifyAll(oldRedis) as Redis.RedisClient

export default db
