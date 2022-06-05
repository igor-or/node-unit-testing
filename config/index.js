const dotenv = require('dotenv');

dotenv.config();

const DB_URL =
    'mongodb+srv://' +
    process.env.MONGO_USER +
    ':' +
    process.env.MONGO_PASSWORD +
    '@' +
    process.env.MONGO_SERVER +
    '/';

module.exports = {
    PORT: process.env.PORT,
    DATABASE_URL:
        DB_URL + process.env.MONGO_DATABASE + '?retryWrites=true&w=majority',
    TEST_DATABASE_URL:
        DB_URL +
        process.env.MONGO_TEST_DATABASE +
        '?retryWrites=true&w=majority',
};
