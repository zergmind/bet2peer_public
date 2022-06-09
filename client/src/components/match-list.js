import React, { Component } from "react";
import { Match } from "./match.js";

export class MatchList extends Component {
  render() {
    return (
      <ul className="match-list">
        {this.props.matches ? (
          this.props.matches.map((match) => (
            <li className="match-and-bet-container" key={match.id}>
              <Match
                showPopupAcceptBetFunction={
                  this.props.showPopupAcceptBetFunction
                }
                showPopupCreateBetFunction={
                  this.props.showPopupCreateBetFunction
                }
                match={match}
              ></Match>
            </li>
          ))
        ) : (
          <li>Cargando los partidos...</li>
        )}
      </ul>
    );
  }
}
