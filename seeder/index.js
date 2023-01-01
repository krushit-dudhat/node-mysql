const {seedAdminTable} = require('./admin');
const {seedProviderTable} = require('./provider');
const {seedProductTable} = require('./product');

exports.seedTable = async () => {
  try {
    await seedAdminTable();
    const providerId = await seedProviderTable();
    await seedProductTable(providerId);
  } catch (error) {
    console.log('Error seeding table', error);
  }
}