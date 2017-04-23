'use strict';

const yelp = require('yelp-fusion');

const clientId = process.env.YELP_CLIENT_ID;
const clientSecret = process.env.YELP_SECRET;

module.exports = function(location, callback) {
    var searchRequest = {
      location: location,
      categories: "bars"
    };
    
    yelp.accessToken(clientId, clientSecret).then(response => {
      const client = yelp.client(response.jsonBody.access_token);
    
      client.search(searchRequest).then(response => {
        return callback(null, response.jsonBody);
      });
    }).catch(e => {
      callback(e);
    });
}