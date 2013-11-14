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

function doVoid(request, response, promise) {
    promise()
        .then(function () {
            response.send(200);
        })
        .fail(function (bummer) {
            response.send(400, bummer.toString());
        });
}

exports.getRegions = function(request, response) {
    return getData(request, response, repository.getRegions);
};

exports.createRegion = function(request, response) {
    var region = request.body;

    repository.createRegion(region)
        .then(function(data) {
            response.send(200, data);
        })
        .fail(function (bummer) {
            response.send(400, bummer.toString());
        });

    //doVoid(repository.createRegion(region));
};

exports.updateRegion = function(request, response) {
    var region = request.body;

    repository.updateRegion(region)
        .then(function() {
            response.send(200, {});
        })
        .fail(function (bummer) {
            response.send(400, bummer.toString());
        });

    //doVoid(repository.updateRegion(region));
};

exports.deleteRegion = function(request, response) {
    var id = request.params.id;
    //doVoid(repository.deleteRegion(id));

    repository.deleteRegion(id)
        .then(function() {
            response.send(200, {});
        })
        .fail(function (bummer) {
            response.send(400, bummer.toString());
        });

};