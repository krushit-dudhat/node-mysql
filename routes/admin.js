const express = require('express');
const { loginView, login, logout } = require('../controller/admin/admin.controller');
const { authorization } = require('../middleware/auth');
const router = express.Router();

router.post('/login', login);
router.get('/login', loginView);
router.get('/logout', authorization, logout);

module.exports = router;