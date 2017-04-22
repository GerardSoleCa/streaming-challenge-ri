let CryptoBox = require('../../utils/cryptoBox');
let injector = require('route-injector');

module.exports.validate = function (Model, req, res, next) {
    let errors = getValidationErrors(req.body);
    if (errors) {
        res.statusCode = 403;
        return res.json(errors).end();
    }
    next();
};

module.exports.getStoredProtectionSystemAndKey = function (Model, req, res, next) {
    Model.findById(req.params._id, (err, doc) => {
        addInfoToReqFromExstingContent(req, doc);

        getAlgorithmFromProtectionSystem(doc.protectionSystem, res, (doc) => {
            req.oldSystem.algorithm = doc.algorithm;
            req.body.algorithm = doc.algorithm;
            if (req.oldSystem.protectionSystemChanged) {
                getAlgorithmFromProtectionSystem(req.body.protectionSystem, res, (doc) => {
                    req.body.algorithm = doc.algorithm;
                    next();
                });
            } else {
                next();
            }
        });
    });
};

module.exports.encrypt = function (Model, req, res, next) {
    switch (req.method) {
        case 'POST':
            encryptOnPost(Model, req, res, next);
            break;
        case'PUT':
            encryptOnPut(Model, req, res, next);
            break;
    }
};

function addInfoToReqFromExstingContent(req, doc) {
    req.oldSystem = {};
    req.oldSystem.encryptionKey = doc.encryptionKey;
    req.oldSystem.protectionSystem = doc.protectionSystem;
    req.oldSystem.payload = doc.payload;

    populateReqBodyIfUndefined(req, doc, 'encryptionKey');
    populateReqBodyIfUndefined(req, doc, 'payload');
    populateReqBodyIfUndefined(req, doc, 'protectionSystem');

    req.oldSystem.payloadChanged = !(req.body.payload === doc.payload);
    req.oldSystem.encryptionKeyChanged = !(req.body.encryptionKey === doc.encryptionKey);
    req.oldSystem.protectionSystemChanged = !(req.body.protectionSystem === doc.protectionSystem);
}

function encryptOnPost(Model, req, res, next) {
    getAlgorithmFromProtectionSystem(req.body.protectionSystem, res, (doc) => {
        req.body.payload = encrypt(req.body.payload, doc.algorithm, req.body.encryptionKey);
        return next();
    });
}

function encryptOnPut(Model, req, res, next) {
    if (req.oldSystem.payloadChanged) {
        req.body.payload = encrypt(req.body.payload, req.body.algorithm, req.body.encryptionKey);
        return next();
    }
    if (req.oldSystem.protectionSystemChanged || req.oldSystem.encryptionKeyChanged) {
        let decrypted = decrypt(req.oldSystem.payload, req.oldSystem.algorithm, req.oldSystem.encryptionKey);
        req.body.payload = encrypt(decrypted, req.body.algorithm, req.body.encryptionKey);
        return next();
    }
    return next();
}

function getValidationErrors(body) {
    let content = new injector.models.Content(body);
    return content.validateSync();
}

function getAlgorithmFromProtectionSystem(protectionSystemId, res, cb) {
    injector.models.ProtectionSystem.findById(protectionSystemId, {algorithm: 1}, (err, doc) => {

        if (err) {
            res.statusCode = 500;
            return res.json({
                errors: err
            }).end();
        }

        if (!doc) {
            res.statusCode = 400;
            return res.json({
                errors: 'Protection system not found'
            }).end();
        }

        cb(doc);
    });
}

function decrypt(payload, algorithm, key) {
    let cipher = new CryptoBox(algorithm, key);
    return cipher.decrypt(payload);
}
function encrypt(payload, algorithm, key) {
    let cipher = new CryptoBox(algorithm, key);
    return cipher.encrypt(payload);
}

function populateReqBodyIfUndefined(req, doc, k) {
    req.body[k] = req.body[k] || doc[k];
}