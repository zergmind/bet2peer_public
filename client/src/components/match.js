import React, { Component } from "react";
import { BetList } from "./bet-list";

export class Match extends Component {
  componentDidMount = async () => {
    const showBets = false;
    this.setState({ showBets });
  };

  render() {
    return (
      <div className="match-and-bets">
        <div className="match-container">
          {this.props.match.bets && this.props.match.bets.length > 0 ? (
            <div
              className="show-bets"
              onClick={() => {
                this.setState({ showBets: !this.state.showBets });
              }}
            >
              {this.state.showBets ? (
                <span className="hide-bets">
                  {" "}
                  Ocultar {this.props.match.bets.length} apuestas
                </span>
              ) : (
                <span className="show-bets">
                  Mostrar {this.props.match.bets.length} apuestas
                </span>
              )}
            </div>
          ) : (
            <div className="no-bets">No hay apuestas</div>
          )}

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
          <div className="btn-create-bet">
            <button
              className="btn"
              onClick={() => this.props.createBetFunction(this.props.match.id)}
            >
              Nueva apuesta
            </button>
          </div>
        </div>
        {this.state && this.state.showBets ? (
          <BetList bets={this.props.match.bets}></BetList>
        ) : null}
      </div>
    );
  }
}
