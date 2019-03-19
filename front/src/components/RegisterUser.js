import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';

import BUNDLE from "../translation/RegisterUser_bundle";

/*
A simple dialog-window-class which can be used to register new users.
*/
class RegisterUser extends Component {

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
            // Dialog status
            open: false,
            // The rest are user data
            pass: "",
            pass2: "",
            username: "",
            email: "",
        };
    };

    // Opens the dialog-window
    handleOpen = () => {
        this.setState({ open: true });
    };

    // Closes the dialog-window
    handleClose = () => {
        this.setState({ open: false });
    };

    // Handles all the changes in the TextFields
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    submitUser = async (e) => {
        if ( this.state.pass === this.state.pass2 ) {

            // Trying to save the new user
            const response = await fetch('api/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pass: this.state.pass,
                    email: this.state.email,
                    username: this.state.username,
                }),
            });

            const body = await response.text();
            console.log(body);

            // If adding the new user was successful, close the dialog
            if ( response.status === 201 ) {
                this.handleClose();

                // Telling the parent we logged in
                this.props.registeredUser(response);
            }
        }
        else {
            // TODO: passwords do not match error
        }
    };

    render() {

        var bundle = this.state.bundle;

        return (
            <div>
                <Button onClick={this.handleOpen} color="primary">
                    {bundle.createNewUser}
                </Button>

                <Dialog open={this.state.open} onClose={this.handleClose}>
                    <DialogTitle> {bundle.registerTitle} </DialogTitle>

                    <DialogContent>
                        <DialogContentText> {bundle.fieldsRequired} </DialogContentText>

                        <TextField name="username" label={bundle.username} value={this.state.username} onChange={this.handleChange} />
                        <TextField name="pass" label={bundle.password} type="password" value={this.state.pass} onChange={this.handleChange} />
                        <TextField name="pass2" label={bundle.password2} type="password" value={this.state.pass2} onChange={this.handleChange} />
                        <TextField name="email" label={bundle.email} type="email" value={this.state.email} onChange={this.handleChange} />
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.handleClose} color="secondary">
                            {bundle.cancel}
                        </Button>
                        <Button onClick={this.submitUser} color="primary">
                            {bundle.create}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    };
};

export default RegisterUser;
