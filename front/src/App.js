import React, { Component } from 'react';

import './App.css';

import AddPost from "./components/AddPost";
import RegisterUser from "./components/RegisterUser";

class App extends Component {

    constructor(props) {

        this.state = {
            siteLang: "en",
        };
    }

    setToken = (token) => {
        localStorage.setItem("idToken", token);
    };

    getToken = () => {
        return localStorage.getItem("idToken");
    }

    changeLang = () => {
        switch ( this.state.siteLang ) {
            case "en":
                return this.setState({
                    siteLang: "fi",
                });

            case "fi":
                return this.setState({
                    siteLang: "en",
                });
        }
    }

    render() {
        return (
            <div>
                <RegisterUser siteLang="en" />

                <AddPost siteLang="en" />
            </div>
        );
    }
}

export default App;
