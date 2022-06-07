import { IResult } from './../services/db/dbQueries';
import express from 'express';
import redisClient from '../config/redis.config';

export const responseFormatMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log({ responseFormatMiddleware: res })
  next()
}
// export async function getCategoryMiddleware(req: express.Request, res: express.Response | any, next: express.NextFunction) {
//   let category
//   const id = req.params.id;
//   const data = await cacheSingleCategory(id)
//   if (data) {
//     res.category = data
//     next()
//   } else {
//     try {
//       category = await findOne({ model: Category, obj: { _id: req.params.id }, projection: { name: 1, isRoot: 1, leaf: 1, active: 1 } })
//       if (category == null) {
//         return res.status(404).json({ message: 'Cannot find category' })
//       }
//     } catch (err: any) {
//       return res.status(500).json({ message: err.message })
//     }
//     res.category = category.queryResponse
//     const DEFAULT_EXPIRATION = config.defaultCashExpiration;
//     await redisClient.setEx(id, DEFAULT_EXPIRATION, JSON.stringify(res.category));
//     next()
//   }
 
// }

export async function allCategoryCacheMiddleware(req: express.Request, res: express.Response | any, next: express.NextFunction) {
  const key = "all_categories"
  const value = await redisClient.get(key);
  if (value) {
    console.log('from cached')
    res.send(JSON.parse(value))
  } else {
    next()
  }
}
export async function activeCategoryCacheMiddleware(req: express.Request, res: express.Response | any, next: express.NextFunction) {
  const key = "active_categories"
  const value = await redisClient.get(key);
  if (value) {
    console.log('from cached')
    res.send(JSON.parse(value))
  } else {
    next()
  }
}
export async function deactiveCategoryCacheMiddleware(req: express.Request, res: express.Response | any, next: express.NextFunction) {
  const key = "deactive_categories"
  const value = await redisClient.get(key);
  if (value) {
    console.log('from cached')
    res.send(JSON.parse(value))
  } else {
    next()
  }
}
export async function singleCategoryCacheMiddleware(req: express.Request, res: express.Response | any, next: express.NextFunction) {
  const key = req.params.id
  const value = await redisClient.get(key);
  if (value) {
    console.log('from cached')
    const response: IResult = {
      success: true,
      statusCode: 200,
      queryResponse: JSON.parse(value),
      message: '',
  };
    res.send(response)
  } else {
    next()
  }
}
export async function cacheSingleCategory(id: string) {
  const key = id
  const value = await redisClient.get(key);
  if (value) {
    console.log('from cached')
    return JSON.parse(value)
  } else {
    return null;
  }
}