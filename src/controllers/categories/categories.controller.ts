import { categoryDTO } from '../../models/categories/dtos/categories.dto'
import { createCategory } from '../../services/categories/categories.service'
export const get = (req: any, res: any, next: any)=> {
    const data:categoryDTO={
        name:"Electronics"
    }
    const response = createCategory(data)
    res.json(response);
}
