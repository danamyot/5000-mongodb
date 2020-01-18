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
    const allPosts = await (await fetch("/all-posts")).json();
    this.setState({ posts: allPosts });
  };
  deletePost = async postId => {
    console.log(postId);
    let data = new FormData();
    data.append("postId", postId);
    await fetch("/delete-post", { method: "POST", body: data });
    this.reload();
  };
  render = () => {
    return (
      <div>
        <button onClick={this.reload}> load </button>
        <div>
          {this.state.posts.map(p => (
            <Post key={p._id} contents={p} deletePost={this.deletePost} />
          ))}
        </div>
        <NewPost username={this.props.username} />
      </div>
    );
  };
}
export default Content;
