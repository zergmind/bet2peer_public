import React, { Component } from "react";

export class Chat extends Component {
  render() {
    return (
      <div className="chat">
        <div className="chat-messages">
          <div>Chat</div>
        </div>
        <div className="chat-form">
          <div>Nombre</div>
          <input type="text" className="textbox"></input>
          <div>Mensaje</div>
          <textarea className="textbox"></textarea>
          <button className="btn">Enviar</button>
        </div>
      </div>
    );
  }
}
