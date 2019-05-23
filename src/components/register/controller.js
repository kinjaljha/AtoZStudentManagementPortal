const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../../config");
const User = require("./model");
const ClassModel = require("../class/model");
const StaffModel = require("../staff/model");
const AllocationModel = require("../allocation/model");

async function registerUser(req, res) {
    try {
        if (!req.body.Password)
            return res.status(400).json({ message: "Password required" });
        let hashedPassword = bcrypt.hashSync(req.body.Password, 8);

        let user = await User.create({
            FirstName: req.body.FirstName,
            MiddleName: req.body.MiddleName,
            LastName: req.body.LastName,
            Email: req.body.Email,
            Mobile: req.body.Mobile,
            Address: req.body.Address,
            City: req.body.City,
            Password: hashedPassword,
            ClassId: req.body.ClassId,
            ProfilePic: req.body.ProfilePic
        });
        return res.status(201).json({
            message: "User created successful"
        });
    } catch (error) {
        return res.status(500).json({
            message: "There was a problem registering the user.",
            error
        });
    }
}

async function login(req, res) {
    try {
        let user = await User.findOne({
            Email: req.body.Email,
            DeletedAt: null
        });
        const compare = await bcrypt.compare(req.body.Password, user.Password);
        if (!compare)
            return res.status(400).json({
                message: "Invalid email or password",
                details: req.body
            });

        let token = jwt.sign(
            { id: user._id, email: user.Email },
            config.secret,
            {
                expiresIn: 86400 // expires in 24 hours
            }
        );
        return res
            .status(200)
            .json({ message: "User logged in successfully", token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "There was a problem logging in the user.",
            error
        });
    }
}

async function getUsers(req, res) {
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
            Mobile: 1,
            Address: 1,
            City: 1,
            ProfilePic: 1,
            ClassId: 1
        };
        let users = await User.find(query, projections)
            .skip(skip)
            .limit(size);
        let classPromise = [];
        users.forEach(user => {
            let classQuery = { _id: user.ClassId, DeletedAt: null };
            classPromise.push(ClassModel.findOne(classQuery, { Class: 1 }));
        });

        let classResults = await Promise.all(classPromise);
        classResults.forEach((classDoc, i) => {
            let user = JSON.parse(JSON.stringify(users[i]));
            user["ClassName"] = classDoc.Class;
            user.ClassId = undefined;
            users[i] = JSON.parse(JSON.stringify(user));
        });
        return res.status(200).json({ data: users });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Database Error", details: req.body, error });
    }
}

async function getUser(req, res) {
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
            Mobile: 1,
            Address: 1,
            City: 1,
            ProfilePic: 1,
            ClassId: 1
        };
        let user = await User.findOne(query, projections);
        if (!user) return res.status(404).json({ message: "User Not Found" });

        let classQuery = { _id: user.ClassId, DeletedAt: null };
        let classDoc = await ClassModel.findOne(classQuery, { Class: 1 });
        user = JSON.parse(JSON.stringify(user));
        user.ClassName = classDoc.Class;

        return res.status(200).json({ data: user });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Database Error", details: req.body, error });
    }
}
async function deleteUser(req, res) {
    try {
        let query = { _id: req.params.id };
        date = Date.now();
        let newvalues = { $set: { DeletedAt: date } };

        let user = await User.findOne(query);
        if (user.DeletedAt)
            return res.status(404).json({ message: "User Not Found" });
        user = await User.updateOne(query, newvalues);

        if (!user.ok)
            return res
                .status(500)
                .json({ message: "Database Error", error: user });

        return res.status(201).json({ message: "User Deleted" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Database Error", details: req.body, error });
    }
}

async function updateUser(req, res) {
    try {
        let query = { _id: req.params.id };
        let newvalues = { $set: req.body };

        let user = await User.findOne(query);
        if (user.DeletedAt)
            return res.status(404).json({ message: "User Not Found" });
        user = await User.updateOne(query, newvalues);
        if (!user.ok)
            return res
                .status(400)
                .json({ message: "Invalid Entries", details: req.body });

        return res.status(201).json({ message: "User Updated" });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Database Error", details: req.body, error });
    }
}

module.exports = {
    registerUser,
    login,
    getUser,
    getUsers,
    updateUser,
    deleteUser
};
