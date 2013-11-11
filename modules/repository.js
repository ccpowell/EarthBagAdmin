/**
 * Created by chris_000 on 11/11/13.
 * Mongo-based repository
 */
var mongo = require('mongodb'),
    Q = require('q'),
    host = 'localhost',
    _ = require('underscore'),
    port = mongo.Connection.DEFAULT_PORT;

function newClient() {
    return new mongo.MongoClient(new mongo.Server(host, port, {native_parser: true}));
}

function makeError(message) {
    return Q.fcall(function () {
        throw message;
    })
}
var level = 0;

function withCollection(name, action) {
    var mongoclient = newClient();
    console.log('open ' + ++level);
    return Q.ninvoke(mongoclient, 'open')
        .then(function (client) {
            return Q.ninvoke(client.db('gmjr'), 'open');
        })
        .then(function (db) {
            return Q.ninvoke(db, 'collection', name);
        })
        .then(action)
        .fin(function () {
            mongoclient.close();
            console.log('close ' + level--);
        });
}


function getById(collectionName, id){
    var action = function (collection) {
        return Q.ninvoke(collection, 'findOne', { _id: mongo.ObjectID(id) });
    };
    return withCollection(collectionName, action);
}

function getByAttributes(collectionName, attributes) {
    var action = function (collection) {
        return Q.ninvoke(collection, 'findOne', attributes);
    };
    return withCollection(collectionName, action);
}

function getRegions() {
    var action = function(regions) {
        var cursor = regions.find();
        return Q.ninvoke(cursor, 'toArray');
    }
    return withCollection('regions', action);
}

exports.getRegions = getRegions;