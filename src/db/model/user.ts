import db from '../table'
import redis from '../_redis'
import * as types from '../../types';

const SUCCESS = true

class User {
  static async create (id: number): Promise<boolean> {
    await db.User.create({
      id
    })

    return SUCCESS
  }

  static async find (id: number): Promise<number> {
    let result = await db.WelcomeMessage.findOne({
      where: {
        id
      }
    })

    return (result ? (<{id: number}>result.get()).id : 0)
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