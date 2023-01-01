const express = require('express');

const router = express.Router();

router.post('/login', loginValidator, login);