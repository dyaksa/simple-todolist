const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");
const date = require(__dirname + "/date.js");

let app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
moment.locale("id");

const lists = ['Buy Food', 'Cook Food', 'Eat Food'];
const workLists = [];

app.get("/", function (req, res) {
    let day = moment().format("dddd, DD MMMM");
    res.render("list", {
        listTitle: day,
        lists: lists
    });
});

app.post("/", function (req, res) {
    if (req.body.submit === "Work") {
        let work = req.body.list;
        workLists.push(work);
        res.redirect("/work");
    } else {
        let list = req.body.list;
        lists.push(list);
        res.redirect("/");
    }

    console.log("Berhasil menambahkan " + date.getDate());
});

app.get("/work", function (res, res) {
    let title = "Work";
    res.render("list", {
        listTitle: title,
        lists: workLists
    });
});

app.listen(process.env.PORT || 3000, () => console.log("port 3000"));