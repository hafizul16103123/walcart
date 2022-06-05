import express from 'express';
import { NextFunction } from "express";
import redisClient from '../cache/redis.cache';
import { config } from '../config/general.config';
import { Category } from '../models/categories/entities/categories.schema';
import { findOne } from '../services/db/dbQueries';

export const responseFormatMiddleware = (req: any, res: any, next: any) => {
  console.log({ responseFormatMiddleware: res })
  next()
}
export async function getCategoryMiddleware(req: express.Request, res: express.Response | any, next: express.NextFunction) {
  let category
  const id = req.params.id;
  const data = await cacheSingleCategory(id)
  if (data) {
    res.category = data
    next()
  } else {
    try {
      category = await findOne({ model: Category, obj: { _id: req.params.id }, projection: { name: 1, isRoot: 1, leaf: 1, active: 1 } })
      if (category == null) {
        return res.status(404).json({ message: 'Cannot find category' })
      }
    } catch (err: any) {
      return res.status(500).json({ message: err.message })
    }
    res.category = category.queryResponse
    const DEFAULT_EXPIRATION = config.defaultCashExpiration;
    await redisClient.setEx(id, DEFAULT_EXPIRATION, JSON.stringify(res.category));
    next()
  }
 
}

export async function allCategoryCacheMiddleware(req: express.Request, res: express.Response | any, next: express.NextFunction) {
  const key = "all_categories"
  const value = await redisClient.get('all_categories');
  if (value) {
    res.send(JSON.parse(value))
  } else {
    next()
  }
}
async function cacheSingleCategory(id: string) {
  const key = id
  const value = await redisClient.get(key);
  if (value) {
    return JSON.parse(value)
  } else {
    return null;
  }
}
// async function cacheSingleCategory(req:express.Request,res:express.Response|any,next:express.NextFunction) {
//    const key =req.params.id
//    const value = await redisClient.get(key);
//    if (value) {
//        res.send(JSON.parse(value))
//    }else{
//        next()
//    }
// }