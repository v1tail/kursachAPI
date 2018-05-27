const express = require('express');

const router = express.Router();

router.post(
    '/',
    require('../middlewares/checkLogin'),
);
module.exports = router;
