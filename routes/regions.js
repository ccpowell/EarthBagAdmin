/*
operations on regions.
 */

var repository = require('../modules/repository');

/**
 * get data and return it, or return an error
 * @param promise
 */
function getData(request, response, promise) {
    promise()
        .then(function (data) {
            response.send(200, data);
        })
        .fail(function (bummer) {
            response.send(400, bummer.toString());
        });
}

exports.getRegions = function(request, response) {
    return getData(request, response, repository.getRegions);
};