import PropTypes from "prop-types";

class Bet {}

Bet.propTypes = {
  contractAddress: PropTypes.string,
  match: PropTypes.any,
  result: PropTypes.number,
  quantity: PropTypes.number,
  quota: PropTypes.number,
};

export default Bet;
