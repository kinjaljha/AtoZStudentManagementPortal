const config = require("../config.json");
const mongoose = require("mongoose");

function dbInit() {
    mongoose.connect(process.env.MONGODB_URI || config.db_url, {
        useCreateIndex: true,
        useNewUrlParser: true
    });
    mongoose.Promise = global.Promise;
}

module.exports = dbInit;
