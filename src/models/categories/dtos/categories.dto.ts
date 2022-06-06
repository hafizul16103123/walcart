export interface categoryDTO{
    name:string,
    isRoot:{type:boolean,required:true},
    parentId:string,
    leaf:boolean,
    active:boolean
}
export interface singleCategoryDTO{
    id:string,
    name:string,
    isRoot:{type:boolean,required:true},
    parentId:string,
    leaf:boolean,
    active:boolean
}