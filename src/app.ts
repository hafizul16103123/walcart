import express, { NextFunction } from 'express'
import cluster from 'cluster'
import bodyParser from 'body-parser'
import os from 'os'
import { config } from './config/general.config'
import { initializeMongoose } from './services/db/db.service'
import CategoryRouter from './routes/categories/index.route'
import redisClient from './config/redis.config'
import { swaggerDocumentation } from './config/swagger'
import swaggerUi from 'swagger-ui-express'
const app = express()

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

app.use('/categories', CategoryRouter);
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocumentation()))

//handle 404 not found Error
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    const obj = {
        success: false,
        statusCode: 404,
        queryResponse: null,
        message: "Requested URL not found!",
    };
    res.send(obj)
})

//cluster setup
if (cluster.isPrimary) {
    const numCPUS = os.cpus().length
    for (let i = 0; i < numCPUS; i++) {
        cluster.fork()
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`)
        cluster.fork()
    })

} else {
    const port = config.port
    app.listen(port, () => {
        console.log(`App is started on http://localhost:${port} and process id ${process.pid}`)
    })
}
