var express = require('express');
var router = express.Router();

const {
	signout,
	signup,
	signin,
	isSignedIn,
	getUserByEmail,
} = require('../controllers/auth');

router.post('/signup', signup);

router.post('/signin', signin);

router.get('/signout', signout);

router.get('/findUser', getUserByEmail);

module.exports = router;
