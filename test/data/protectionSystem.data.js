class ProtectionSystemData {
    static getEmpty() {
        return {};
    }

    static getProtectionSystemData() {
        return {
            description: 'AES-CBC',
            algorithm: 'aes-256-cbc'
        }
    }

    static getSecondProtectionSystemData() {
        return {
            description: '3DES-CBC',
            algorithm: 'des-ede3-cbc'
        }
    }

}
module.exports = ProtectionSystemData;