let CryptoBox = require('../../utils/cryptoBox');
let injector = require('route-injector');

module.exports.failOnEmpty = function (Model, req, res, next) {
    let errors = isValid(req.body);
    if (errors) {
        res.statusCode = 403;
        return res.json(errors).end();
    }
    next();
};

module.exports.encrypt = function (Model, req, res, next) {
    injector.models.ProtectionSystem.findById(req.body.protectionSystem, {algorithm: 1}, (err, doc) => {

        if (err) {
            res.statusCode = 500;
            return res.json({
                errors: err
            }).end();
        }

        if (!doc) {
            res.statusCode = 404;
            return res.end();
        }

        let cipher = new CryptoBox(doc.algorithm, req.body.encryptionKey);
        let payload = req.body.payload;
        req.body.payload = cipher.encrypt(payload);
        next();
    })
};

function isValid(body) {
    let content = new injector.models.Content(body);
    return content.validateSync();
}