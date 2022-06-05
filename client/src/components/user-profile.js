import React, { Component } from "react";

export class UserProfile extends Component {
  render() {
    return (
      <div className="user-profile">
        <div>Mi perfil</div>
        <div className="avatar-and-network">
          <div>
            <img src="/img/avatar.webp" alt="perfil de usuario"></img>
          </div>
          <div>
            Red {this.props.networkType}({this.props.networkId})
          </div>
        </div>
        <div className="user-account">
          <div>{this.props.account}</div>
        </div>
        <div>Mis apuestas</div>
        <div></div>
      </div>
    );
  }
}