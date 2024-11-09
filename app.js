var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var parametersRouter = require("./routes/parameters");
var admin = require("firebase-admin");
var serviceAccount = require("./secret/serviceAccountKey.json");

// set up app
var app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// set up firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://codeway-case-be-default-rtdb.europe-west1.firebasedatabase.app/",
});

app.use("/parameters", parametersRouter);

module.exports = { app, admin };
