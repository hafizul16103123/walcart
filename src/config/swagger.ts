import { required } from "@hapi/joi"

export const swaggerDocumentation = () => {
    return {
        openapi: "3.0.1",
        info: {
            version: "1.0.0",
            title: "Category Todos",
            description: "Category Todos API",
            contact: {
                name: "Md. Hafizul Islam",
                email: "islamhafizul158@gmail.com",
            }
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Local server"
            },
        ], components: {
            schemas: {
                id: {
                    type: 'string',
                    description: "An id of a category",
                    example: "629b834b67c6d1bfe27c5ba1"
                },
                key: {
                    type: 'string',
                    description: "Name of category",
                    example: "Electronics"
                },
                Category: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: "Todo identification number",
                            example: "dg34392525825382852ytyVgh"
                        },
                        name: {
                            type: 'string',
                            description: "Category name",
                            example: "Electronics",
                            required:true
                        },
                        slug: {
                            type: 'string',
                            description: "Category Slug",
                            example: "electronics"
                        },
                        isRoot: {
                            type: "boolean",
                            description: "Define Root category or not",
                            example: true,
                            required:true
                        },
                        active: {
                            type: "boolean",
                            description: "Define Category is active or not",
                            example: true,
                            required:true
                        },
                        leaf: {
                            type: "boolean",
                            description: "Define category has subcategory or not",
                            example: true,
                            required:true
                        },
                        parentId: {
                            type: "number",
                            description: "Parent category id,which parent this category is belongs to",
                            example: "629b834b67c6d1bfe27c5ba1",
                            required:true
                        }
                    }
                },
                CategoryInput: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: "Category name",
                            example: "Electronics"
                        },
                        isRoot: {
                            type: "boolean",
                            description: "Define Root category or not",
                            example: true
                        },
                        active: {
                            type: "boolean",
                            description: "Define Category is active or not",
                            example: true
                        },
                        leaf: {
                            type: "boolean",
                            description: "Define category has subcategory or not",
                            example: true
                        },
                        parentId: {
                            type: "number",
                            description: "Parent category id,which parent this category is belongs to",
                            example: "629b834b67c6d1bfe27c5ba1"
                        }
                    }
                }


            }
        }, tags: {
            name: 'Category Todo CRUD operations'
        },
        paths: {
            '/categories': {
                get: {
                    tags: ['Todo CRUD operations'],
                    description: "Get todos",
                    operationId: 'getAllTodos',
                    parameters: [],
                    responses: {
                        '200': {
                            description: "Todos were obtained",
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Category'
                                    }
                                }
                            }
                        }
                    }
                },

            },
            '/categories/active': {
                get: {
                    tags: ['Todo CRUD operations'],
                    description: "Get all Active categories",
                    operationId: 'getOnlyActiveTodos',
                    parameters: [],
                    responses: {
                        '200': {
                            description: "Todos were obtained",
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Category'
                                    }
                                }
                            }
                        }
                    }
                },

            },
            '/categories/deactive': {
                get: {
                    tags: ['Todo CRUD operations'],
                    description: "Get all Active categories",
                    operationId: 'getOnlyDeactiveTodos',
                    parameters: [],
                    responses: {
                        '200': {
                            description: "Todos were obtained",
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Category'
                                    }
                                }
                            }
                        }
                    }
                },

            },
            "/categories/{id}": {
                get: {
                    tags: ['Todo CRUD operations'],
                    description: "Get a todo",
                    operationId: "getTodo",
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            schema: {
                                $ref: "#/components/schemas/id"
                            },
                            required: true,
                            description: "A single todo id"
                        }
                    ],
                    responses: {
                        '200': {
                            description: "Todo is obtained",
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: "#/components/schemas/Category"
                                    }
                                }
                            }
                        },
                    }
                },
                put: {
                    tags: ['Todo CRUD operations'],
                    description: "Update todo",
                    operationId: "updateTodo",
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            schema: {
                                $ref: "#/components/schemas/id"
                            },
                            required: true,
                            description: "Id of todo to be updated"
                        }
                    ],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/CategoryInput'
                                }
                            }
                        }
                    },
                    responses: {

                        '200': {
                            description: "Todo updated successfully"
                        },
                        '404': {
                            description: "Todo not found"
                        },
                        '500': {
                            description: "Server error"
                        }


                    }


                },
                delete:{
                    tags: ['Todo CRUD operations'],
                    description: "Deleting a todo",
                    operationId: "deleteTodo",
                    parameters:[
                        {
                            name:"id",
                            in:"path",
                            schema:{
                                $ref:"#/components/schemas/id"
                            },
                            required:true,
                            description: "Deleting a done todo"
                        }
                    ],
                    responses:{
                        '200':{
                            description:"Todo deleted successfully"
                        },
                        '404':{
                            description:"Todo not found"
                        },
                        '500':{
                            description:"Server error"
                        }
                    }
                }
            },
            "/categories/search/{key}": {
                get: {
                    tags: ['Todo CRUD operations'],
                    description: "Get a todo",
                    operationId: "searchTodo",
                    parameters: [
                        {
                            name: "key",
                            in: "path",
                            schema: {
                                $ref: "#/components/schemas/key"
                            },
                            required: true,
                            description: "A single todo id"
                        }
                    ],
                    responses: {
                        '200': {
                            description: "Todo is obtained",
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: "#/components/schemas/Category"
                                    }
                                }
                            }
                        },
                    }
                }
            },
            "/categories/create": {
                post: {
                    tags: ['Categiory Create operations'],
                    description: "Create Category todo",
                    operationId: "createTodo",
                    parameters: [],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/CategoryInput'
                                }
                            }
                        }
                    },
                    responses: {
                        '201': {
                            description: "Todo created successfully"
                        },
                        '500': {
                            description: 'Server error'
                        }
                    }
                }
            },
            "/categories/active/{id}":{
                put: {
                    tags: ['Category Active / Deactive operations'],
                    description: "Update todo",
                    operationId: "activeTodo",
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            schema: {
                                $ref: "#/components/schemas/id"
                            },
                            required: true,
                            description: "Id of todo to be updated"
                        }
                    ],
                    responses: {

                        '200': {
                            description: "Todo updated successfully"
                        },
                        '404': {
                            description: "Todo not found"
                        },
                        '500': {
                            description: "Server error"
                        }
                    }


                },
            },
            "/categories/deactive/{id}":{
                put: {
                    tags: ['Category Active / Deactive operations'],
                    description: "Update todo",
                    operationId: "deactiveTodo",
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            schema: {
                                $ref: "#/components/schemas/id"
                            },
                            required: true,
                            description: "Id of todo to be updated"
                        }
                    ],
                    responses: {

                        '200': {
                            description: "Todo updated successfully"
                        },
                        '404': {
                            description: "Todo not found"
                        },
                        '500': {
                            description: "Server error"
                        }


                    }


                },
            },
           
        }
    }
}