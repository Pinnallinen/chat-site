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
        }
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
        
    };

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
                    <>
                        <Dialog open={this.state.postOpen} onClose={this.handleClose} >
                            <DialogContent>
                                <Typography align="right" color="textSecondary">
                                    {post.owner}
                                </Typography>

                                <Typography>
                                    {post.content}
                                </Typography>

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
                    </>
                ):(
                    <>
                    </>
                )}
            </div>
        );
    }
}

export default DisplayPost;
