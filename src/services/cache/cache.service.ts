import { singleCategoryDTO } from './../../models/categories/dtos/categories.dto';
import redisClient from "../../config/redis.config";
import { config } from "../../config/general.config";
import { Category } from "../../models/categories/entities/categories.schema";
import { findAll } from "../db/dbQueries";
import { categoryDTO } from "../../models/categories/dtos/categories.dto";

//cache related operation
export async function updateSingleCategoryCache(singleDoc: singleCategoryDTO) {
    const DEFAULT_EXPIRATION = config.defaultCashExpiration
    await redisClient.setEx(singleDoc.id, DEFAULT_EXPIRATION, JSON.stringify(singleDoc));
}
export async function deleteSingleCategoryFromCache(id: string) {
    const cacheDeleted = await redisClient.del(id)

}
export async function updateCategoryListCache() {
    const DEFAULT_EXPIRATION = config.defaultCashExpiration
    const resp = await findAll({ model: Category, obj: {}, projection: { name: 1, isRoot: 1, leaf: 1, active: 1 } });
    await redisClient.setEx('all_categories', DEFAULT_EXPIRATION, JSON.stringify(resp));
}



