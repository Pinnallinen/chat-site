import React, { Component } from "react";

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import Typography from '@material-ui/core/Typography';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';

import BUNDLE from "../translation/DisplayPost_bundle";

class DisplayPost extends Component {
    constructor(props) {
        super(props);

        var bundle = BUNDLE;
        if ( props.siteLang === "fi" )
            bundle = bundle.fi;
        else {
            bundle = bundle.en;
        }

        this.state = {
            bundle: bundle,
            postOpen: false,
            comment: "",
            postComments: null,
        }
    }

    componentWillMount() {
        this.setPostComments(this.props.post.answers);
    }

    setPostComments(rawPostComments) {
        var postComments = rawPostComments.map((answer) => {
            //console.log(answer);
            return (
                <div class="post">
                    <Typography classes={{ root: "float-left" }} color="textSecondary" align="right" >
                        {answer.answer_owner}
                    </Typography>

                    <Typography color="textSecondary">
                        {answer.answer_date}
                    </Typography>


                    <Typography >
                        {answer.content}
                    </Typography>
                </div>
            );
        });
        //console.log(postComments);
        this.setState({
            comment: "",
            postComments: postComments,
        });
    }

    openPost = () => {
        this.setState({
            postOpen: true,
        });
    };

    handleClose = () => {
        this.setState({
            postOpen: false,
        });
    };

    handleComment = async () => {

        if ( this.props.loggedIn() ) {
            console.log(`/api/posts/${this.props.post._id}`);
            const res = await fetch(`/api/posts/${this.props.post._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.props.getToken()}`
                },
                body: JSON.stringify({
                    content: this.state.comment,
                }),
            });

            // Saving the post was successful
            // TODO: reload post content
            if ( res.status === 200 ) {
                //console.log(res);
                var newPost = await res.json();
                console.log(newPost.answers);

                this.setPostComments(newPost.answers);
            }
        }
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };


    // TODO: Change comment field to be seen only when user logged in
    render() {
        var post = this.props.post;
        var bundle = this.state.bundle;

        return (
            <div>
                <Card onClick={this.openPost}>
                    <CardContent >
                        <Typography color="black"  align="right">
                            {post.owner}
                        </Typography>

                        <Typography color="textPrimary" >
                            {post.content}
                        </Typography>
                    </CardContent>

                    <CardActions >

                    </CardActions>
                </Card>

                { // If the post is open, display the post otherwise nothing
                this.state.postOpen?(
                    <div id="padding-0">
                        <Dialog open={this.state.postOpen} onClose={this.handleClose} >
                            <DialogContent>
                                <Typography align="right" color="textSecondary">
                                    {post.owner}
                                </Typography>

                                <Typography>
                                    {post.content}
                                </Typography>

                                {this.state.postComments}

                                <TextField
                                    name="comment"
                                    label={bundle.comment}
                                    value={this.state.comment}
                                    onChange={this.handleChange} />

                                <Button onClick={this.handleComment} >
                                    {bundle.postComment}
                                </Button>

                            </DialogContent>
                        </Dialog>
                    </div>
                ):(
                    <>
                    </>
                )}
            </div>
        );
    }
}

export default DisplayPost;
