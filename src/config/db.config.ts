import dotenv from 'dotenv'
dotenv.config()
interface IDbConfig {
    host: string,
    port: string
    user: string,
    password: string,
    database: string,
}
const getDbConfig = (): IDbConfig => {
    // get env value and allise them
    const { DB_HOST: host, DB_PORT: port, DB_NAME: database, DB_USER: user, DB_PASSWORD: password } = process.env

    // check dotenv provided  properly or not 
    if (!host) throw new Error("DB Host is required")
    if (!port) throw new Error("DB Port is required")
    if (!database) throw new Error("DB Name is required")
    if (!user) throw new Error("DB User is required")
    if (!password) throw new Error("DB Password is required")

    return {
        host,
        port,
        database,
        user,
        password
    }
}
export const dbConfig = getDbConfig()