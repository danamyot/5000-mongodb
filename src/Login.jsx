import React, { Component } from "react";

class Login extends Component {
  render = () => {
    return (
      <form onSubmit={this.props.loginHandler}>
        Username <input type="text" onChange={this.props.loginUsernameChange} />
        Password <input type="text" onChange={this.props.loginPasswordChange} />
        <input type="submit" value="login" />
      </form>
    );
  };
}

export default Login;
