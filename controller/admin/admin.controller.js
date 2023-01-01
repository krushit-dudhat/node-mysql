const db = require('../../connection/db.conn');
const { errorResponse, successResponse, comparePassword, generateJWTtoken } = require('../../helpers/index');

const login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    console.log('usbody', username, password);
    const data = await db.queryExec(`SELECT * FROM admin WHERE username = '${username}';`);
    // console.log('data', data);
    const user = data.results[0];
    console.log('user', user);
    if (!user) {
      return errorResponse(req, res, 'User not found', 404);
    }
    const isMatch = comparePassword(password, user.password);
    if (!isMatch) {
      return errorResponse(req, res, 'Invalid credential', 401);
    }

    const trimedUser = {
      id: user.id,
      username: user.username,
    }
    const token = generateJWTtoken({ id: user.id });
    db.queryExec(`UPDATE admin SET token = "${token}" WHERE id = "${user.id}"`);

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
    });
    // return successResponse(req, res, { user: trimedUser }, 200);
    return res.redirect('/dashboard');
  } catch (error) {
    return next(error);
  }
}

const logout = async (req, res, next) => {
  try {
    console.log(req.user);
    res.clearCookie('token');
    db.queryExec(`UPDATE admin SET token = "" WHERE id = "${req.user.id}"`);
    return res.redirect('/login');
  } catch (error) {
    return next(error);
  }
}

const dashboardView = async (req, res, next) => {
  try {
    // const perPage = req.query.perPage || 10;
    // const page = req.query.page || 1;
    // let data = await db.queryExec(`SELECT * FROM provider_product LIMIT ${(page - 1) * perPage}, ${perPage}`);
    // const products = data.results;
    return res.render('dashboard');
  } catch (error) {
    return next(error);
  }
}

const loginView = async (req, res, next) => {
  try {
    return res.render('login');
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
  loginView,
  dashboardView,
  logout,
};