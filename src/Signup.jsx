import React, { Component } from "react";

class Signup extends Component {
  render = () => {
    return (
      <form onSubmit={this.props.signupHandler}>
        Username{" "}
        <input type="text" onChange={this.props.signupUsernameChange} />
        Password{" "}
        <input type="text" onChange={this.props.signupPasswordChange} />
        <input type="submit" value="signup" />
      </form>
    );
  };
}

export default Signup;
