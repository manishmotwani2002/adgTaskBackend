require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

//My Routes
const authRoutes = require('./routes/auth');

mongoose
	.connect(process.env.DATABASE, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(function () {
		console.log('DB CONNECTED');
	});

const port = process.env.PORT || 8000;

//Here app.use is a middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My routes
app.use(authRoutes);

// app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
	res.send('home route');
});

//starting the server
app.listen(port, () => {
	console.log(`app is running at ${port}`);
});
