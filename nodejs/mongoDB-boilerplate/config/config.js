var config = {
    dbmongo: {
        database: process.env.MONGO_DATABASE,
        port: process.env.MONGO_PORT
    },
    //server details
    default: {
        host: '127.0.0.1',
        port: '3000'
    }

}

module.exports = config;