import mongoose from 'mongoose'
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:false,
    }
})

export const User = mongoose.model('User',userSchema)