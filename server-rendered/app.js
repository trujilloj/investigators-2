require("dotenv").load();

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const path = require("path");

app.use(bodyParser.urlencoded({extended: false}));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(require("serve-static")(path.join(__dirname, "public")));

app.get("/", (request, response) => {
    response.redirect("/bill");
});

app.get("/bill", (request, response) => {
    response.render("bill");
});

app.listen(process.env.PORT || 3000);
