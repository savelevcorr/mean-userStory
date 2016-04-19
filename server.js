var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');

var app = express();

mongoose.connect(config.database, function (err) {
	if (err) {
		console.log(err);
	} else {
		console.log('Connected to the database');
	}
});

app.use(bodyParser.urlencoded({ extend: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

var api = require('./app/routes/api')(app, express);
app.use('/api', api);

app.get('*', function (req, res) {
	res.sendFile(__dirname + '/public/views/index.html');
	console.log(__dirname + '/public/views/index.html');
});

app.listen(config.port, function (err) {
	if (err) {
		console.log(err);
	} else {
		console.log('Listening on port 3000');
	}
});