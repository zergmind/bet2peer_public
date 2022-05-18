import PropTypes from "prop-types";

class Bet {}

Bet.propTypes = {
  matchId: PropTypes.string,
  result: PropTypes.number,
  quantity: PropTypes.number,
};

export default Bet;
