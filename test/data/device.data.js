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

    static getSecondDeviceData(protectionSystemId) {
        return {
            name: 'LG 4K',
            protectionSystem: protectionSystemId
        }
    }
}
module.exports = DeviceData;