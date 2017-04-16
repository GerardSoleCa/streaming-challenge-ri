let StreamingHandler = require('./handlers/StreamingHandler');

module.exports.route = function (app) {
    app.get('/streaming/device/:deviceId/content/:contentId', new StreamingHandler().handler);
};

