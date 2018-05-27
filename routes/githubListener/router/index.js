const express = require('express');

const router = express.Router();

router.post(
    '/',
    require('../middlewares/handleGithubNotificationCallback'),
);


router.post('/set/:uId',)
module.exports = router;
