import React, { Component } from "react";
import Popup from "./popup.js";

export class PopupLoading extends Component {
  render() {
    return (
      <Popup
        title={"Procesando la transacción"}
        closeFunction={this.props.closePopupLoadingFunction}
      >
        <img src="/img/loader.gif" alt="loader"></img>
      </Popup>
    );
  }
}
