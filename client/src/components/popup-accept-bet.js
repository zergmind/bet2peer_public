import React, { Component } from "react";
import MatchDescription from "./match-description.js";
import Popup from "./popup.js";

export class PopupAcceptBet extends Component {
  state = {
    bet: null,
  };
  componentDidMount() {
    this.setState({
      bet: { bet: this.props.bet },
    });
  }

  acceptBet = () => {
    this.props.acceptBetFunction(this.state.bet);
  };

  render() {
    return (
      <Popup
        title={"Aceptar apuesta"}
        closeFunction={this.props.closePopupAcceptBetFunction}
      >
        <MatchDescription match={this.props.bet.match}></MatchDescription>
        <div>
          <button className="btn" onClick={this.acceptBet}>
            Aceptar
          </button>
        </div>
      </Popup>
    );
  }
}
