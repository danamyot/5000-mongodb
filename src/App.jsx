import React, { Component } from "react";
import Content from "./Content.jsx";
class App extends Component {
  constructor() {
    super();
    this.state = {
      usernameInput: "",
      passwordInput: "",
      username: undefined
    };
  }
  usernameChange = evt => {
    this.setState({ usernameInput: evt.target.value });
  };
  passwordChange = evt => {
    this.setState({ passwordInput: evt.target.value });
  };
  submitHandler = async evt => {
    evt.preventDefault();
    console.log("username", this.state.username);
    console.log("password", this.state.passwordInput);
    let name = this.state.usernameInput;
    let data = new FormData();
    data.append("username", name);
    data.append("password", this.state.passwordInput);
    let response = await fetch("/login", { method: "POST", body: data });
    let body = await response.text();
    console.log("/login response", body);
    body = JSON.parse(body);
    if (body.success) {
      this.setState({ username: name });
    }
  };
  render = () => {
    if (this.state.username === undefined) {
      return (
        <form onSubmit={this.submitHandler}>
          {" "}
          Username <input
            type="text"
            onChange={this.usernameChange}
          /> Password <input type="text" onChange={this.passwordChange} />{" "}
          <input type="submit" value="login" />
        </form>
      );
    }
    return <Content />;
  };
}

export default App;
