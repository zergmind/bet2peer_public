import PropTypes from "prop-types";

class Bet {}

Bet.propTypes = {
  match: PropTypes.any,
  result: PropTypes.number,
  quantity: PropTypes.number,
  quota: PropTypes.number,
};

export default Bet;
