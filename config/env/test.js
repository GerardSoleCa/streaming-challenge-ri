module.exports = {
    database: {
        endpoint: "localhost:27017",
        name: "streaming-challenge",
        debug: false
    },
    bind: {
        port: 40000
    },
    logger: {
        level: "fatal"
    },
    files: {
        path: __dirname + "/../../file",
        cache: __dirname + "/../../file/.cache"
    },
    images: {
        gallery: {
            endpoint: "/gallery",
            filepath: __dirname + "/../../images",
            listDirectory: ["MODERATOR", "admin"],
            postImage: ["OPERATOR", "MODERATOR", "admin"],
            deleteImage: ["MODERATOR", "admin"]
        },
        path: __dirname + "/../../images",
        cache: __dirname + "/../../images/.cache"
    },
    auth: false
};
