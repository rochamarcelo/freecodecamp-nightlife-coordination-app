'use strict';

var express = require('express');
var routes = require('./server/routes/main.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();

require('dotenv').load();
app.enable('trust proxy');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./server/config/passport')(passport);

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

app.use(session({
	secret: '59szQXdXSCq7iMMNj5xjdM9HDx4g9BbsEdx4drD6tUgC7KT1MfuxASJ75Kn7bfiX',
	resave: false,
	saveUninitialized: true
}));

app.use('/static', express.static(__dirname + '/client/build/static'));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

app.listen(process.env.PORT || 8080, function () {
  console.log('nightlife app listening on port ' + process.env.PORT || 8080 + '!')
})