var config = {
    dbmysql: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        db_name: process.env.MYSQL_DATABASE
    },
    //server details
    default: {
        host: '127.0.0.1',
        port: '3000'
    }

}

module.exports = config;