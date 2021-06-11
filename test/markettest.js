const Market = artifacts.require("./Market.sol");

contract("Market", accounts => {
  it("count should not equal", async () => {
    const marketInstance = await Market.deployed();
    const count1 = await marketInstance.getContractCount(accounts[0]);

    // Set value of 89
    await marketInstance.newContract(
      '0x0f31bdf0066c0c385f5b2ea33ea64a59d64b912f3e7f753960ceda7c21910a73',
      343434343,
      { from: accounts[0], gas: 1000000, value: 3000000, }
    );

    // Get stored value
    const count2 = await marketInstance.getContractCount(accounts[0]);
    assert.equal(parseInt(count1)+1,count2 ,'count should increase.' );
  });
});
