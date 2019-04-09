import React, { Component } from 'react';

import './App.css';

import AddPost from "./components/AddPost";
import RegisterUser from "./components/RegisterUser";
import LogInUser from "./components/LogInUser";
import DisplayPost from "./components/DisplayPost";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            siteLang: "en",
            user: {},
            posts: [],
        };
    }

    // Fetches all the posts from the backend REST api
    getPosts = async () => {
        var res = await fetch("api/posts");
        if ( res.status === 200 ) {
            var posts = await res.json();
            console.log(posts);
            if ( posts ) {
                console.log(posts);
                var allPosts = posts.map((post) => {
                    console.log(post);
                    return <DisplayPost post={post} loggedIn={this.loggedIn} getToken={this.getToken} />;
                })
                this.setState({
                    posts: allPosts,
                });
            }
        }
        else {
            // TODO: no posts found
        }
    };

    setToken = (token) => {
        localStorage.setItem("idToken", token);
    };

    getToken = () => {
        return localStorage.getItem("idToken");
    };

    removeToken = () => {
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

                    // Reload the page
                    this.setState({
                        state: this.state
                    });
                });
            }
        });
    };

    handleLogout = () => {
        this.removeToken();

        this.setState({
            state: this.state
        });
    };

    // User is registered and automatically logged in
    // Handling the JWT token after user has registered
    registeredUser = (response) => {
        this.setToken(response.token);

        this.props.history.replace("/");
    };

    decodeToken = (token) => {
        var base64Url = token.split('.')[1];
        if ( base64Url ) {
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var parsed = JSON.parse(atob(base64));
            //console.log(parsed);
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
        this.getPosts();
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

    /* If user is logged in show logout and addpost, else show register and login


       */
    render() {

        return (
            <div >
                { this.loggedIn() ? (
                    <>
                        <AddPost siteLang="en" loggedIn={this.loggedIn} getToken={this.getToken} />
                        <button onClick={this.handleLogout}> logout </button>
                    </>
                ):(
                    <>
                        <RegisterUser siteLang="en" registeredUser={this.registeredUser} />
                        <LogInUser siteLang="en" handleLogin={this.handleLogin} />
                    </>

                )}

                <div class="center" >
                    {this.state.posts}
                </div>
            </div>
        );
    }
}

export default App;
