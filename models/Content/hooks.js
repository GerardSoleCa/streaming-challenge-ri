let CryptoBox = require('../../utils/cryptoBox');
let injector = require('route-injector');

module.exports.encrypt = function (Model, req, res, next) {
    injector.models.ProtectionSystem.findById(req.body.protectionSystem, {algorithm: 1}, (err, doc) => {
        let cipher = new CryptoBox(doc.algorithm, req.body.encryptionKey);
        let payload = req.body.payload;
        req.body.payload = cipher.encrypt(payload);
        next(Model, req, res);
    })
};