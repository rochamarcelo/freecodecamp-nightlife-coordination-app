'use strict';

var path = process.cwd();

var BarGuest = require(path + '/server/model/barguests.js');
var yelpSearch = require(path + "/server/api/yelp-search");


var search = function(req, callback) {
    yelpSearch(req.query.location, function(err, data) {
        if(err) {
            return callback(err);
        }
        var ids = data.businesses.map(function(item) {
           return item.id;
        });
        if (req.user) {
            console.log('search user', req.user);
        } else {
            console.log('search has no user');
        }
        var userId = req.user ? req.user._id : undefined;

        BarGuest.getTotalsGoing(userId, ids, function(err, listGoing) {
            console.log(listGoing);
            if(err || !listGoing || !listGoing.totalGoing) {
                return callback(null, data);
            }
            callback(null, {
                businesses: data.businesses.map(function(item) {
                    if (listGoing.totalGoing[item.id]) {
                        item.total_going = listGoing.totalGoing[item.id];
                    }
                    if (listGoing.userGoing[item.id]) {
                        item.going = listGoing.userGoing[item.id] > 0;
                    }
                    return item;
                })
            });
        })
        
    })
};

module.exports = function(app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.status(401).json({code: 401, message: "not authenticate"}).end();
		}
	}

	app.route('/logout')
		.get((req, res) => {
			req.logout();
			res.redirect('/');
		});
	
	app.route('/auth/twitter')
		.get(passport.authenticate('twitter'));

	app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter', {
			successRedirect: '/',
			failureRedirect: '/'
		}));
	app.route('/').get(function (req, res) {
        res.sendFile(path + '/client/build/index.html');
    })
		
	app.route('/api/search.json').get(function (req, res) {
        if (!req.query.location) {
            return res.status(404).send(JSON.stringify({
                businesses: []
            }));
        }

        search(req, function(err, data) {
            if (err || !data || !data.businesses) {
                return res.status(400).send(JSON.stringify({businesses: []}));
            }
            return res.send(JSON.stringify({
                businesses: data.businesses
            }));
        });
    });
    app.route('/api/going.json').post(isLoggedIn, function (req, res) {
        var docData = {
            id: req.body.id,
            go: req.body.go,
            user_id: req.user._id
        };
        BarGuest.toggleGuest(docData, function(err, data) {
            var errorResponse = function() {
                res.status(400).send(JSON.stringify({
                    success: false
                }));
            }
            
            if (err) return errorResponse();

            BarGuest.getByPlaceGoing([req.body.id], function(err, listGoing) {
                if (err) return errorResponse();
                res.send(JSON.stringify({
                    success: true, 
                    going: req.body.go,
                    total_going: typeof listGoing[req.body.id] !== 'undefined' ? listGoing[req.body.id] : 0
                }));
            })
        });
    });
}