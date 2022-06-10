import React, { Component } from "react";

export class ChatForm extends Component {
  state = {
    nickname: "",
    currrentMessage: "",
  };
  componentDidUpdate() {}
  storeNickname = async (event) => {
    const nickname = event.target.value;
    this.setState({ nickname });
  };

  storeCurrentMessage = async (event) => {
    const currrentMessage = event.target.value;
    this.setState({ currrentMessage });
  };

  sendMessage = async () => {
    const { nickname, currrentMessage } = this.state;
    if (nickname == "") {
      alert("Empty Nickname");
    } else if (currrentMessage == "") {
      alert("Empty message");
    } else {
      this.props.sendMessageFunction(nickname, currrentMessage);
    }
  };

  render() {
    return (
      <div className="chat">
        <div className="chat-form">
          <div>Nombre</div>
          <input
            type="text"
            className="textbox"
            onChange={this.storeNickname}
          ></input>
          <div>Mensaje</div>
          <textarea
            className="textbox"
            onChange={this.storeCurrentMessage}
          ></textarea>
          <button className="btn" onClick={this.sendMessage}>
            Enviar
          </button>
        </div>
      </div>
    );
  }
}
