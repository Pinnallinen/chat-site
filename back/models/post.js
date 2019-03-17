const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
    {
        owner: { type: String, required: true },
        content: {type: String, required: true },
        date: { type: Date, required: true },

        // Answers to the post in an array of answers
        answers: [{
            answer_owner: { type: String, required: true },
            content: {type: String, required: true },
        }],
    },
);

const Post = module.exports = mongoose.model("Post", postSchema);
