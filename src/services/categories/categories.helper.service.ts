import { singleCategoryDTO } from './../../models/categories/dtos/categories.dto';

import { findAllAndUpdate, findOne } from '../db/dbQueries';
import { Category } from '../../models/categories/entities/categories.schema';
import { findAll } from '../db/dbQueries';
import * as cacheService from '../cache/cache.service';
import express from "express"

// helper functions  for
export async function getChildCategories(parentCategory: singleCategoryDTO) {
    let data: singleCategoryDTO[] = []
    let children = await getChildCategory(parentCategory.id)
    if (children.length > 0) {
        children = await findRecursiveChildren(children);
        data = [...data, ...children]
    }
    return data
}
export async function findRecursiveChildren(children: singleCategoryDTO[]) {
    for (const item of children) {
        if (item.leaf) {
            const ch = await getChildCategory(item.id);
            let childrenTemp: singleCategoryDTO[] = []
            childrenTemp = await findRecursiveChildren(ch);
            children = [...children, ...childrenTemp];
        }
    }
    return children;
}
export async function activeOrDeactiveParentCategory(id: string, action: boolean, res:express.Response) {
    const parentCategory = await getSingleCategory(id);
    const childCategory = await getChildCategories(parentCategory);
    const childWithParents = [...childCategory, parentCategory];
    const categoryIds = childWithParents?.map((e: singleCategoryDTO) => e.id);
    const updatedRecord = await findAllAndUpdate({ model: Category, obj: { _id: { $in: categoryIds } }, updateObject: { active: action } });
    if (updatedRecord.queryResponse !== null) {
        for (const id of categoryIds) {
            cacheService.deleteSingleCategoryFromCache(id);
            const singleDoc = await getSingleCategory(id);
            cacheService.updateSingleCategoryCache(singleDoc);
        }
        cacheService.updateCategoryListCache();
    }
    res.json(updatedRecord.queryResponse);
}
export async function getChildCategory(id: string) {
    const data = await findAll({ model: Category, obj: { parentId: id }, projection: { name: 1, parentId: 1, isRoot: 1, leaf: 1, active: 1 } });
    return data.queryResponse
}
export async function getSingleCategory(id: string) {
    const data = await findOne({ model: Category, obj: { _id: id }, projection: { name: 1, isRoot: 1, leaf: 1, active: 1 } });
    return data.queryResponse
}
export async function categorySearch(key: string) {
    const doc = await findOne({ model: Category, obj: { name: { $regex: key } }, projection: { name: 1, isRoot: 1, leaf: 1, active: 1 } });
    return doc.queryResponse;
}


