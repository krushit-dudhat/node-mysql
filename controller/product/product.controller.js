const db = require('../../connection/db.conn');
const { v4: uuidv4 } = require('uuid');
const xl = require('exceljs');
const { errorResponse , successResponse} = require('../../helpers/index');
const { writeExcel } = require('../../helpers/excel');
const path = require('path');

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


const fetchExcel = async (req, res, next) => {
  try {
    const data = await db.queryExec(`SELECT p.*, u.name as provider FROM provider_product p INNER JOIN provider u ON p.provider_id = u.id`);
    const workbook = new xl.Workbook();
    const sheet = workbook.addWorksheet('product sheet');
    writeExcel(data.results, sheet);

    // const stream = await xl(products, path.join(__dirname,'/products_123.xlsx'));
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=products.xlsx');
    // workbook.xlsx.writeFile('my-excel-file.xlsx').then(function () {
    //   console.log('File saved.');
    // });
    workbook.xlsx.write(res).then(function () {
      res.end();
    });
  } catch (error) {
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
      return errorResponse(req, res, "Provider not found", 400);
    }

    if (!req.file) {
      return errorResponse(req, res, "Image not found", 400);
    }
    const productNameValidation = await db.queryExec(`SELECT * FROM provider_product WHERE name = "${name}" AND provider_id = "${provider}"`);
    if (productNameValidation.results.length > 0) {
      return errorResponse(req, res, "Product name already exists", 400);
    }
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
        return errorResponse(req, res, "Provider not found", 400);
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

    if (req.body.name && req.body.provider) {
      const productNameValidation = await db.queryExec(`SELECT * FROM provider_product WHERE name = "${req.body.name}" AND provider_id = "${req.body.provider}"`);
      if (productNameValidation.results.length > 0 && productNameValidation.results[0].id !== id) {
        return errorResponse(req, res, "Product name already exists", 400);
      }
    }
    const data = await db.queryExec(`UPDATE provider_product SET ${fielsToUpdate} WHERE id = "${id}"`);
    console.log(data);
    return successResponse(req, res, {}, "Product updated!", 200);
  } catch (error) {
    console.log(error);
    return next(error);
  }
}

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.queryExec(`DELETE FROM provider_product WHERE id = "${id}"`);
    return successResponse(req, res, {}, "Product deleted!", 200);
  } catch (error) {
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
  deleteProduct,
  fetchExcel,
};