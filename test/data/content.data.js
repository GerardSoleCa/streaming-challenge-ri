class ContentData {

    static getEmpty() {
        return {};
    }

    static getContentData(protectionSystemId) {
        return {
            name: 'The brown fox',
            encryptionKey: 'this is a large password',
            protectionSystem: protectionSystemId,
            payload: 'the brown fox jumps over the lazy dog'
        }
    }

    static getDecryptedPayload() {
        return ContentData.getContentData().payload;
    }

}
module.exports = ContentData;