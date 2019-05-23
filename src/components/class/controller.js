const Class = require("./model");

async function deleteClass(req, res) {
    try {
        let query = { _id: req.params.id };
        date = Date.now();
        let newvalues = { $set: { DeletedAt: date } };

        let classDoc = await Class.findOne(query);
        if (classDoc.DeletedAt)
            return res.status(404).json({ message: "Class Not Found" });
        classDoc = await Class.updateOne(query, newvalues);

        if (!classDoc.ok)
            return res
                .status(500)
                .json({ message: "Database Error", error: classDoc });

        return res.status(201).json({ message: "Class Deleted" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Database Error", details: req.body, error });
    }
}

async function updateClass(req, res) {
    try {
        let query = { _id: req.params.id };
        let newvalues = { $set: req.body };

        let classDoc = await Class.findOne(query);
        if (classDoc.DeletedAt)
            return res.status(404).json({ message: "Class Not Found" });
        classDoc = await Class.updateOne(query, newvalues);
        if (!classDoc.ok)
            return res
                .status(400)
                .json({ message: "Invalid Entries", details: req.body });

        return res.status(201).json({ message: "Class Updated" });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Database Error", details: req.body, error });
    }
}

async function getClasses(req, res) {
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
            Class: 1
        };
        let classDoc = await Class.find(query, projections)
            .skip(skip)
            .limit(size);
        return res.status(200).json({ data: classDoc });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Database Error", details: req.body, error });
    }
}

async function getClass(req, res) {
    try {
        let query = {
            _id: req.params.id,
            DeletedAt: null
        };
        let projections = {
            Class: 1
        };
        let classDoc = await Class.findOne(query, projections);
        if (!classDoc)
            return res.status(404).json({ message: "Class Not Found" });

        return res.status(200).json({ data: classDoc });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Database Error", details: req.body, error });
    }
}

async function createClass(req, res) {
    try {
        let classDoc = new Class({
            Class: req.body.Class
        });

        await classDoc.save();
        return res.status(201).json({ message: "Class Created successfully" });
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
    getClasses,
    getClass,
    deleteClass,
    updateClass,
    createClass
};
