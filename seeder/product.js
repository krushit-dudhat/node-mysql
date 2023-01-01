const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const db = require('../connection/db.conn');

exports.seedProductTable = async (providerId) => {
  try {
    let values = '';
    for (let i = 0; i < 60; i++) {
      const product = {
        id: uuidv4(),
        providerId: providerId[Math.floor(Math.random() * providerId.length)],
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        description: faker.commerce.productDescription(),
        image: faker.image.imageUrl(640, 480),
        created_at: new Date().toISOString().substring(0, 19).replace('T', ' '),
        updated_at: new Date().toISOString().substring(0, 19).replace('T', ' '),
      };
      values += `("${product.id}", "${product.providerId}", "${product.name}", "${product.price}", "${product.description}", "${product.image}", "${product.created_at}", "${product.updated_at}"),`;
    }
    const query = `INSERT INTO provider_product (id, provider_id, name, price, description, image, created_at, updated_at) VALUES ${values.slice(0, -1)}`;
    await db.queryExec(query);
  } catch (error) {
    console.log('Error seeding product table', error);
  }
}

