import express, { NextFunction } from 'express'
import cluster from 'cluster'
import bodyParser from 'body-parser'
import os from 'os'
import { config } from './config/general.config'
import { initializeMongoose } from './services/db/db.service'
import CategoryRouter from './routes/categories/index.route'
import redisClient from './cache/redis.cache'

// import { responseFormatMiddleware } from './moddlewares/index.middleware'
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const app = express()
const options = {
    // explorer: true,
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Express Swagger Documentation",
            version: "1.0.0"
        }
    },
    //path to API docs
    apis: ['./routes/categories/index.route']
}
const swaggerSpec = swaggerJsDoc(options)

//convert json string or from data to json
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

//connect to mongoose start
initializeMongoose()
//connect to redis
redisClient.connect()

//import routes 
app.get('/', (req, res) => {
    const str: string = "PK";
    res.send(str)
})
app.use('/categories', CategoryRouter);
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
//cluster setup
const numCPUS = os.cpus().length


//handle 404 not found Error
app.use((req, res, next) => {
    const obj = {
        success: false,
        statusCode: 404,
        queryResponse: null,
        message: "Requested URL not found!",
    };
    res.send(obj)
})

// /* Error handler middleware */
// app.use((err: any, req: any, res: any, next: any) => {
//     const statusCode = err.statusCode || 500;
//     console.error(err.message, err.stack);
//     res.status(statusCode).json({ 'message': err.message });

//     return;
// });

const port = config.port
app.listen(port, () => {
    console.log(`App is started on http://localhost:${port} and process id ${process.pid}`)
})

// if (cluster.isPrimary) {

//     for (let i = 0; i < numCPUS; i++) {
//         cluster.fork()
//     }

//     cluster.on('exit', (worker, code, signal) => {
//         console.log(`worker ${worker.process.pid} died`)
//         cluster.fork()
//     })

// } else {
//     const port = config.port
//     app.listen(port, () => {
//         console.log(`App is started on http://localhost:${port} and process id ${process.pid}`)
//     })
// }
