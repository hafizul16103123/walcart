import { config } from './config/general.config';
// import cluster from 'cluster'
import app from './server'
// import os from 'os'
// //cluster setup
// if (cluster.isPrimary) {
//     const numCPUS = os.cpus().length
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

const port = config.port
app.listen(port, () => {
    console.log(`App is started on http://localhost:${port} and process id ${process.pid}`)
})
