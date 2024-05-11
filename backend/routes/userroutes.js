const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');
const {registerUser,authUser,allUsers} = require('../controllers/usercontrollers');
router.post('/',registerUser);
router.post('/login',authUser);
router.get('/',protect,allUsers)
module.exports = router