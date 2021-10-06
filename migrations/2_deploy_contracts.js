const SimpleStorage = artifacts.require("./SimpleStorage.sol");
const Auction = artifacts.require("./Auction.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Auction);
};
