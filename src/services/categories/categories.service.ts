import { Category } from './../../models/categories/entities/categories.schema';
import { categoryDTO } from "../../models/categories/dtos/categories.dto"

export const createCategory = (data:categoryDTO)=>{
   const res =  Category.create({
        name:data.name
    })
    return res
}