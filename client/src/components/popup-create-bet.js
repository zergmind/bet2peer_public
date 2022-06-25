import React, { Component } from "react";
import Popup from "./popup.js";
import Bet from "../models/bet.js";
import MatchDescription from "./match-description.js";

export class PopupCreateBet extends Component {
  state = {
    bet: new Bet(),
  };
  componentDidMount() {
    const { bet } = this.state;
    bet.quota = 1.5; //Cuota por defecto
    bet.match = this.props.match;
    this.setState({
      bet,
    });
  }

  quantityChange = (e) => {
    const { bet } = this.state;
    bet.quantity = e.target.value;
    this.setState({ bet });
  };

  quotaChange = (e) => {
    const { bet } = this.state;
    bet.quota = e.target.value;
    this.setState({ bet });
  };

  resultChange = (e) => {
    const { bet } = this.state;
    bet.result = e.target.value;
    this.setState({ bet });
  };

  createBet = () => {
    const { bet } = this.state;
    this.props.createBetFunction(bet);
  };

  earningResult() {
    const { bet } = this.state;
    if (bet.quota && bet.quantity && bet.quantity > 0) {
      return `Ganarías ${bet.quantity * bet.quota} ${this.props.currentSymbol}`;
    } else {
      return "";
    }
  }

  render() {
    return (
      <Popup
        title={"Crear apuesta"}
        closeFunction={this.props.closePopupCreateBetFunction}
      >
        <MatchDescription match={this.props.match}></MatchDescription>
        <div>
          <div className="create-bet-your-bet">
            <div>¿Cuánto {this.props.currentSymbol} quieres apostar?</div>
            <input
              type="number"
              className="textbox"
              onChange={this.quantityChange}
            ></input>
          </div>
          <div className="create-bet-quota">
            <div>¿A qué cuota? &nbsp; {this.earningResult()}</div>
            <input
              type="number"
              className="textbox"
              value={this.state.bet.quota}
              onChange={this.quotaChange}
            ></input>
          </div>
          <div className="create-bet-results">
            <div>Al resultado...</div>
            <div id="radio-group" onChange={this.resultChange}>
              <div>
                <input type="radio" name="matchResult" value="1" />
                Gana {this.props.match.localName}
              </div>
              <div>
                <input type="radio" name="matchResult" value="0" />
                Empatan
              </div>
              <div>
                <input type="radio" name="matchResult" value="2" />
                Gana {this.props.match.visitorName}
              </div>
            </div>
          </div>
          <div className="btn-container">
            <button className="btn" onClick={this.createBet}>
              Aceptar
            </button>
          </div>
        </div>
      </Popup>
    );
  }
}
