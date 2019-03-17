/**
    The backend for a simple site where you can post threads.
*/


/**** Express imports ****/

const express = require("express");

const app = express();
const port = process.env.PORT || 8000;


/**** Middlewares ****/

const bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Parse cookies
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Some protection
const helmet = require("helmet");
app.use(helmet());

// bcrypt
// For password-hashing, bcrypt
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

const JWT_SECRET = require("./secret/secret");


/**** Database (MongoDB) stuff ****/

const mongoose = require("mongoose");

const { MONGODBURL } = require("./secret/secret");



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
    // TODO: host the react-app here
});

// Get all the posts from the api
app.get("/api/posts", (req, res) => {
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
app.get("/api/posts/:post_id", (req, res) => {
    Post.findOne({ _id: post_id}, (err, post) => {

    });
});


/**** POST ****/

// POSTing a new message
app.post("/api/posts", (req, res) => {
    console.log(req.body);

    // If the user is logged in add the post
    if ( req.cookies.id ) {
        console.log(req.cookies.id);
        console.log(Date());
        console.log(Date.now());

        var newPost = new Post({
            owner: req.cookies.id,
            content: req.body.content,
            date: Date.now(),
        });
        newPost.save((err, post) => {
            if ( err ) {
                console.log(err);
                res.status(500).end("Adding the post failed.");
            }
            console.log(post);
            res.status(201).end("Added the post");
        });
    }
});

// Adding a new user
app.post("/api/users", (req, res) => {
    console.log(req.body);

    var body = req.body;

    var passHash = bcrypt.hashSync(body.pass, salt);

    var newUser = new User({
        passwordHash: passHash,
        email: body.email,
        username: body.username,
    });
    newUser.save((err, user) => {
        if ( err ) {
            console.log(err);
            res.status(503).json({
                success: false,
                err: err,
                message:"Adding the user failed."
            });
        }
        else {
            console.log(user._id);
            // Logging in the user
            res.setHeader("Set-cookie", `id=${user._id}; Max-Age=86400`); //Max-Age= 1 day

            // Status 201 = created new user
            res.status(201).end("Register successful");
        }
    });
});

// The route which checks login info
app.post("/api/login", (req, res) => {
    console.log(req.body);

    User.findOne({username: req.body.username}, (err, user) => {
        if ( bcrypt.compareSync(req.body.pass, user.passwordHash) ) {
            let token = jwt.sign(
                {
                    id: user._id,
                    username: user.username
                },
                JWT_SECRET,
                { expiresIn: 86400 } // Expiry: 1 day
            );
            res.json({
                success: true,
                err: null,
                token
            });
        }
    })
});

app.listen(port, () => {
    console.log(`Server running at localhost:${port}`);
});
