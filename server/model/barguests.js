'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var getConditionStartOfToday = function() {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return {$gte: startOfToday};
}

var BarGuest = new Schema({
    ip: {type: String, default: null},
    user_id: {type: String, default: null},
    place_id: {type: String, default: null},
    created: {
        type: Date, 
        default: Date.now
    }
});

BarGuest.statics.createGuest = function(data, callback) {
    var doc = new this({
        place_id: data.id,
        user_id: data.user_id
    });
    
    this.findOne({
        user_id: "" + data.user_id,
        place_id: data.id,
        created: getConditionStartOfToday()
    }).exec(function(err, data) {
        if (err) {
            return callback(err);
        }
        if (!data || !data._id) {
            return doc.save(callback);
        }
        callback(null, doc);
    });
};

BarGuest.statics.removeGuest = function(data, callback) {
    this.remove({
        place_id: data.id,
        user_id: "" + data.user_id,
        created: getConditionStartOfToday()
    }, callback);
};
BarGuest.statics.toggleGuest = function(data, callback) {
    if (data.go) {
        return this.createGuest(data, callback);
    }
    return this.removeGuest(data, callback);
}; 
BarGuest.statics.getByUserGoing = function(userId, placesIds, callback) {
    this.aggregate([
        {
            $match: { 
                place_id: { 
                    $in: placesIds
                },
                created: getConditionStartOfToday(),
                user_id: "" + userId
            }
        },
        {
            $group: {
                _id: '$place_id',
                count: {$sum: 1}
            }
        }
    ], function (err, result) {
        if (err) {
            return callback(err);
        }
        var data = {};
        for (var key in result) {
            data[result[key]._id] = result[key].count;
        }
        callback(null, data);
    });
};
BarGuest.statics.getByPlaceGoing = function(placesIds, callback) {
    this.aggregate([
        {
            $match: { 
                place_id: { 
                    $in: placesIds
                },
                created: getConditionStartOfToday()
            }
        },
        {
            $group: {
                _id: '$place_id',
                count: {$sum: 1}
            }
        }
    ], function (err, result) {
        if (err) {
            return callback(err);
        }
        var data = {};
        for (var key in result) {
            data[result[key]._id] = result[key].count;
        }
        callback(null, data);
    });
}
BarGuest.statics.getTotalsGoing = function(userId, placesIds, callback) {
    var self = this;
    this.getByPlaceGoing(placesIds, function(err, totalGoing) {
        if (err) {
            return callback(err);
        }
        if(typeof userId === 'undefined' || userId === null) {
            return callback(null, {totalGoing: totalGoing, userGoing: {}});
        }
        self.getByUserGoing(userId, placesIds, function(userErr, userGoing) {
            if (userErr) {
                return callback(err);
            }
            return callback(null, {totalGoing: totalGoing, userGoing: userGoing})
        });
    })
}
module.exports = mongoose.model('BarGuest', BarGuest);