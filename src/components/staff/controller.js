const Staff = require("./model");

async function deleteStaff(req, res) {
    try {
        let query = { _id: req.params.id };
        date = Date.now();
        let newvalues = { $set: { DeletedAt: date } };

        let staff = await Staff.findOne(query);
        if (staff.DeletedAt)
            return res.status(404).json({ message: "Staff Not Found" });
        staff = await Staff.updateOne(query, newvalues);

        if (!staff.ok)
            return res
                .status(500)
                .json({ message: "Database Error", error: staff });

        return res.status(201).json({ message: "Staff Deleted" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Database Error", details: req.body, error });
    }
}

async function updateStaff(req, res) {
    try {
        let query = { _id: req.params.id };
        let newvalues = { $set: req.body };

        let staff = await Staff.findOne(query);
        if (staff.DeletedAt)
            return res.status(404).json({ message: "Staff Not Found" });
        staff = await Staff.updateOne(query, newvalues);
        if (!staff.ok)
            return res
                .status(400)
                .json({ message: "Invalid Entries", details: req.body });

        return res.status(201).json({ message: "Staff Updated" });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Database Error", details: req.body, error });
    }
}

async function getStaffs(req, res) {
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
            FirstName: 1,
            LastName: 1,
            MiddleName: 1,
            Email: 1,
            Mobile: 1
        };
        let staff = await Staff.find(query, projections)
            .skip(skip)
            .limit(size);
        return res.status(200).json({ data: staff });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Database Error", details: req.body, error });
    }
}

async function getStaff(req, res) {
    try {
        let query = {
            _id: req.params.id,
            DeletedAt: null
        };
        let projections = {
            FirstName: 1,
            LastName: 1,
            MiddleName: 1,
            Email: 1,
            Mobile: 1
        };
        let staff = await Staff.findOne(query, projections);
        if (!staff) return res.status(404).json({ message: "Staff Not Found" });

        return res.status(200).json({ data: staff });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Database Error", details: req.body, error });
    }
}

async function createStaff(req, res) {
    try {
        let staffDoc = new Staff({
            FirstName: req.body.FirstName,
            MiddleName: req.body.MiddleName,
            LastName: req.body.LastName,
            Email: req.body.Email,
            Mobile: req.body.Mobile
        });

        await staffDoc.save();
        return res.status(201).json({ message: "Staff Created successfully" });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res
                .status(400)
                .json({ message: "Invalid Entries", details: req.body });
        }
        return res
            .status(500)
            .json({ message: "Database Error", details: req.body, error });
    }
}

module.exports = {
    getStaffs,
    getStaff,
    deleteStaff,
    updateStaff,
    createStaff
};
