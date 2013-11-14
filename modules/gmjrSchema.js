/**
 * Created by chris_000 on 11/13/13.
 */
var mongoose = require('mongoose');

//Schemas
var RegionSchema = new mongoose.Schema({
    baseName: String,
    version: String,
    minSize: { type: Number, default: 1 },
    maxDifficulty: { type: Number, default: 1 },
    maxTerrain: { type: Number, default: 1 },
    order: {type: String, default: 'closest'},
    micro: {type: Number, default: 2},
    daysSincePlaced: {type: Number, default: 0},
    daysSinceFound: {type: Number, default: 1825},
    description: String,
    areas: [
        {
            minLatitude: Number,
            maxLatitude: Number,
            minLongitude: Number,
            maxLongitude: Number
        }
    ]
});

var Region = mongoose.model('Region', RegionSchema);

var RegionFileSchema = new mongoose.Schema({
    region: mongoose.Schema.Types.ObjectId,
    publishDate: { type: Date, default: Date.now },
    binPath: String,
    cryPath: String
});

var RegionFile = mongoose.model('RegionFile', RegionFileSchema);

exports.Region = Region;
exports.RegionSchema = RegionSchema;
exports.RegionFile = RegionFile;
exports.RegionFileSchema = RegionFileSchema;