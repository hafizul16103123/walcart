import dotenv from 'dotenv'
dotenv.config()

interface IConfig{
    port:string
    defaultCashExpiration:number
}

const getConfig = ():IConfig=>{
    const env = process.env
    const port = env.PORT
    const defaultCashExpiration = Number(env.DEFAULT_CACHE__EXPIRATION)

    // check dotenv provided  properly or not 
    if(!port) throw new Error("Port is required")
    if(!defaultCashExpiration) throw new Error("Default Cash Expiration is required")
    return{
        port,
        defaultCashExpiration
    }
}
export const config = getConfig()