import React, { Component } from "react";
class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: this.props.contents.description
    };
  }
  changeHandler = e => {
    this.setState({ description: e.target.value });
  };
  submitHandler = evt => {
    evt.preventDefault();
    const data = new FormData();
    data.append("description", this.state.description);
    data.append("id", this.props.contents._id);
    fetch("/update", { method: "POST", body: data });
  };
  render = () => {
    return (
      <form onSubmit={this.submitHandler}>
        <p>{this.props.contents.username}</p>
        <input
          type="text"
          value={this.state.description}
          onChange={this.changeHandler}
        />
        <img src={this.props.contents.frontendPath} />
        <input type="submit" value="update" />
        <input
          type="button"
          value="delete"
          onClick={() => this.props.deletePost(this.props.contents._id)}
        />
      </form>
    );
  };
}
export default Post;
