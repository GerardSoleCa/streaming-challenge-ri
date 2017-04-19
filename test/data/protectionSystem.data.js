class ProtectionSystemData {
    static getEmpty() {
        return {};
    }

    static getMockData() {
        return {
            description: 'AES-CBC',
            algorithm: 'aes-256-cbc'
        }
    }
}
module.exports = ProtectionSystemData;