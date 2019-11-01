const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const _ = require("lodash");


let app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
moment.locale("id");

mongoose.connect("mongodb+srv://admin_dyaksa:tuesblues_030195@cluster0-pnlxn.mongodb.net/todolistDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log("database dihubungkan");
}).catch((err) => {
    console.log(err);
});

const itemSchema = Schema({
    name: String
});


const listSchema = Schema({
    name: String,
    items: [itemSchema]
})

const Items = mongoose.model("Item", itemSchema);
const Lists = mongoose.model("List", listSchema);

const item1 = new Items({
    name: "Welcome to your todolist"
});

const item2 = new Items({
    name: "Hit the + button add new item"
});

const item3 = new Items({
    name: "<-- Hit this to delete item"
});

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {
    let day = moment().format("dddd, DD MMMM");
    Items.find({}, function (err, items) {
        if (err) throw err;
        res.render("list", {
            listTitle: day,
            items: items
        });
    });
});

app.post("/", function (req, res) {
    const submit = req.body.submit;
    const inputItem = req.body.item;
    const today = moment().format("dddd, DD MMMM");

    const item = new Items({
        name: inputItem
    });

    if (submit === today) {
        item.save();
        res.redirect("/");
    } else {
        Lists.findOne({
            name: submit
        }, function (err, list) {
            if (err) throw err;
            list.items.push(item);
            list.save(function (err) {
                if (err) throw err;
                res.redirect("/" + submit);
            });
        });
    }
});

app.post("/delete", function (req, res) {
    const id = req.body.checkbox;
    const day = moment().format("dddd, DD MMMM");
    const titleName = req.body.titleName;
    if (day === titleName) {
        Items.findByIdAndRemove(id, function (err) {
            if (err) throw err;
            console.log("success delete");
            res.redirect("/");
        });
    } else {
        Lists.findOneAndUpdate({
            name: titleName
        }, {
            $pull: {
                items: {
                    _id: id
                }
            }
        }, function (err, result) {
            if (err) throw err;
            console.log("success update");
            res.redirect("/" + titleName);
        });
    }
});

app.get("/:customList", function (req, res) {
    const customList = _.lowerCase(req.params.customList);
    Lists.findOne({
        name: customList
    }, function (err, list) {
        if (!err) {
            if (!list) {
                const list = new Lists({
                    name: customList,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customList);
            } else {
                res.render("list", {
                    listTitle: list.name,
                    items: list.items
                });
            }
        }
    });


});

app.listen(process.env.PORT || 3000, () => console.log("port 3000"));