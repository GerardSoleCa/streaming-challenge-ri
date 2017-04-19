let hooks = require('./hooks');

module.exports = {
    "id": "_id",
    "displayField": "name",
    "extraDisplayFields": ["_id", "protectionSystem"],
    "enableRefs": false,
    "path": "content",
    "plural": "contents",
    "get": {},
    "post": {
        profiles: {
            _default: {
                pre: [hooks.failOnEmpty, hooks.encrypt]
            }
        }
    },
    "put": {
        profiles: {
            _default: {
                pre: [hooks.failOnEmpty, hooks.encrypt]
            }
        }
    },
    "delete": {},
    "search": {},
    "form": {}
};