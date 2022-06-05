import { boolean } from '@hapi/joi'
import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        index:true,
        unique:true,
        require:true,
    },
    slug:{
        type:String,
        index:true,
        unique:true,
        require:true,
    },
    isRoot:{
        type:Boolean,
        index:true,
        require:true,
        unique:false
    },
    parentId:{
        type:String,
        index:true,
        require:true,
        unique:false
    },
    leaf:{
        type:Boolean,
        require:true,
        unique:false
    },
    active:{
        type:Boolean,
        require:true,
        default:true,
        unique:false
    }
})

export const Category = mongoose.model('Category',categorySchema)