require('dotenv').config();
exports.envConst = {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  DB_DIALECT: process.env.DB_DIALECT,

  APP_PORT: process.env.APP_PORT,
  APP_HOST: process.env.APP_HOST,
  NODE_ENV: process.env.NODE_ENV || 'development',

  SECRET: process.env.SECRET,
  JWT_EXPIRES_IN: process.env.JWT_TOKEN_EXPIRATION_TIME,
}