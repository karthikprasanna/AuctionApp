const Auction = artifacts.require("Auction.sol");

module.exports = async function(deployer) {
    await deployer.deploy(Auction);
};