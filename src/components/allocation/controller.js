const Allocation = require("./model");
const StaffModel = require("../staff/model");
const ClassModel = require("../class/model");

async function allocate(req, res) {
    try {
        let staffId = req.query.staffId;
        let classId = req.query.classId;

        let query = { _id: staffId };
        let staffDoc = await StaffModel.findOne(query);
        if (!staffDoc)
            return res.status(404).json({ message: "Staff Id not found" });

        query = { _id: classId };
        let classDoc = await ClassModel.findOne(query);
        if (!classDoc)
            return res.status(404).json({ message: "Class Id not found" });

        let allocation = await Allocation.create({
            StaffId: staffId,
            ClassId: classId
        });
        return res.status(201).json({
            message: "Allocation successful"
        });
    } catch (error) {
        return res.status(500).json({
            message: "There was a problem in allocation",
            error
        });
    }
}

async function getAllocations(req, res) {
    try {
        let page = parseInt(req.query.page);
        let size = parseInt(req.query.size);
        let query = { DeletedAt: null };
        if (page < 0 || page === 0) {
            response = {
                error: true,
                message: "invalid page number, should start with 1"
            };
            return res.status(400).json(response);
        }
        let skip = size * (page - 1);
        let projections = {
            StaffId: 1,
            ClassId: 1
        };
        let allocation = await Allocation.find(query, projections)
            .skip(skip)
            .limit(size);
        return res.status(200).json({ data: allocation });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Database Error", details: req.body, error });
    }
}

async function getAllocation(req, res) {
    try {
        let query = {
            _id: req.params.id,
            DeletedAt: null
        };
        let projections = {
            ClassId: 1,
            StaffId: 1
        };
        let allocationDoc = await Allocation.findOne(query, projections);
        if (!allocationDoc)
            return res.status(404).json({ message: "Allocation Not Found" });
        return res.status(200).json({ data: allocationDoc });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Database Error", details: req.body, error });
    }
}

async function deleteAllocation(req, res) {
    try {
        let query = { _id: req.params.id };
        date = Date.now();
        let newvalues = { $set: { DeletedAt: date } };

        let allocation = await Allocation.findOne(query);
        if (allocation.DeletedAt)
            return res.status(404).json({ message: "Allocation Not Found" });
        allocation = await Allocation.updateOne(query, newvalues);

        if (!allocation.ok)
            return res
                .status(500)
                .json({ message: "Database Error", error: allocation });

        return res.status(201).json({ message: "Allocation Deleted" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Database Error", details: req.body, error });
    }
}

async function updateAllocation(req, res) {
    try {
        let query = { _id: req.params.id };
        let newvalues = { $set: req.body };

        let allocation = await Allocation.findOne(query);
        if (allocation.DeletedAt)
            return res.status(404).json({ message: "Allocation Not Found" });
        allocation = await Allocation.updateOne(query, newvalues);
        if (!allocation.ok)
            return res
                .status(400)
                .json({ message: "Invalid Entries", details: req.body });

        return res.status(201).json({ message: "Allocation Updated" });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Database Error", details: req.body, error });
    }
}

module.exports = {
    allocate,
    getAllocations,
    deleteAllocation,
    updateAllocation,
    getAllocation
};
