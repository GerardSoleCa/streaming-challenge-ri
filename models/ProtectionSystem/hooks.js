let injector = require('route-injector');
let crypto = require('crypto');
let ciphers = crypto.getCiphers();

module.exports.cleanPutRequest = function (Model, req, res, next) {
    delete req.body.algorithm;
    next();
};

module.exports.validate = function (Model, req, res, next) {
    let errors = getValidationErrors(req.body);
    if (errors) {
        res.statusCode = 403;
        return res.json(errors).end();
    }
    next();
};

module.exports.validateAlgorithm = function (Model, req, res, next) {

    if (ciphers.indexOf(req.body.algorithm) === -1){
        res.statusCode = 400;
        return res.json({
            errors: 'algorithm is not valid'
        }).end();
    }else{
        next();
    }
};

function getValidationErrors(body) {
    let content = new injector.models.ProtectionSystem(body);
    return content.validateSync();
}