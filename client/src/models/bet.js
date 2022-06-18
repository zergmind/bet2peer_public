import PropTypes from "prop-types";

class Bet {}

Bet.propTypes = {
  contractAddress: PropTypes.string,
  originalOwner: PropTypes.string,
  matchId: PropTypes.string,
  match: PropTypes.any,
  result: PropTypes.number,
  quantity: PropTypes.number,
  quota: PropTypes.number,
  isTheUserTheOwner: PropTypes.bool,
};

export default Bet;
