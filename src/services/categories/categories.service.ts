import * as validator from './../../middlewares/validation.middleware';
import express from 'express'
import { addNew, findAllAndUpdate, findOne, IResult } from './../db/dbQueries';
import { Category } from './../../models/categories/entities/categories.schema';
import { findAll } from '../db/dbQueries';
import redisClient from '../../cache/redis.cache';
import { categoryDTO } from '../../models/categories/dtos/categories.dto';
import { config } from '../../config/general.config';

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
       if(doc.queryResponse!==null){
           // single category cache update
           await updateSingleCategoryCache(doc.queryResponse.id, config.defaultCashExpiration);
           // category list cache update
           await updateCategoryListCache(config.defaultCashExpiration);
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
export const getCategory = async (req:express.Request,res:express.Response)=>{
    const id = req.params.id
    const category = await getSingleCategory(id)
    if(category){
        const response: IResult = {
            success: true,
            statusCode: 200,
            queryResponse: category,
            message: '',
        };
        return response
    }else{
        const response: IResult = {
            success: false,
            statusCode: 422,
            queryResponse: null,
            message: 'Invalid Category id',
        };
        return response
    }
}
export const allCategories = async (res: any) => {
    const DEFAULT_EXPIRATION = config.defaultCashExpiration
    const resp = await findAll({ model: Category, obj: {}, projection: { name: 1, isRoot: 1, leaf: 1, active: 1 } })
    await redisClient.setEx('all_categories', DEFAULT_EXPIRATION, JSON.stringify(resp));
    res.send(resp);
}
export const getAllActiveCategories = async () => {
    const res = await findAll({ model: Category, obj: { active: true } })
    return res

}
export const getSearchCategoryWithParents = async (key: string, res: any) => {
    //check in cache
    const cacheDate = await redisClient.get(key)
    if (cacheDate) return JSON.parse(cacheDate)

    const DEFAULT_EXPIRATION = config.defaultCashExpiration
    const category = await categorySearch(key)
    const childCategory = await getChildCategories(category)
    let doc;
    if (childCategory) {
        doc = { category, childCategory }
        await redisClient.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(doc));
        const response: IResult = {
            success: true,
            statusCode: 200,
            queryResponse: doc,
            message: '',
        };
        return response
    }
    doc = { category }
    await redisClient.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(doc));
    const response: IResult = {
        success: true,
        statusCode: 200,
        queryResponse: doc,
        message: '',
    };
    return response
}
export const updateCategory = async (req: any, res: any) => {
    const id = req.params.id
    const body = req.body
    const doc = await Category.updateOne({ _id: id }, body)

    //handle cache
    const DEFAULT_EXPIRATION = config.defaultCashExpiration
    const cacheDeleted = await redisClient.del(id)
    if (cacheDeleted === 1) {
        // single category cache update
        await updateSingleCategoryCache(id, DEFAULT_EXPIRATION);
        // category list cache update
        await updateCategoryListCache(DEFAULT_EXPIRATION);
    }
    res.json(doc)
}
export const deleteCategory = async (req: express.Request) => {
    const id  = req.params.id;
    const doc = await Category.deleteOne({_id:id})
    console.log({doc})
    if (doc) {
        // single category cache update
        await deleteSingleCategoryFromCache(id, config.defaultCashExpiration);
        // category list cache update
        await updateCategoryListCache(config.defaultCashExpiration);
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
export const deactiveParentCategories = async (req: any,res:any) => {
const id = req.params.id
    const parentCategory = await getSingleCategory(id)
    console.log({1:parentCategory})
    const childCategory = await getChildCategories(parentCategory)
    console.log({childCategory})
    const categoryIds = childCategory?.map(e => e.id)
    const updatedRecord = await findAllAndUpdate({ model: Category, obj: { _id: { $in: categoryIds } }, updateObject: { active: false } })
    if(updatedRecord.queryResponse!==null){
        for (const id of categoryIds) {
            deleteSingleCategoryFromCache(id,config.defaultCashExpiration)
            updateSingleCategoryCache(id,config.defaultCashExpiration)
        }
        updateCategoryListCache(config.defaultCashExpiration)
    }
    res.json(updatedRecord.queryResponse);
}

async function getChildCategories(parentCategory: any) {
    const categories: any[] = [];
    let parentCategoryTemp = parentCategory;
    console.log({ parentCategoryTemp })
    while (parentCategoryTemp.leaf) {
        if (parentCategoryTemp !== null) {
            const doc = await getChildCategory(parentCategoryTemp.id);
            parentCategoryTemp = doc;
            categories.push(parentCategoryTemp)
            
        }

    }
    return categories;
}

async function getChildCategory(id: string) {
    const data = await findOne({ model: Category, obj: { parentId: id }, projection: { name: 1, isRoot: 1, leaf: 1, active: 1 } });
    return data.queryResponse
}
async function getSingleCategory(id: string) {
    const data = await findOne({ model: Category, obj: { _id: id }, projection: { name: 1, isRoot: 1, leaf: 1, active: 1 } });
    return data.queryResponse
}
async function categorySearch(key: string) {
    const doc = await findOne({ model: Category, obj: { name: { $regex: key } }, projection: { name: 1, isRoot: 1, leaf: 1, active: 1 } });
    return doc.queryResponse;
}


//cache related operation
async function updateSingleCategoryCache(id: any, DEFAULT_EXPIRATION: number) {
    const singleDoc = await getSingleCategory(id);
    await redisClient.setEx(id, DEFAULT_EXPIRATION, JSON.stringify(singleDoc));
}
async function deleteSingleCategoryFromCache(id: any, DEFAULT_EXPIRATION: number) {
    // const singleDoc = await getSingleCategory(id);
    const cacheDeleted = await redisClient.del(id)
 
}

async function updateCategoryListCache(DEFAULT_EXPIRATION: number) {
    const resp = await findAll({ model: Category, obj: {}, projection: { name: 1, isRoot: 1, leaf: 1, active: 1 } });
    await redisClient.setEx('all_categories', DEFAULT_EXPIRATION, JSON.stringify(resp));
}

