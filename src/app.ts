import express from 'express'
import cluster from 'cluster'
import mongoose from 'mongoose'
import os from 'os'
import { config } from './config/general.config'
import { dbConfig } from './config/db.config'
import { initializeMongoose } from './services/db/db.service'
import 
const app = express()
//connect to mongoose start
initializeMongoose()


//import routes 
app.use('/programming-languages', categoryRouter);
app.get('/test',(req,res)=>{
    const str:string ="PK";
    console.log(str)
    res.send(str)
})

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
