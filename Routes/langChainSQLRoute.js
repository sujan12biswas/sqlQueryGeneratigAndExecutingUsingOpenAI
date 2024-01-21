const router = require('express').Router();
const {checkingReqBody} = require('../Middlewares/checkingReqBody');
const {generatingAnswer} = require('../Controllers/generatingAnswer')

//Adding the route
router.post('/find_data',checkingReqBody,generatingAnswer);

module.exports = router;