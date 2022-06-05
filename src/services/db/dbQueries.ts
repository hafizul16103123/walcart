export interface IResult {
    success: boolean;
    queryResponse: any;
    responseCount?: number;
    statusCode?: number;
    message: string|any;
}

// export interface IPaginationResult {
//     success: boolean;
//     queryResponse: any;
//     responseCount: number;
//     paginationData: {
//         totalNumberOfResults: number;
//         numberOfPages: number;
//     };
//     message: string |any;
// }

export const addNew = async (params: { model: any; obj: any }) => {
    const result: IResult = {
        success: false,
        statusCode: 201,
        queryResponse: null,
        message: null,
    };

    await new Promise<void>((resolve) => {
        new params.model(params.obj)
            .save()
            .then((res: any) => {
                delete res._id;
                result.success = true;
                result.queryResponse = res;
                resolve();
            })
            .catch((err:any) => {
                result.message = err.message;
                result.statusCode = err.code;
                resolve(err.message);
            });
    });

    return result;
};

export const findOne = async (params: { model: any; obj: any,projection?:any }) => {
    const result: IResult = {
        success: false,
        queryResponse: null,
        statusCode: 200,
        message: null,
    };

    await new Promise<void>((resolve) => {
        params.model.findOne(params.obj,(err: any, res: any) => {
            if (err) {
                result.message = 'Could not connect to the database';
            } else {
                result.success = true;
                result.statusCode = 200;
                result.queryResponse = res;
            }

            resolve();
        }).select(params.projection);
    });

    return result;
};

export const findAll = async (params: {
    model: any;
    obj: any;
    projection?: any;
}) => {
    const result: IResult = {
        success: false,
        statusCode: 200,
        queryResponse: null,
        responseCount: 0,
        message: null,
    };

    await new Promise<void>((resolve) => {
        params.model
            .find(params.obj, (err: any, res: any) => {
                if (err) {
                    result.message = 'Could not connect to the database';
                } else {
                    result.success = true;
                    result.queryResponse = res;
                    result.statusCode= 200;
                    result.responseCount = res.length;
                }
                resolve();
            }).select(params.projection)
           
    });
    return result;
};
export const findAllAndUpdate = async (params: {
    model: any;
    obj: any;
    updateObject: any;
}) => {
    const result: IResult = {
        success: false,
        queryResponse: null,
        message: null,
    };

    await new Promise<void>((resolve) => {
        params.model.updateMany(
            params.obj,
            { $set: params.updateObject },
            (err: any, res: any) => {
                if (err) {
                    result.message = 'Could not connect to the database';
                } else {
                    if (res) {
                        result.success = true;
                        result.queryResponse = res;
                    } else {
                        result.message = 'Invalid request';
                    }
                }

                resolve();
            },
        );
    });

    return result;
};

// export const updateOne = async (params: {
//     element: any;
//     updateObject: any;
// }) => {
//     const result: IResult = {
//         success: false,
//         queryResponse: null,
//         message: null,
//     };

//     await new Promise<void>((resolve) => {
//         for (const key in params.updateObject) {
//             params.element[key] = params.updateObject[key];
//         }

//         params.element
//             .save()
//             .then((res: any) => {
//                 result.success = true;
//                 result.queryResponse = res;

//                 resolve();
//             })
//             .catch((err) => {
//                 result.message = 'Something went wrong';
//                 resolve();
//             });
//     });

//     return result;
// };

// export const deleteOne = async (params: { element: any }) => {
//     const result: IResult = {
//         success: false,
//         queryResponse: null,
//         message: null,
//     };

//     await new Promise<void>((resolve) => {
//         params.element
//             .remove()
//             .then((res: any) => {
//                 result.success = true;
//                 result.queryResponse = res;

//                 resolve();
//             })
//             .catch((err) => {
//                 result.message = 'Something went wrong';
//                 resolve();
//             });
//     });

//     return result;
// };



