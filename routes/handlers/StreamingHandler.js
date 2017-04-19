let StreamingUseCase = require('../../useCases/streamingUseCase');

function StreamingHandler() {
    this.res = undefined;

    this.handler = (req, res) => {
        this.res = res;
        let deviceId = req.params.deviceId;
        let contentId = req.params.contentId;

        new StreamingUseCase(deviceId, contentId)
            .getPayload()
            .then(this.onSuccess)
            .catch(this.onError);
    };

    this.onSuccess = (payload) => {
        this.send(200, {
            payload: payload
        });
    };

    this.onError = (error) => {
        this.send(400, {
            error: error.toString()
        });
    };

    this.send = (status, msg) => {
        this.res.statusCode = status;
        this.res.json(msg);
        this.res.end();
    }
}
module.exports = StreamingHandler;