class DeviceData {
    static getEmpty() {
        return {};
    }

    static getDeviceData(protectionSystemId) {
        return {
            name: 'iphone',
            protectionSystem: protectionSystemId
        }
    }
}
module.exports = DeviceData;