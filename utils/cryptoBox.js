let crypto = require('crypto');

class CryptoBox {

    constructor(algorithm, key) {
        this.algorithm = algorithm;
        this.key = key;
    }

    encrypt(text) {
        let cipher = crypto.createCipher(this.algorithm, this.key);
        let crypted = cipher.update(text, 'utf8', 'base64');
        crypted += cipher.final('base64');
        return crypted;
    }

    decrypt(text) {
        let decipher = crypto.createDecipher(this.algorithm, this.key);
        let dec = decipher.update(text, 'base64', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    }
}

module.exports = CryptoBox;