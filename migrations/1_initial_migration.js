var Father = artifacts.require("../contracts/Father.sol");
var Proxy = artifacts.require("../contracts/Proxy.sol");
var BetStorage = artifacts.require("../contracts/BetStorage.sol");

module.exports = function (deployer) {
  deployer.deploy(Father);
  deployer.deploy(Proxy);
  deployer.deploy(BetStorage);
};
