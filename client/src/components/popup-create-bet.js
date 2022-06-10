import React, { Component } from "react";
import Popup from "./popup.js";
import Bet from "../models/bet.js";
import MatchDescription from "./match-description.js";

export class PopupCreateBet extends Component {
  state = {
    bet: new Bet(),
  };
  componentDidMount() {
    this.setState({
      bet: { match: this.props.match, ...this.state.bet },
    });
  }
  quantityChange = (e) => {
    const { bet } = this.state;
    this.setState({ bet: { quantity: e.target.value, ...bet } });
  };
  quotaChange = (e) => {
    const { bet } = this.state;
    this.setState({ bet: { quota: e.target.value, ...bet } });
  };
  resultChange = (e) => {
    const { bet } = this.state;
    this.setState({ bet: { result: e.target.value, ...bet } });
  };
  createBet = () => {
    const { bet } = this.state;
    this.props.createBetFunction(bet);
  };
  render() {
    return (
      <Popup
        title={"Crear apuesta"}
        closeFunction={this.props.closePopupCreateBetFunction}
      >
        <MatchDescription match={this.props.match}></MatchDescription>
        {/* <div className="match-container">
          <div className="team-local">
            <div className="team-name">{this.props.match.localName}</div>
            <img src={this.props.match.localImageUrl} alt="equipo_local" />
          </div>
          <div className="vs">vs</div>
          <div className="team-visitor">
            <img
              src={this.props.match.visitorImageUrl}
              alt="equipo_visitante"
            />
            <div className="team-name">{this.props.match.visitorName}</div>
          </div>
        </div> */}
        <div>
          <div className="create-bet-your-bet">
            <div>Tu apuesta...</div>
            <input
              type="number"
              className="textbox"
              onChange={this.quantityChange}
            ></input>
          </div>
          <div className="create-bet-quota">
            <div>A una cuota de...</div>
            <input
              type="number"
              className="textbox"
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
          <div>
            <button className="btn" onClick={this.createBet}>
              Aceptar
            </button>
          </div>
        </div>
      </Popup>
    );
  }
}
