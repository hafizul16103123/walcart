import dotenv from 'dotenv'
dotenv.config()

interface IConfig{
    port:string
}

const getConfig = ():IConfig=>{
    const env = process.env
    const port = env.PORT

    // check dotenv provided  properly or not 
    if(!port) throw new Error("Port is required")
    return{
        port
    }
}
export const config = getConfig()