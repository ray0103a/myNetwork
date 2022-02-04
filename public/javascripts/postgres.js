exports.connectionString = function(){
    var connectionString;

    if (process.env.NODE_ENV !== 'production') {
        connectionString = {
            user: 'postgres',
            host: 'localhost',
            database: 'postgres',
            password: 'post0103',
            port: 5432
        };
    }
    else {
        connectionString = {
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        };
    }

    return connectionString
};