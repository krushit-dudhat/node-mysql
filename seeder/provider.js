const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const db = require('../connection/db.conn');

exports.seedProviderTable = async () => {
  try {
    let values = '';
    const idArray = [];
    for (let i = 0; i < 20; i++) {
      const provider = {
        id: uuidv4(),
        name: faker.internet.userName(),
        email: faker.internet.email(),
        pincode: faker.address.zipCode('######'),
        address: faker.address.streetAddress(true),
        created_at: new Date().toISOString().substring(0, 19).replace('T', ' '),
        updated_at: new Date().toISOString().substring(0, 19).replace('T', ' '),
      };
      idArray.push(provider.id);
      values += `("${provider.id}", "${provider.name}", "${provider.email}", "${provider.pincode}", "${provider.address}", "${provider.created_at}", "${provider.updated_at}"),`;
    }
    const query = `INSERT INTO provider (id, name, email, pincode, address, created_at, updated_at) VALUES ${values.slice(0, -1)}`;
    await db.queryExec(query);
    return idArray;
  } catch (error) {
    console.log('Error seeding provider table', error);
  }
}

