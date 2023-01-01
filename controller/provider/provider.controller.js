const db = require('../../connection/db.conn');
const { errorResponse, successResponse } = require('../../helpers/index');

const getProviderList = async (req, res, next) => {
  try {
    const data = await db.queryExec(`SELECT id, name FROM provider`);
    const providers = data.results;
    return successResponse(req, res, { providers }, 200);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getProviderList,
};