let Q = require('q');
let injector = require('route-injector');
let mongoose = require('mongoose');
let ObjectId = mongoose.Types.ObjectId;

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
        // if (!this.validIds()) {
        //     this.deferred.reject();
        //     return;
        // }


        Q.all(this.getQueryPromises())
            .then(this.checkQueryResult)
            .then(this.checkProtectionSystemValidity)
            .then(this.decryptContentPayload)
            .fail(this.catchError)

    };

    this.getQueryPromises = () => {
        if (this.checkValidIds()) {
            let devicePromise = injector.models.Device.findOne({_id: ObjectId(this.deviceId)}).exec();
            let contentPromise = injector.models.Content.findOne({_id: ObjectId(this.contentId)}).exec();
            return [devicePromise, contentPromise];
        } else {
            this.deferred.reject('ObjectId is not valid');
        }
    }

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
        if (device.protectionSystem.toString() !== content.protectionSystem.toString()) {
            throw new Error('Protection System does not match');
        } else {
            return content;
        }
    };

    this.decryptContentPayload = (content) => {
        let key = content.encryptionKey;
        let payload = content.payload;
        this.deferred.resolve(key + payload);
    }

    this.checkValidIds = () => {
        return !!(ObjectId.isValid(this.deviceId) && ObjectId.isValid(this.contentId));
    };

    this.catchError = (error) => {
        this.deferred.reject(error);
    }


}

module.exports = StreamingUseCase;