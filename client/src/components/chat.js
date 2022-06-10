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

  sendMessage = async () => {
    const { nickname, currrentMessage } = this.state;
    if(nickname.trim() === ""){
      alert("Empty Nickname");
    }
    else if (currrentMessage.trim() == "") {
      alert("Empty message");
    } else {
      this.props.sendMessageFunction(nickname, currrentMessage);
    }
  };
  
  handleKeyDown = (event) => {
     if(event.which === 13 && !event.shiftKey){
       this.sendMessage();
       document.getElementById("textarea").value = "";
     }
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
