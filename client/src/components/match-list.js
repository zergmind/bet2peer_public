import React, { Component } from "react";
import { Match } from "./match.js";

export class MatchList extends Component {
  render() {
    return (
      <ul>
        {this.props.matches ? (
          this.props.matches.map((match) => (
            <li className="match-and-bet-container" key={match.id}>
              <Match
                createBetFunction={this.props.createBetFunction}
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
