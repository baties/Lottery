import web3 from './web3';
const lottery_json = require("./contracts/Lottery.json");

const abi = lottery_json["abi"];
const address = lottery_json["networks"]["1"]["address"];

export default web3.eth.contract(abi).at(address);
