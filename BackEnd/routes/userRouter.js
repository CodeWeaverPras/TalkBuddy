const router = require('express').Router()
const { registerUser, authUser, allUsers } = require('../controllers/userController');
const { authenticateUser } = require("../middlewares/authMiddleware");

router.post('/register' ,registerUser )
router.post('/login' ,authUser )
router.get('/user', authenticateUser, allUsers);


module.exports  = router;