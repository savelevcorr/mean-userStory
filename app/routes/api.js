var User = require('../models/user');
var config = require('../../config');

var secretKey = config.secretKey;

module.exports = function (app, express) {
	var api = express.Router();

	api.post('/singup', function (req, res) {
		var user = new User({
			name: req.body.name,
			username: req.body.username,
			password: req.body.password
		});

		user.save(function (err) {
			if (err) {
				res.send(err);
			}

			res.json({ message: "User has been created" });
		});
	});

	return api;
};