export interface categoryDTO{
    name:string,
    isRoot:{type:boolean,required:true},
    parentId:string,
    leaf:boolean,
    active:boolean
}