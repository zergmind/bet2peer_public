import React, { Component } from "react";

export class Chat extends Component {
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

  render() {
    return (
      <div className="chat">
        <div className="chat-messages">
          <div>Chat</div>
          {this.props.messages
            ? this.props.messages.map((message) => (
                <div key={message.id}>
                  {message.nickname}: {message.content}
                </div>
              ))
            : null}
        </div>
      </div>

      //   <div className="chat-form">
      //     <div>Nombre</div>
      //     <input
      //       type="text"
      //       className="textbox"
      //       onChange={this.storeNickname}
      //     ></input>
      //     <div>Mensaje</div>
      //     <textarea
      //       className="textbox"
      //       onChange={this.storeCurrentMessage}
      //     ></textarea>
      //     <button className="btn" onClick={this.sendMessage}>
      //       Enviar
      //     </button>
      //   </div>
      // </div>
    );
  }
}
