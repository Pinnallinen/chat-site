import React, { Component } from 'react';

import './App.css';

import AddPost from "./components/AddPost";
import RegisterUser from "./components/RegisterUser";
import LogInUser from "./components/LogInUser";
import DisplayPosts from "./components/DisplayPosts";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            siteLang: "en",
            user: {}
        };
    }

    setToken = (token) => {
        localStorage.setItem("idToken", token);
    };

    getToken = () => {
        return localStorage.getItem("idToken");
    };

    logOut = () => {
        localStorage.removeItem("idToken");
    };

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
            default:
                return this.setState({
                    siteLang: "en",
                })
        }
    };


    loggedIn = () => {
        console.log(!this.isTokenExpired());
        return (!this.isTokenExpired());
    };

    // User logs in normally
    handleLogin = (userInfo) => {
        fetch("api/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userInfo.username,
                password: userInfo.password,
            })
        }).then((res) => {
            if ( res.status === 200 ) {
                res.json()
                .then((res) => {
                    console.log(res);
                    this.setToken(res.token);
                });
            }
        });
    };

    // User is registered and automatically logged in
    // Handling the JWT token after user has registered
    registeredUser = (response) => {
        this.setToken(response.token);

        this.props.history.replace("/");
    };

    decodeToken = (token) => {
        console.log(token);
        var base64Url = token.split('.')[1];
        if ( base64Url ) {
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var parsed = JSON.parse(atob(base64));
            console.log(parsed);
            return parsed;
        }
        else {
            return null;
        }
    };

    // Check if the current token is expired
    isTokenExpired = () => {
        var token = this.getToken();
        if ( token ) {
            let decodedToken = this.decodeToken(token);

            if ( decodedToken.exp < Date.now() / 1000 ) {
                return true;
            }
            return false;
        }
        return true;
    };

    componentWillMount() {
        if ( this.loggedIn() ) {
            let token = this.decodeToken(this.getToken());
            let user = {};
            user.username = token.username;
            user.id = token.id;

            this.setState({
                user: user
            });
        }
        else {
            //this.props.history.replace("/");
        }
    }

    render() {
        return (
            <div>
                { /* If user is logged in show logout and addpost, else show register and login
                    */
                this.loggedIn?(
                    <>
                        <AddPost siteLang="en" loggedIn={this.loggedIn} getToken={this.getToken} />
                        <button> logout </button>
                    </>
                ):(
                    <>
                        <RegisterUser siteLang="en" registeredUser={this.registeredUser} />
                        <LogInUser siteLang="en" handleLogin={this.handleLogin} />
                    </>

                )}

                <DisplayPosts siteLang="en" loggedIn={this.loggedIn} getToken={this.getToken} />
            </div>
        );
    }
}

export default App;
