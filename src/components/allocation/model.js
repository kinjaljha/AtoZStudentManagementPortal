const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let AllocationSchema = new Schema({
    StaffId: { type: mongoose.Schema.Types.ObjectId, required: true },
    ClassId: { type: mongoose.Schema.Types.ObjectId, required: true },
    CreatedAt: { type: Date, default: Date.now },
    UpdatedAt: { type: Date, default: Date.now },
    DeletedAt: { type: Date, default: null }
});

module.exports = mongoose.model("Allocation", AllocationSchema);
