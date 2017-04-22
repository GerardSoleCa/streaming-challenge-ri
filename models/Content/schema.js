let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;
let injector = require('route-injector').MongooseInjector;
let jsonform = require('route-injector').MongooseJsonform;


let schema = new Schema({
    name: {type: String, required: true},
    encryptionKey: {type: String, required: true},
    protectionSystem: {type: ObjectId, ref: 'ProtectionSystem', required: true},
    payload: {type: String, required: true}
}, {id: false});

schema.plugin(jsonform, {
    excludedPaths: ['_id', '__v']
});

schema.plugin(injector, require('./injector'));


exports.getSchema = function () {
    return schema;
};