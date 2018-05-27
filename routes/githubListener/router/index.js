const express = require('express');

const router = express.Router();

router.post(
    '/',
    require('../middlewares/handleGithubNotificationCallback'),
);
module.exports = router;
