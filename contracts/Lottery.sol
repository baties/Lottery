pragma solidity ^0.4.24;
///pragma solidity >= 0.5.0 < 0.7.0;

contract Lottery {
  address public manager;
  address[] public players;

  modifier managerOnly() {
    require(msg.sender == manager);
    _;
  }

  constructor() public {
    manager = msg.sender ;
  }

  function enter() public payable {
    require(msg.value > 0.1 ether);
    players.push(msg.sender);
  }

  function selectWinner() public managerOnly {
    uint winnerIndex = pseudoRandom() % players.length;
    players[winnerIndex].transfer(address(this).balance);

    players = new address[](0);
  }

  function pseudoRandom() private view returns (uint) {
    return uint(
      keccak256(
        abi.encodePacked(
          block.difficulty, now, players )));
  }

  function getPlayers() public view returns (address[]){
    return players;
  }
}
