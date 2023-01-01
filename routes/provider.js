const express = require('express');
const router = express.Router();
const { getProviderList } = require('../controller/provider/provider.controller');
const { authorization } = require('../middleware/auth');

router.get('/providers', authorization, getProviderList);

module.exports = router;