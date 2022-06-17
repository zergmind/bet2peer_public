import PropTypes from "prop-types";
import { propTypes } from "react-bootstrap/esm/Image";

class Bet {}

Bet.propTypes = {
  contractAddress: propTypes.string,
  match: PropTypes.any,
  result: PropTypes.number,
  quantity: PropTypes.number,
  quota: PropTypes.number,
};

export default Bet;
