import React, { Component } from "react";

export class Header extends Component {
  render() {
    return (
      <div className="header">
        <img src="/img/bet2peer_logo_letras.png"></img>
        <div className="burger-menu">
          {this.props.showChat ? (
            <img
              src="/img/chat_icon3.png"
              onClick={() => {
                this.props.burgerMenuChange("chat");
              }}
            />
          ) : null}
          {this.props.showUser ? (
            <img
              src="/img/avatar.webp"
              onClick={() => {
                this.props.burgerMenuChange("user");
              }}
            />
          ) : null}
          {this.props.showBets ? (
            <img
              src="/img/bet2peer_logo.png"
              onClick={() => {
                this.props.burgerMenuChange("bets");
              }}
            />
          ) : null}
        </div>
      </div>
    );
  }
}
