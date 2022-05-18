import PropTypes from "prop-types";

class Match {}

Match.propTypes = {
  id: PropTypes.string,
  localName: PropTypes.string,
  visitorName: PropTypes.string,
  localScore: PropTypes.number,
  visitorScore: PropTypes.number,
  result: PropTypes.number,
};

export default Match;
