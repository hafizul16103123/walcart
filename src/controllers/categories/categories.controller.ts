
import { categoryDTO } from '../../models/categories/dtos/categories.dto'
import * as categoryService from '../../services/categories/categories.service'
import * as validator from '../../middlewares/validation.middleware'
import express from 'express'
export const create = async (req: any, res: any, next: any) => {
    const data: categoryDTO = req.body
    try {
        const response = await categoryService.createCategory(data);
        res.json(response)

    } catch (err: any) {
        console.error(`Error while creating programming language`, err.message);
        next(err);
    }

}
export const getAllCategories = async (req: any, res: any, next: any) => {
    const response = await categoryService.allCategories(res)
    res.json(response);
}
export const getAllActiveCategories = async (req: any, res: any, next: any) => {
    const response = await categoryService.getAllActiveCategories()
    res.json(response);
}
export const getSearchCategoryWithParents = async (req: any, res: any, next: any) => {
    const response = await categoryService.getSearchCategoryWithParents(req.params.key, res)
    res.json(response);
}
export const getCategory = async (req: any, res: any, next: any) => {
    const response = await categoryService.getCategory(req,res)
    res.json(response);
}
export const updateCategory = async (req: any, res: any, next: any) => {
    const response = await categoryService.updateCategory(req, res)
    res.json(response);
}
export const deleteCategory = async (req: any, res: any, next: any) => {
    const response = await categoryService.deleteCategory(req)
    res.json(response);
}
export const deactiveParentCategories = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const response = await categoryService.deactiveParentCategories(req,res)
    res.json(response);
}
