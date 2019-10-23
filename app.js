const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

let app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
moment.locale("id");

mongoose.connect("mongodb://localhost:27017/todolistDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("database dihubungkan");
}).catch((err) => {
    console.log(err);
});

const itemsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const List = mongoose.model("Lists", itemsSchema);

const workLists = [];

app.get("/", function (req, res) {
    let day = moment().format("dddd, DD MMMM");
    let lists = List.find({}, function (err, results) {
        res.render("list", {
            listTitle: day,
            lists: results
        });
    });

});

app.post("/", function (req, res) {
    const itemName = req.body.list;
    const itemNew = new List({
        name: itemName
    });
    itemNew.save({
        validateBeforeSave: true
    }, function (err) {
        if (!err) {
            res.redirect("/");
            console.log("data tersimpan");
        }
    });
});

app.delete("/delete", function (req, res) {
    console.log("Hello World");
});

app.get("/work", function (res, res) {
    let title = "Work";
    res.render("list", {
        listTitle: title,
        lists: workLists
    });
});

app.listen(process.env.PORT || 3000, () => console.log("port 3000"));