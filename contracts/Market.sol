pragma solidity >=0.5.2 <0.8.4;

contract Market {

  struct Contract {
    uint amount;
    bytes32 lock;
    uint expire;
  }

  mapping (address => Contract[]) contracts;
  
  event NewContract(uint index);   


  function newContract(bytes32 lock, uint expire) payable public{
    require(msg.value > 0);

    contracts[msg.sender].push(Contract(msg.value, lock, expire));
    uint id = contracts[msg.sender].length - 1;
    emit NewContract(id); 
  }
  
  function getContract(address addr, uint index) public view returns (uint, bytes32, uint) {
    Contract memory c = contracts[addr][index];
    return (c.amount, c.lock, c.expire);
  }

  function getCount(address a) public view returns (uint) {
    return contracts[a].length;
  }
}
