const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ClassSchema = new Schema({
    Class: { type: String, required: true },
    CreatedAt: { type: Date, default: Date.now },
    UpdatedAt: { type: Date, default: Date.now },
    DeletedAt: { type: Date, default: null }
});

module.exports = mongoose.model("Class", ClassSchema);
