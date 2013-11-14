/**
 * Created by chris_000 on 11/11/13.
 * Mongo-based repository
 */
var mongoose = require('mongoose'),
    Q = require('q'),
    _ = require('lodash'),
    gmjr = require('./gmjrSchema');

mongoose.connect('mongodb://localhost/gmjr');
mongoose.connection.on('error', function (err) {
    console.log(err);
});

function makeError(message) {
    return Q.fcall(function () {
        throw message;
    })
}

function getRegions() {
    return Q.ninvoke(gmjr.Region, 'find');
}

function createRegion(data) {
    var region = new gmjr.Region(data);
    return Q.ninvoke(region, 'save')
        .then(function () {
            return Q(region.toJSON());
        });
}

function deleteRegion(id) {
    return Q.ninvoke(gmjr.Region, 'remove', {_id: id});
}

function updateRegion(data) {
    var id = data._id,
        deferred = Q.defer();
    delete data._id;
    gmjr.Region.findByIdAndUpdate(id, data, {}, function(err, region) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(region);
        }
    });
    return deferred.promise;
}

exports.getRegions = getRegions;
exports.createRegion = createRegion;
exports.deleteRegion = deleteRegion;
exports.updateRegion = updateRegion;