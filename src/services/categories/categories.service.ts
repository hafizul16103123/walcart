import * as validator from '../../middlewares/validation.middleware';
import express from 'express'
import { addNew, IResult } from '../db/dbQueries';
import { Category } from '../../models/categories/entities/categories.schema';
import { findAll } from '../db/dbQueries';
import redisClient from '../../config/redis.config';
import { categoryDTO } from '../../models/categories/dtos/categories.dto';
import { config } from '../../config/general.config';
import * as cacheService from '../cache/cache.service';
import * as categoryHelper from './categories.helper.service';
// Create category
export const createCategory = async (data: categoryDTO) => {

    //validate
    const { error, value } = validator.categoryValidator.validate(data)
    const slug = value?.name
    let finalData;
    if (slug) {
        finalData = { ...value, slug: slug.toLowerCase() }
    }
    if (!error) {
        const doc = await addNew({ model: Category, obj: finalData })
        if (doc.queryResponse !== null) {
            // single category cache update
            await cacheService.updateSingleCategoryCache(doc.queryResponse);
            // category list cache update
            await cacheService.updateCategoryListCache();
            await cacheService.updateActiveCategoryListCache();
        }
        return doc;
    }

    let errors = [];
    for (const err of error?.details) {
        errors.push(err.message)
    }
    const response: IResult = {
        success: false,
        statusCode: 422,
        queryResponse: null,
        message: errors,
    };
    return response

}
// Get single category
export const getCategory = async (req: express.Request, res: express.Response) => {
    const id = req.params.id
    //From db
    console.log("from bd")
    const category = await categoryHelper.getSingleCategory(id)
    console.log({category})
    if (category.success===false) {
        return category
    }else{
    // single category cache update
    const response: IResult = {
        success: true,
        statusCode: 200,
        queryResponse: category,
        message: '',
    };
    
    await cacheService.updateSingleCategoryCache(category);
    return response

    }


}
// Get all categories
export const allCategories = async (res: express.Response) => {
    const resp = await findAll({ model: Category, obj: {}, projection: { name: 1, isRoot: 1, leaf: 1, active: 1 } })
    console.log("from bd")
    // category list cache update
    await cacheService.updateCategoryListCache();
    res.send(resp);
}
// Get all active categories only
export const getAllActiveCategories = async () => {
    console.log("from bd")
    const res = await findAll({ model: Category, obj: { active: true } })
    // category list cache update
    await cacheService.updateActiveCategoryListCache();
    return res

}
// Get all deactive categories only
export const getAllDeactiveCategories = async () => {
    console.log("from bd")
    const res = await findAll({ model: Category, obj: { active: false } })
    // category list cache update
    await cacheService.updateDeactiveCategoryListCache();
    return res

}
// Search category with all nested sub categories
export const searchCategory = async (key: string, res: express.Response) => {
    //check in cache
    console.log("from cached")
    const cacheDate = await redisClient.get(key)
    if (cacheDate) return JSON.parse(cacheDate)
    console.log("from bd")
    const DEFAULT_EXPIRATION = config.defaultCashExpiration
    const category = await categoryHelper.categorySearch(key)
    if (category.success === false) {
        const response: IResult = {
            success: false,
            statusCode: 422,
            queryResponse: [],
            message: 'No Category Found',
        };
        return response
    }
    const childCategory = await categoryHelper.getChildCategories(category)
    let doc;
    if (childCategory) {
        doc = { category, childCategory }
        const response: IResult = {
            success: true,
            statusCode: 200,
            queryResponse: doc,
            message: '',
        };
        await redisClient.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(response));
        return response
    }
    doc = { category }
    const response: IResult = {
        success: true,
        statusCode: 200,
        queryResponse: doc,
        message: '',
    };
    await redisClient.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(doc));
    return response
}
// Update Category
export const updateCategory = async (req: express.Request, res: express.Response) => {
    const id = req.params.id
    const body = req.body
    const doc = await Category.updateOne({ _id: id }, body)

    //handle cache
    const cacheDeleted = await redisClient.del(id)
    if (cacheDeleted === 1) {
        // single category cache update
        const singleDoc = await categoryHelper.getSingleCategory(id);
        await cacheService.updateSingleCategoryCache(singleDoc);
        // category list cache update
        await cacheService.updateCategoryListCache();
        await cacheService.updateActiveCategoryListCache();
        await cacheService.updateDeactiveCategoryListCache();
    }
    res.json(doc)
}
// Delete Category
export const deleteCategory = async (req: express.Request) => {
    const id = req.params.id;
    console.log(id)
    const category = await categoryHelper.getSingleCategory(id)
    console.log({category})
    if (category.success===false) {
        console.log(1)
        const response: IResult = {
            success: false,
            statusCode: 422,
            queryResponse: [],
            message: 'In valid Category ID',
        };
        return response
    }
    const doc = await Category.deleteOne({ _id: id })
    console.log({ doc })
    if (doc) {
        // single category cache update
        await cacheService.deleteSingleCategoryFromCache(id);
        // category list cache update
        await cacheService.updateCategoryListCache();
        await cacheService.updateActiveCategoryListCache();
        await cacheService.updateDeactiveCategoryListCache();
        const response: IResult = {
            success: true,
            statusCode: 200,
            queryResponse: null,
            message: 'Catyegory deleted successfully',
        };
        return response
    }
    const response: IResult = {
        success: false,
        statusCode: 422,
        queryResponse: null,
        message: 'Catyegory did not delete successfully',
    };
    return response
}
// Deactive parent and child_category associated with that parent
export const deactiveParentCategories = async (req: express.Request, res: express.Response) => {
    const id = req.params.id
    const action: boolean = false
    return await categoryHelper.activeOrDeactiveParentCategory(id, action, res);

}
// Active parent and child_category associated with that parent
export const activeParentCategories = async (req: express.Request, res: express.Response) => {
    const id = req.params.id
    const action: boolean = true
    return await categoryHelper.activeOrDeactiveParentCategory(id, action, res);
}
