import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

// BUNDLE used for translations
import BUNDLE from "../translation/AddPost_bundle";

class AddPost extends Component {

    constructor(props) {
        super(props);

        var bundle = BUNDLE;
        if ( props.siteLang === "fi" )
            bundle = bundle.fi;
        else {
            bundle = bundle.en;
        }

        this.state = {
            content: "",
            bundle: bundle,
        }
    }

    handleChange = ( event ) => {
        switch ( event.target.name ) {
            case "content":
                this.setState({ content: event.target.value });
        }
    }

    // Saving the post if the user is logged in
    savePost = async () => {
        console.log("tssti1");
        if ( this.props.loggedIn() ) {
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.props.getToken()}`
                },
                body: JSON.stringify({
                    content: this.state.content
                }),
            });

            // Saving the post was successful
            if ( res.status === 201 ) {
                console.log("hello");
                window.location.reload(); 
            }
        }
        else {
            this.props.history.replace("/");
            // TODO: Error user not logged in
        }
    }

    render() {

        return (
            <div>
                <TextField
                    name="content"
                    multiline
                    rowsMax="5"
                    value={this.state.content}
                    onChange={this.handleChange}
                    label={this.state.bundle.content} />

                <Button onClick={this.savePost} > {this.state.bundle.send} </Button>
            </div>
        );
    }
}

export default AddPost;
