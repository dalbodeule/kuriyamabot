import * as types from "../../types";
import redis from "../_redis";
import db from "../table";

const SUCCESS = true;
const PREFIX = "user:";
const EXPIRE = 60 * 60 * 24;

class User {
  public static async create(id: number, title: string, type: string): Promise<boolean> {
    await db.User.create({
      id,
      title,
      type,
    });

    return SUCCESS;
  }

  public static async find(id: number): Promise<types.model.returnUser | undefined> {
    const query = await redis.getAsync(PREFIX + id);

    if (query) {
      const [title, type] = JSON.parse(query);

      return {
        id,
        title,
        type,
      };
    } else {
      const result = await db.User.findOne({
        where: {
          id,
        },
      });
      let temp;
      if (result) {
        temp = (result.toJSON() as types.model.returnUser);
        redis.setAsync(PREFIX + id, JSON.stringify([temp.title, temp.type]), "EX", EXPIRE);
      }

      return temp;
    }
  }

  public static async update(id: number, title: string|null, type: string|null): Promise<boolean> {
    let updateData;

    if ( title && type ) { updateData = { title, type }; } else if ( title ) { updateData = { title }; } else if ( type ) { updateData = { type }; } else { return false; }

    await db.User.update(updateData, {
      where: {
        id,
      },
    });

    await this.find(id);

    return SUCCESS;
  }

  public static async delete(id: number): Promise<boolean> {
    await db.User.destroy({
      where: {
        id,
      },
    });

    return SUCCESS;
  }
}

export default User;
