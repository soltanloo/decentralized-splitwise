const Splitwise = artifacts.require("Splitwise");

module.exports = function(deployer) {
  deployer.deploy(Splitwise).then(() => {
    console.log("BlockchainSplitwise ADDRESS: " + Splitwise.address);
    console.log("\n\n-----------------\nDEPLOYMENT DONE!\n-----------------\n\n");
  });
};
