import React, { Component } from "react";

const initialState = {
  file: "",
  description: ""
};
class NewPost extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }
  descChangeHandler = e => {
    this.setState({ description: e.target.value });
  };
  fileChangeHandler = e => {
    this.setState({ file: e.target.files[0] });
  };
  submitHandler = async evt => {
    evt.preventDefault();
    evt.target.reset();
    const data = new FormData();
    data.append("username", this.props.username);
    data.append("img", this.state.file);
    data.append("description", this.state.description);
    await fetch("/new-post", { method: "POST", body: data });
    this.setState(initialState);
    this.props.reload();
  };
  render = () => {
    return (
      <form onSubmit={this.submitHandler}>
        <input type="file" onChange={this.fileChangeHandler} />
        <input
          type="text"
          value={this.state.description}
          onChange={this.descChangeHandler}
        />
        <input type="submit" value="create new" />
      </form>
    );
  };
}
export default NewPost;
