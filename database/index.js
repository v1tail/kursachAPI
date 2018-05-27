const mongoose = require('mongoose');
let database;
const dbUri = process.env.DB_URI;
module.exports = {
    get database(){
        if(database){
            return database
        }
        throw err('connect to DB first')
    },
    async connectToTheDataBase(){
        // When successfully connected
        mongoose.connection.on('connected', () => {
            console.log(`Mongoose default connection open to database`);
        });

        // If the connection throws an error
        mongoose.connection.on('error', (err) => {
            console.error(`Mongoose default connection error:`, err);
        });

        // When the connection is disconnected
        mongoose.connection.on('disconnected', () => {
            console.error('Mongoose default connection disconnected');
        });

        // If the Node process ends, close the Mongoose connection
        process.on('SIGINT', () => {
            mongoose.connection.close(() => {
                console.log('Mongoose default connection disconnected through app termination');
                process.exit(0);
            });
        });
        database = mongoose;
        return mongoose.connect(dbUri)
    }
};
