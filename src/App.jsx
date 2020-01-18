import React, { Component } from "react";
import Content from "./Content.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
class App extends Component {
  constructor() {
    super();
    this.state = {
      loginUsernameInput: "",
      loginPasswordInput: "",
      signupUsernameInput: "",
      signupPasswordInput: "",
      username: undefined
    };
  }
  loginUsernameChange = evt => {
    this.setState({ loginUsernameInput: evt.target.value });
  };
  loginPasswordChange = evt => {
    this.setState({ loginPasswordInput: evt.target.value });
  };
  loginHandler = async (evt, inputs) => {
    evt.preventDefault();
    let name = this.state.loginUsernameInput;
    let data = new FormData();
    data.append("username", name);
    data.append("password", this.state.loginPasswordInput);
    let response = await fetch("/login", { method: "POST", body: data });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      this.setState({ username: name });
    }
  };
  signupUsernameChange = evt => {
    this.setState({ signupUsernameInput: evt.target.value });
  };
  signupPasswordChange = evt => {
    this.setState({ signupPasswordInput: evt.target.value });
  };
  signupHandler = async (evt, inputs) => {
    evt.preventDefault();
    let name = this.state.signupUsernameInput;
    let data = new FormData();
    data.append("username", name);
    data.append("password", this.state.signupPasswordInput);
    let response = await fetch("/signup", { method: "POST", body: data });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      this.setState({ username: name });
    }
  };
  componentDidMount = async () => {
    const session = await (await fetch("/session")).json();
    if (session.success) {
      this.setState({ username: session.username });
    }
    debugger;
  };
  render = () => {
    if (this.state.username === undefined) {
      return (
        <>
          <Signup
            signupHandler={this.signupHandler}
            signupUsernameChange={this.signupUsernameChange}
            signupPasswordChange={this.signupPasswordChange}
          />
          <Login
            loginHandler={this.loginHandler}
            loginUsernameChange={this.loginUsernameChange}
            loginPasswordChange={this.loginPasswordChange}
          />
        </>
      );
    }
    return <Content username={this.state.username} />;
  };
}

export default App;
