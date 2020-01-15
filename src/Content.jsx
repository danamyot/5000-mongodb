import React, { Component } from "react";
import Post from "./Post.jsx";
import NewPost from "./NewPost.jsx";
class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };
  }
  reload = async () => {
    const allPosts = (await fetch("/all-posts")).json();
    console.log("/all-posts response", allPosts);
    this.setState({ posts: allPosts });
  };
  render = () => {
    return (
      <div>
        <button onClick={this.reload}> load </button>
        <div>
          {this.state.posts.map(p => (
            <Post key={p._id} contents={p} />
          ))}
        </div>
        <NewPost />
      </div>
    );
  };
}
export default Content;
