export class WebsocketService {
  socket;
  receiveMessageFunction;
  constructor() {
    this.socket = new WebSocket(
      "wss://3ijqlanr73.execute-api.eu-west-3.amazonaws.com/production"
    );
    this.socket.onopen = (e) => {
      console.log("[open] Connection established");
      console.log("Sending to server");
    };

    this.socket.onmessage = (event) => {
      console.log(`[message] Data received from server: ${event.data}`);
      this.receiveMessageFunction(JSON.parse(event.data).message);
    };

    this.socket.onclose = (event) => {
      if (event.wasClean) {
        console.log(
          `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
        );
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log("[close] Connection died");
      }
    };

    this.socket.onerror = (error) => {
      console.log(`[error] ${error.message}`);
    };
  }

  sendMessage(messageData) {
    const message = { action: "sendmessage", message: messageData };
    this.socket.send(JSON.stringify(message));
  }

  setReceiveMessage(receiveMessageFunction) {
    this.receiveMessageFunction = receiveMessageFunction;
  }
}
