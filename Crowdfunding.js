import "../stylesheets/Crowdfunding.css";

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import funding_artifacts from '../../build/contracts/CrowdFunding.json'

var Voting = contract(CrowdFunding_artifacts);

window.raiseForFunder = function(funder) {
  let FunderName = $("#funder").val();
  try {
    $("#msg").html("Funding has been submitted. The funding count will increment as soon as the funding is recorded on the blockchain. Please wait.")
    $("#funder").val("");

    Voting.deployed().then(function(contractInstance) {
      contractInstance.voteForCandidate(candidateName, {gas: 140000, from: web3.eth.accounts[0]}).then(function() {
        let div_id = funders[FunderName];
        return contractInstance.totalRaisedFor.call(FunderName).then(function(v) {
          $("#" + div_id).html(v.toString());
          $("#msg").html("");
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
}

$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")

    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");

    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  Voting.setProvider(web3.currentProvider);
  let FunderNames = Object.keys(Funder);
  for (var i = 0; i < FunderNames.length; i++) {
    let name = FunderNames[i];
    Voting.deployed().then(function(contractInstance) {
      contractInstance.totalRaisedFor.call(name).then(function(v) {
        $("#" + Funders[name]).html(v.toString());
      });
    })
  }
});
