const mysql = require('mysql2');
const { envConst } = require('../helpers/constant');
const { models } = require('../model');
const { seedTable } = require('../seeder/index.js');

const connection = mysql.createConnection({
  host: envConst.DB_HOST,
  user: envConst.DB_USER,
  password: envConst.DB_PASSWORD,
  database: envConst.DB_NAME
});

exports.connect = async () => {
  try {
    connection.connect();
    console.log('Connected to DATABASE');

  } catch (error) {
    console.log('Error connecting to MySQL', error);
  }
}

exports.createTable = async () => {
  try {
    for (const table in models) {
      connection.query(models[table], (err, result) => {
        if (err) throw err;
        console.log(`Table ${table} created: ${result}`);
      });
    }
  } catch (error) {
    console.log('Error creating table', error);
  }
}
exports.seedTable = seedTable;

exports.dropTable = async () => {
  try {
    let keys = Object.keys(models).reverse();
    for (let i = 0; i < keys.length; i++) {
      connection.query(`DROP TABLE IF EXISTS ${keys[i]}`, (err, result) => {
        if (err) throw err;
        console.log(`Table ${keys[i]} dropped: ${result}`);
      });
    }
  } catch (error) {
    console.log('Error dropping table', error);
  }
}

exports.queryExec = async (query) => {
  try {
    return new Promise((resolve, reject) => {
      connection.query(query, (err, results, fields) => {
        if (err) reject(err);
        resolve({ results, fields });
      })
    });
  } catch (error) {
    console.log(`Error executing query : ${query} \n`, error);
  }
}
