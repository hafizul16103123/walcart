
import Joi from "@hapi/joi";
export const categoryValidator = Joi.object({
    name: Joi.string().required(),
    isRoot: Joi.boolean().required(),
    parentId: Joi.string().required(),
    leaf: Joi.boolean().required(),
    active: Joi.boolean().required(),
});