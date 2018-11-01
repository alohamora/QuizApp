var QuizApp = artifacts.require("./QuizApp.sol");

module.exports = function(deployer) {
  deployer.deploy(QuizApp,10,20,100000,[1,2,3,4],[1,2,3,4]);
};
