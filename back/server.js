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

// JSON web token stuff
const JWT_SECRET = require("./secret/secret");
const jwt = require("jsonwebtoken");

// Adding Authorization header with JWT token data
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
  next();
});


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
        if ( err ) {
            console.log(err);
            res.status(500).end("Can't find post");
        }

        console.log(post);
        res.status(200).end(post);
    });
});


/**** POST ****/

// POSTing a new message
// TODO: JWT login check not cookie
app.post("/api/posts", (req, res) => {
    console.log(req.body);
    console.log(req.cookies);

    // If the user is logged in add the post
    if ( req.headers.authorization.startsWith("Bearer ") ) {
        var token = req.headers.authorization.slice(7, req.headers.authorization.length);

        var decoded = jwt.verify(token, "admin");
        console.log(decoded);

        console.log(Date());
        console.log(Date.now());

        var newPost = new Post({
            owner: decoded.username,
            content: req.body.content,
            date: Date(),
        });
        newPost.save((err, post) => {
            if ( err ) {
                console.log(err);
                res.status(500).end("Adding the post failed.");
            }
            console.log(post);
            res.status(201).json(post);
        });
    }
});

// Adding a new user
app.post("/api/users", (req, res) => {
    var body = req.body;

    // Hashing the password with bcrypt
    var passHash = bcrypt.hashSync(body.pass, salt);

    var newUser = new User({
        passwordHash: passHash,
        email: body.email,
        username: body.username,
    });

    // Saving the new user to the DB
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
            let token = getToken(user);
            res.json({
                success: true,
                err: null,
                token
            });
        }
    });
});

// The route which checks login info
app.post("/api/login", (req, res) => {
    console.log(req.body);

    User.findOne({username: req.body.username}, (err, user) => {
        if ( err || user === null ) {
            console.log(err);
            res.status(500).end("No user found");
        }

        if ( bcrypt.compareSync(req.body.password, user.passwordHash) ) {
            let token = getToken(user);
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

/**** Helper functions ****/


function getToken(user) {
    return token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        //JWT_SECRET,
        "admin",
        { expiresIn: 86400 } // Expiry: 1 day
    );
}
