const db = require('../../connection/db.conn');
const { v4: uuidv4 } = require('uuid');
const { errorResponse , successResponse} = require('../../helpers/index');

const fetchProducts = async (req, res, next) => {
  try {
    const perPage = req.query.perPage || 10;
    const page = req.query.page || 1;

    const data = await db.queryExec(`SELECT p.*, u.name as provider FROM provider_product p INNER JOIN provider u ON p.provider_id = u.id LIMIT ${(page - 1) * perPage}, ${perPage}`);
    const products = data.results;
    return successResponse(req, res, { products }, "product data fetched!",200);
  } catch (error) {
    console.log(error);
    return next(error);
  }
}

const fetchProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await db.queryExec(`SELECT p.*, u.name as provider FROM provider_product p INNER JOIN provider u ON p.provider_id = u.id WHERE p.id = "${id}"`);
    const product = data.results[0];
    console.log(product);
    return successResponse(req, res, { product }, "product data fetched!",200);
  } catch (error) {
    return next(error);
  }
}

const addProduct = async (req, res, next) => {
  try {
    const { name, price, provider, description } = req.body;

    let data = await db.queryExec(`SELECT * FROM provider WHERE id = "${req.body.provider}"`);
    console.log(data);
    if(!data.results[0]) {
      return errorResponse(req, res, "Provider not found", 404);
    }
    console.log(req.file);
    data = await db.queryExec(`INSERT INTO provider_product
    (id, provider_id, name, price, description, image, created_at, updated_at)
    VALUES 
    ("${req.uuid || uuidv4()}", "${provider}", "${name}", "${price}", "${description}", "${req.file.path || null}", "${new Date().toISOString().substring(0, 19).replace('T', ' ')
      }", "${new Date().toISOString().substring(0, 19).replace('T', ' ') }")`);
    console.log(data);
    return successResponse(req, res, {}, "Product added!", 201);
  } catch (error) {
    console.log(error);
    return next(error);
  }
}

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.body.provider) {
      let data = await db.queryExec(`SELECT * FROM provider WHERE id = "${req.body.provider}"`);
      if (!data.results[0]) {
        return errorResponse(req, res, "Provider not found", 404);
      }
    }
    let fielsToUpdate = Object.keys(req.body).map((key) => {
      if (key === 'provider') {
        return `provider_id = "${req.body[key]}"`;
      }
      return `${key} = "${req.body[key]}"`
    }).join(', ');
    if (req.file) {
      console.log(req.file);
      fielsToUpdate += `, image = "${req.file.path}"`;
    }

    console.log(id);
    console.log(fielsToUpdate);
    const data = await db.queryExec(`UPDATE provider_product SET ${fielsToUpdate} WHERE id = "${id}"`);
    console.log(data);
    return successResponse(req, res, {}, "Product updated!", 200);
  } catch (error) {
    console.log(error);
    return next(error);
  }
}

const productView = async (req, res, next) => {
  try {
    return res.render('updateProduct', {
      product_id: req.params.id
    });
  } catch (error) {
    return next(error);
  }
}

const addProductView = async (req, res, next) => {
  try {
    return res.render('createProduct');
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  fetchProducts,
  fetchProductById,
  productView,
  addProduct,
  updateProduct,
  addProductView,
};