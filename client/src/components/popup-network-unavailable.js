import React, { Component } from "react";
import MatchDescription from "./match-description.js";
import Popup from "./popup.js";

export class PopupNetworkUnavailable extends Component {
  render() {
    return (
      <Popup
        title={"Red no permitida"}
        closeFunction={this.props.closePopupNetworkUnavailableFunction}
      >
        <h2>
          La red a la que estás conectado no está permitida. Por favor,
          conéctate a Mumbai Polygon
        </h2>
      </Popup>
    );
  }
}
