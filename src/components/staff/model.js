const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let StaffSchema = new Schema({
    FirstName: { type: String, required: true, max: 100 },
    LastName: { type: String, required: true, max: 100 },
    MiddleName: { type: String, required: true, max: 100 },
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
        unique: true,
        required: true
    },
    CreatedAt: { type: Date, default: Date.now },
    UpdatedAt: { type: Date, default: Date.now },
    DeletedAt: { type: Date, default: null }
});

module.exports = mongoose.model("Staff", StaffSchema);
