import { Category } from "../../models/categories/entities/categories.schema"

export const createCategory = (data:categoryDTO)=>{
    Category.create({
        name:data.name
    })
}