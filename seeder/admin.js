const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const db = require('../connection/db.conn');
const { encryptPassword } = require('../helpers');

exports.seedAdminTable = async () => {
  try {
    let values = '';
    for (let i = 0; i < 20; i++) {
      const admin = {
        id: uuidv4(),
        username: faker.internet.userName(),
        password: encryptPassword('password'),
        created_at: new Date().toISOString().substring(0, 19).replace('T', ' '),
        updated_at: new Date().toISOString().substring(0, 19).replace('T', ' '),
      };
      values += `("${admin.id}", "${admin.username}", "${admin.password}", "${admin.created_at}", "${admin.updated_at}"),`;
    }
    const query = `INSERT INTO admin (id, username, password, created_at, updated_at) VALUES ${values.slice(0, -1)}`;
    await db.queryExec(query);
  } catch (error) {
    console.log('Error seeding admin table', error);
  }
}

