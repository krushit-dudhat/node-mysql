const express = require('express');
const multer = require('multer');
const { fetchProducts, fetchProductById, productView, addProduct, updateProduct, addProductView, deleteProduct, fetchExcel } = require('../controller/product/product.controller');
const { authorization } = require('../middleware/auth');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = `public/uploads`;
    fs.mkdirSync(path, { recursive: true });
    cb(null, `public/uploads`);
  },
  filename(req, file, cb) {
    let uuid = uuidv4();
    if (!req.params.id) {
      req.uuid = uuid;  
    }
    cb(null, `${req.params.id || uuid}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.includes("image")) {
      cb(null, true);
    } else {
      return cb(new Error("Only images are allowed"));
    }
  },
  limits: function (req, file, cb) {
    cb(null, { fileSize: 2000000 }); // file size limit for 2 mb
  }
});

router.get('/products', authorization, fetchProducts);
router.get('/product/:id/edit', authorization, productView);
router.get('/products/excel', authorization, fetchExcel);
router.get('/product/add', authorization, addProductView);
router.get('/product/:id', authorization, fetchProductById);
router.post('/product', authorization, upload.single('productImage'), addProduct);
router.put('/product/:id', authorization, upload.single('productImage'), updateProduct);
router.delete('/product/:id', authorization, deleteProduct);

module.exports = router;