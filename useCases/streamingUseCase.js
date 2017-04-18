let Q = require('q');
let injector = require('route-injector');
let mongoose = require('mongoose');
let ObjectId = mongoose.Types.ObjectId;
let CryptoBox = require('../utils/cryptoBox');

mongoose.Promise = Q.Promise;

function StreamingUseCase(deviceId, contentId) {
    this.deviceId = deviceId;
    this.contentId = contentId;
    this.deferred = undefined;

    this.getPayload = () => {
        this.deferred = Q.defer();
        this.resolveDataFromDB();
        return this.deferred.promise;
    };

    this.resolveDataFromDB = () => {
        Q.all(this.getQueryPromises())
            .then(this.checkQueryResult)
            .then(this.checkProtectionSystemValidity)
            .then(this.decryptContentPayload)
            .fail(this.catchError)
    };

    this.getQueryPromises = () => {
        if (this.checkValidIds()) {
            let devicePromise = injector.models.Device.findOne({_id: ObjectId(this.deviceId)}).exec();
            let contentPromise = injector.models.Content.findOne({_id: ObjectId(this.contentId)}).populate('protectionSystem').exec();
            return [devicePromise, contentPromise];
        } else {
            this.deferred.reject('ObjectId is not valid');
        }
    };

    this.checkQueryResult = (docs) => {
        if (docs[0] && docs[1]) {
            return docs;
        } else {
            throw new Error('Document not found');
        }
    };


    this.checkProtectionSystemValidity = (docs) => {
        console.log("checkProtection", docs);
        let device = docs[0];
        let content = docs[1];
        if (device.protectionSystem.toString() !== content.protectionSystem._id.toString()) {
            throw new Error('Protection System does not match');
        } else {
            return content;
        }
    };

    this.decryptContentPayload = (content) => {
        let key = content.encryptionKey;
        let payload = content.payload;
        let algorithm = content.protectionSystem.algorithm;
        this.deferred.resolve(new CryptoBox(algorithm, key).decrypt(payload));
    };

    this.checkValidIds = () => {
        return !!(ObjectId.isValid(this.deviceId) && ObjectId.isValid(this.contentId));
    };

    this.catchError = (error) => {
        this.deferred.reject(error);
    };


}

module.exports = StreamingUseCase;