pragma solidity >=0.4.21 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Market.sol";

contract TestMarket {

  function testItStoresAValue() public {
    Market market = Market(DeployedAddresses.Market());
  }

}
