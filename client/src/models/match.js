import PropTypes from "prop-types";

class Match {}

Match.propTypes = {
  id: PropTypes.string,
  localName: PropTypes.string,
  localImageUrl: PropTypes.string,
  visitorName: PropTypes.string,
  visitorImageUrl: PropTypes.string,
  localScore: PropTypes.number,
  visitorScore: PropTypes.number,
  result: PropTypes.number,
};

export default Match;
