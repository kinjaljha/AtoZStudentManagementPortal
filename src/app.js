const express = require("express");
const bodyParser = require("body-parser");
require("./_helpers/db")();

const staff = require("./components/staff/route");
const classes = require("./components/class/route");
const register = require("./components/register/route");
const allocation = require("./components/allocation/route");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/staffs", staff);
app.use("/classes", classes);
app.use("/users", register);
app.use("/allocations", allocation);

let port = 4000;

app.listen(port, () => {
    console.log("Server is up and running on port number " + port);
});
