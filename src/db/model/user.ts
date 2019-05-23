import db from '../table'
import redis from '../_redis'
import * as types from '../../types';

const SUCCESS = true
const PREFIX = 'user:'
const EXPIRE = 60*60*24

class User {
  static async create (id: number, title: string, type: string): Promise<boolean> {
    await db.User.create({
      id,
      title,
      type
    })

    return SUCCESS
  }

  static async find (id: number): Promise<types.model.returnUser | undefined> {
    let query = await redis.getAsync(PREFIX + id)

    if (query) {
      let [title, type] = JSON.parse(query)  

      return {
        id,
        title,
        type
      }
    } else {
      let result = await db.User.findOne({
        where: {
          id
        }
      })
      let temp
      if (result) {
        temp = (<types.model.returnUser>result.toJSON())
        redis.setAsync(PREFIX + id, JSON.stringify([temp.title, temp.type]), 'EX', EXPIRE)
      }
      
      return temp
    }
  }

  static async update (id: number, title: string|null, type: string|null): Promise<boolean> {
    let updateData

    if ( title && type ) updateData = { title, type }
    else if ( title ) updateData = { title }
    else if ( type ) updateData = { type }
    else return false

    await db.User.update(updateData, {
      where: {
        id
      }
    })

    await this.find(id)

    return SUCCESS
  }
  
  static async delete (id: number): Promise<boolean> {
    await db.User.destroy({
      where: {
        id
      }
    })

    return SUCCESS
  }
}

export default User