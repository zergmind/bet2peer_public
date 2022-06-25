import React, { Component } from "react";
import { BetList } from "./bet-list";

export class Match extends Component {
  componentDidMount = async () => {
    const showMatchBets = false;

    this.setState({ showMatchBets });
  };

  render() {
    return (
      <div className="match-and-bets">
        <div className="match-container">
          {/* ESTO ESTÁ DUPLICADO EN MATCH DESCRIPTION MEJORAR EN EL FUTURO */}
          <div className="team-local">
            <div className="team-name">{this.props.match.localName}</div>
            <img src={this.props.match.localImageUrl} alt="equipo_local" />
          </div>
          {/* <div className="vs">vs</div> */}
          <div className="vs">
            <img className="vs-image" src="/img/vs.png" alt="vs" />
          </div>
          <div className="team-visitor">
            <img
              src={this.props.match.visitorImageUrl}
              alt="equipo_visitante"
            />
            <div className="team-name">{this.props.match.visitorName}</div>
          </div>
          {this.props.match.bets && this.props.match.bets.length > 0 ? (
            <div
              className="show-bets"
              onClick={() => {
                this.setState({ showMatchBets: !this.state.showMatchBets });
              }}
            >
              {this.state.showMatchBets ? (
                <span className="hide-bets"> Ocultar apuestas</span>
              ) : (
                <span>Ver apuestas disponibles</span>
              )}
            </div>
          ) : (
            <div className="show-bets"></div>
          )}
          <div className="btn-create-bet">
            <button
              className="btn"
              onClick={() =>
                this.props.showPopupCreateBetFunction(this.props.match)
              }
            >
              Crear apuesta
            </button>
          </div>
        </div>
        {this.state && this.state.showMatchBets ? (
          <BetList
            bets={this.props.match.bets}
            currentSymbol={this.props.currentSymbol}
            showPopupAcceptBetFunction={this.props.showPopupAcceptBetFunction}
          ></BetList>
        ) : null}
      </div>
    );
  }
}
