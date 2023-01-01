const adminRoute = require('./admin');
const productRoute = require('./product');
const providerRoute = require('./provider');
const { dashboardView } = require('../controller/admin/admin.controller');

const router = (app) => {
  app.use(adminRoute);
  app.get('/dashboard', dashboardView);
  app.use(productRoute);
  app.use(providerRoute);
}
module.exports = {
  router,
};