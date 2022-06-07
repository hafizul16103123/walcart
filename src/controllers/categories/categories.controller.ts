
import { categoryDTO } from '../../models/categories/dtos/categories.dto'
import * as categoryService from '../../services/categories/categories.service'
import express from 'express'
export const create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const data: categoryDTO = req.body
    try {
        const response = await categoryService.createCategory(data);
        res.json(response)
    } catch (err:any) {
        console.error(`Error while creating programming language`, err.message);
        next(err);
    }

}
export const getAllCategories = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const response = await categoryService.allCategories(res)
    res.json(response);
}
export const getAllActiveCategories = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const response = await categoryService.getAllActiveCategories()
    res.json(response);
}
export const getAllDeactiveCategories = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const response = await categoryService.getAllDeactiveCategories()
    res.json(response);
}
export const searchCategory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const response = await categoryService.searchCategory(req.params.key, res)
    res.json(response);
}

export const getCategory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const response = await categoryService.getCategory(req,res)
    res.json(response);
}
export const updateCategory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const response = await categoryService.updateCategory(req, res)
    res.json(response);
}
export const deleteCategory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const response = await categoryService.deleteCategory(req)
    res.json(response);
}
export const deactiveParentCategories = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const response = await categoryService.deactiveParentCategories(req,res)
    res.json(response);
}
export const activeParentCategories = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const response = await categoryService.activeParentCategories(req,res)
    res.json(response);
}
