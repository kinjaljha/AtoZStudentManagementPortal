const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let RegisterSchema = new Schema({
    FirstName: { type: String, required: true, max: 100 },
    LastName: { type: String, required: true, max: 100 },
    MiddleName: { type: String, required: true, max: 100 },
    Address: { type: String, required: true, max: 300 },
    City: { type: String, required: true, max: 50 },
    Email: {
        type: String,
        unique: true,
        required: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address"
        ]
    },
    Mobile: {
        type: String,
        required: true
    },
    Password: { type: String, required: true },
    ClassId: { type: mongoose.Schema.Types.ObjectId, required: true },
    ProfilePic: { type: String, required: true },
    CreatedAt: { type: Date, default: Date.now },
    UpdatedAt: { type: Date, default: Date.now },
    DeletedAt: { type: Date, default: null }
});

module.exports = mongoose.model("Register", RegisterSchema);
