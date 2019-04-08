import React, {  Component } from 'react';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';

import BUNDLE from "../translation/LogInUser_bundle";

class LogInUser extends Component {

    constructor(props) {
        super(props);

        var bundle = BUNDLE;
        if ( props.siteLang === "fi" )
            bundle = bundle.fi;
        else {
            bundle = bundle.en;
        }

        this.state = {
            expanded: false,
            bundle: bundle,
        };
    }

    handleChange = (event) => {
        if ( !event.target.name ) {
            this.setState({
                expanded: !this.state.expanded,
            });
        }
        else {
            this.setState({
                [event.target.name]: event.target.value,
            });
        }
    };

    handleLogin = () => {
        var user = {};
        user.username = this.state.username;
        user.password = this.state.password;

        this.props.handleLogin(user);
    };

    render() {

        return (
            <div >
                <ExpansionPanel expanded={this.state.expanded} onChange={this.handleChange}>
                    <ExpansionPanelSummary >
                        {this.state.bundle.login}
                    </ExpansionPanelSummary>

                    <ExpansionPanelDetails>
                        <TextField
                            name="username"
                            label={this.state.bundle.username}
                            value={this.state.username}
                            onChange={this.handleChange} />
                        <TextField
                            name="password"
                            type="password"
                            label={this.state.bundle.password}
                            value={this.state.password}
                            onChange={this.handleChange} />

                        <Button onClick={this.handleLogin} >
                            {this.state.bundle.login}
                        </Button>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        );
    };
};

export default LogInUser;
