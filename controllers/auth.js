const User = require('../models/user');

var jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
	const user = new User(req.body);

	// console.log(user)
	user.save((error, user) => {
		if (error) {
			console.log(error);
			return res.status(400).json({
				error: 'Email alderady exist, please signin',
			});
		}

		var token = jwt.sign({ _id: user._id }, process.env.SECRET);
		res.cookie('token', token, { expire: new Date() + 9999 });

		res.json({
			token: token,
			email: user.email,
			id: user._id,
			role: user.role,
		});
	});
};

exports.signin = (req, res) => {
	// const errors = validationResult(req);
	const { email, password } = req.body;

	// if (!errors.isEmpty()) {
	// 	return res.status(422).json({
	// 		error: errors.array()[0].msg,
	// 	});
	// }

	User.findOne({ email }, (err, user) => {
		//if our user is not in the database
		if (err || !user) {
			return res.status(400).json({
				error: "User email doesn't exist",
			});
		}

		//if the user enters correct password
		if (!user.autheticate(password)) {
			return res.status(401).json({
				error: 'email and password do not match',
			});
		}

		//if all things are Ok now we have to make a token and put it into the cookie
		var token = jwt.sign({ _id: user._id }, process.env.SECRET);

		res.cookie('token', token, { expire: new Date() + 1 });

		//send response to the frontend
		const { _id, name, email, role, lastname } = user;
		return res.json({ token, user: { _id, name, lastname, email, role } });
	});
};

exports.signout = (req, res) => {
	res.clearCookie('token');
	res.json({
		message: 'User Signout Succesfully',
	});
};

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
	console.log(req.headers);
	const { authorization } = req.headers;
	console.log(authorization);

	if (!authorization) {
		return res.status(401).send({ error: 'you cant logged in' });
	}

	const token = authorization.replace('Bearer ', '');

	jwt.verify(token, process.env.SECRET, async (error, payload) => {
		if (error) {
			return res.status(401).send({ error: 'you cant logged in' });
		}
		const { userId } = payload;

		const user = await User.findById(userId);
		req.user = user;
		next();
	});
};

exports.isAdmin = (req, res, next) => {
	// console.log('manish');
	// console.log('req', req);
	if (req.profile.role === 0) {
		return res.status(403).json({
			error: 'you are not an admin, Access Denied',
		});
	}

	next();
};

exports.getUserByEmail = (req, res, next) => {
	User.find({ email: req.body })
		.then((response) => {
			console.log(response);
			res.send(response);
		})
		.catch((err) => {
			console.log(err);
			res.send(err);
		});
};
