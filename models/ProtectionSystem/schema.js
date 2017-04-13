var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var injector = require('route-injector').MongooseInjector;
var jsonform = require('route-injector').MongooseJsonform;


var schema = new Schema({
    description: {type: String, required: true},
    cipher: {type: String, required: true}
}, {id: false});

schema.plugin(jsonform, {
    excludedPaths: ['_id', '__v']
});

schema.plugin(injector, require('./injector'));


exports.getSchema = function () {
    return schema;
};