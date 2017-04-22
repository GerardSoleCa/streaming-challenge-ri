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

module.exports.encrypt = function (Model, req, res, next) {
    if (req.method === 'PUT' && !req.body.protectionSystem)
        return next();
    injector.models.ProtectionSystem.findById(req.body.protectionSystem, {algorithm: 1}, (err, doc) => {

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

        let cipher = new CryptoBox(doc.algorithm, req.body.encryptionKey);
        let payload = req.body.payload;
        req.body.payload = cipher.encrypt(payload);
        next();
    })
};

function getValidationErrors(body) {
    let content = new injector.models.Content(body);
    return content.validateSync();
}