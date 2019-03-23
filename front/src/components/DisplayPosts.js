import React, { Component } from "react";

import DisplayPost from "./DisplayPost";

class DisplayPosts extends Component {

    constructor(props) {
        super(props);

        this.state = {
            posts: [],
        };
    }

    componentWillMount() {
        this.getPosts()
        .then((posts) => {
            console.log(posts);
            this.setState({
                posts: posts,
            });
        });
    }

    // Fetches all the rooms from the backend REST api
    getPosts = async () => {
        var res = await fetch("api/posts");
        if ( res.status === 200 ) {
            var posts = await res.json();
            console.log(posts);
            return posts;
        }
        else {
            // TODO: no posts found
        }
    };

    render() {
        //console.log(this.state.posts);

        var allPosts = [];
        for ( var i = 0; i < this.state.posts.length; i++ ) {
            var post = this.state.posts[i];
            console.log(post);
            allPosts.push(<DisplayPost post={post} />);
        }

        console.log(allPosts);

        return (
            <div>
                {allPosts}
            </div>
        );
    }
}

export default DisplayPosts;
