import express from 'express'
import cluster from 'cluster'
import bodyParser from 'body-parser'
import os from 'os'
import { config } from './config/general.config'
import { initializeMongoose } from './services/db/db.service'
import CategoryRouter from './routes/categories/index.route'
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

//import routes 
app.get('/',(req,res)=>{
    const str:string ="PK";
    console.log(str)
    res.send(str)
})
app.use('/c', CategoryRouter);

//cluster setup
const numCPUS = os.cpus().length
if (cluster.isPrimary) {

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
