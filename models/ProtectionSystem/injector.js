let hooks = require('./hooks');

module.exports = {
    "id": "_id",
    "displayField": "description",
    "extraDisplayFields": ["algorithm", "_id"],
    "enableRefs": false,
    "path": "protectionSystem",
    "plural": "protectionSystems",
    "get": {},
    "post": {
        profiles: {
            _default: {
                pre: [hooks.validate, hooks.validateAlgorithm]
            }
        }
    },
    "put": {
        profiles: {
            _default: {
                pre: [hooks.cleanPutRequest]
            }
        }
    },
    "delete": {},
    "search": {},
    "form": {}
};