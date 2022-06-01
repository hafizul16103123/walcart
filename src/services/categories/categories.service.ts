import { User } from '../../models/users/entities/user.schema';
export const createUser = (data:userDTO)=>{
    User.create({
        name:data.name
    })
}