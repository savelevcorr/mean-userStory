var User = require('../models/user');
var config = require('../../config');
var jsonwebtoken = require('jsonwebtoken');

var secretKey = config.secretKey;

/**
* Create unique token using by secretKey
* @return [String]
*/
function createToken(user) {
	var token = jsonwebtoken.sign({
		_id: user._id,
		name: user.name,
		username: user.username
	}, secretKey, {
		expiresInMinute: 1400
	});

	return token;
}

module.exports = function (app, express) {
	var api = express.Router();

	// invoke when route to /api/singup
	api.post('/singup', function (req, res) {
		var user = new User({
			name: req.body.name,
			username: req.body.username,
			password: req.body.password
		});

		user.save(function (err) {
			if (err) {
				res.send(err);
				return;
			}

			res.json({ message: "User has been created" });
		});
	});

	// invoke when route to /api/users
	api.get('/users', function (req, res) {
		User.find({}, function (err, users) {
			if (err) {
				res.send(err);
			}

			res.json(users);
		});
	});

	// invoke when route to api/login
	api.post('/login', function (req, res) {
		User.findOne({
			username: req.body.username
	 	}).select('password').exec(function (err, user) {
	 		if (err) {
	 			throw err;
	 		}

	 		if (!user) {
	 			res.send({
	 				message: "User doesnt exist"
	 			});
	 		} else if (user) {
	 			var validPassword = user.comparePassword(req.body.password);

	 			if (!validPassword) {
	 				res.send({
	 					message: "Invalid Password"
	 				})
	 			} else {
	 				/// token

	 				var token = createToken(user);

	 				res.json({
	 					success: true,
	 					message: "Successfuly login!",
	 					token: token
	 				});
	 			}
	 		}
	 	});
	});

    // Custon middleware (authenticate checker)
	app.use(function (req, res, next) {
		console.log("Somebody just came to your app!");

        // store token
		var token = req.body.token || 
		            req.param("token") ||
		            req.headers["x-access-token"];

		// check if token exist
		if (token) {
			jsonwebtoken.verify(token, secretKey, function (err, decoded) {
				if (err) {
					res.status(403).send({
						saccess: false,
						message: "Failed to authenticate user!"
					});
				} else {
					req.decoded = decoded;
					next();
				}
			});
		} else {
			res.status(403).send({
				success: false,
				message: "No Token Provided"
			});
		}
	});

	// if authentication is success redirect to home route
	api.get('/', function (req, res) {
		res.json("Hello World!");
	});

	return api;
};