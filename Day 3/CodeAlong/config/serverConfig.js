require('dotenv').config();
const config = {
    port: process.env.PORT || 4000,
    appName: process.env.APP_NAME || 'MyApp',

};

module.exports = config;