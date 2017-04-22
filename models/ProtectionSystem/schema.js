let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let injector = require('route-injector').MongooseInjector;
let jsonform = require('route-injector').MongooseJsonform;


let schema = new Schema({
    description: {type: String, required: true},
    algorithm: {type: String, required: true}
}, {id: false});

schema.plugin(jsonform, {
    excludedPaths: ['_id', '__v']
});

schema.plugin(injector, require('./injector'));


exports.getSchema = function () {
    return schema;
};