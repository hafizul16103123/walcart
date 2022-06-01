import express from 'express'
import cluster from 'cluster'
import os from 'os'
import { config } from './config/general.config'
const app = express()

app.get('/test',(req,res)=>{
    const str:string ="PK";
    console.log(str)
    res.send(str)
})

//cluster setup
const port = process.env.PORT
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
