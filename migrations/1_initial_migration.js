var Father = artifacts.require("../contracts/Father.sol");

module.exports = function(deployer) {
  deployer.deploy(Father);
};
