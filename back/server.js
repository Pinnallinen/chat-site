const express = require("express");

const app = express();
const port = process.env.PORT || 8000;


/**** Middlewares ****/

const bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Some protection
const helmet = require("helmet");
app.use(helmet());


/** Database (MongoDB) stuff **/
const mongoose = require("mongoose");

const { MONGODBURL } = require("./secret/mongodburl");



const User = require("./models/user");
const Post = require("./models/post");

mongoose.connect(
  MONGODBURL,
  { useNewUrlParser: true }
);

let db = mongoose.connection;
db.once("open", () => {
  console.log("connected to the database");
});

db.on("error", console.error.bind(console, "MongoDB connection error:"));


/**** GET ****/

// Get the main page of the app (app.js, react)
app.get("/", (req, res) => {

});

// Get all the posts from the api
app.get("/api", (req, res) => {
    Post.find({}, (err, posts) => {
        if ( err ) {
            console.log(err);
            res.status(500).end("Something went wrong");
        }

        console.log(posts);
        res.status(200).send(posts);
    });
});

// Get a certain post from the api
app.get("/api/:post_id", (req, res) => {
    Post.findOne({ _id: post_id}, (err, post) => {

    });
});


/**** POST ****/

// POSTing a new message
app.post("/api", (req, res) => {
    console.log(req.body);
});

app.listen(port, () => {
    console.log(`Server running at localhost:${port}`);
});
