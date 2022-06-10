var Bet2Peer = artifacts.require("./Bet2Peer.sol");
ç;
var Bet2Peer = artifacts.require("./Bet2Peer.sol");
var Father = artifacts.require("./Father.sol");

module.exports = function (deployer) {
  deployer.deploy(Father);
  deployer.deploy(Bet2Peer);
};
