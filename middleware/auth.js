const jwt = require('jsonwebtoken');
const { envConst } = require('../helpers/constant');
const db = require('../connection/db.conn');
const {
  errorResponse,
} = require('../helpers/index');

const authorization = async (req, res, next) => {
  let token;
  token = req.headers.authorization || req.cookies.token;
  if (!token) {
    return errorResponse(req, res, 'Authorization token not found', 401);
  }
  try {
    const decoded = jwt.verify(token, envConst.SECRET);
    if (!decoded) {
      return errorResponse(req, res, 'Invalid token', 401);
    }

    let user;
    try {
      // find user data from database
      const data = await db.queryExec(`SELECT * FROM admin WHERE id = "${decoded.id}"`);
      user = data.results[0];
    } catch (error) {
      return next(error);
    }

    if (!user) {
      return errorResponse(req, res, 'User not found', 404);
    }
    if (user.token !== token) {
      return errorResponse(req, res, 'Invalid token', 401);
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  authorization,
};