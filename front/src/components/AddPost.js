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
            description: "",
            bundle: bundle,
        }
    }

    handleChange = ( event ) => {
        switch ( event.target.name ) {
            case "description":
                this.setState({ description: event.target.value });
        }
    }

    savePost = async () => {
        const res = await fetch("/api/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                description: this.state.description,
                //owner: // TODO: owner id here
            }),
        });
    }

    render() {

        return (
            <div>
                <TextField
                    name="description"
                    multiline
                    rowsMax="5"
                    value={this.state.description}
                    onChange={this.handleChange}
                    label={this.state.bundle.description} />

                <Button onClick={this.savePost} > {this.state.bundle.send} </Button>
            </div>
        );
    }
}

export default AddPost;
