import React, { Component } from 'react';

import './App.css';

import AddPost from "./components/AddPost";

class App extends Component {
    render() {
        return (
            <div>
                <AddPost siteLang="en" />
                </div>
            );
    }
}

export default App;
