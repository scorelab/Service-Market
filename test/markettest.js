const Market = artifacts.require("./Market.sol");
const { log } = require('console');
const { MerkleTree } = require('../client/src/util/MerkelUtil.js');

contract("Market", accounts => {
  // it("count should not equal", async () => {
  //   const marketInstance = await Market.deployed();
  //   const count1 = await marketInstance.getCount(accounts[0]);

  //   // Set value of 89
  //   await marketInstance.newContract(
  //     '0x0f31bdf0066c0c385f5b2ea33ea64a59d64b912f3e7f753960ceda7c21910a73',
  //     343434343,
  //     { from: accounts[0], gas: 1000000, value: 3000000, }
  //   );

  //   // Get stored value
  //   const count2 = await marketInstance.getCount(accounts[0]);
  //   assert.equal(parseInt(count1) + 1, count2, 'count should increase.');
  // });

  it('should return true for a valid leaf', async function () {
    const marketInstance = await Market.deployed();

    const xs =  ['x1','x2','x3','x4',].map(el=>Buffer.from(el)); 
    const ks =  [['1','10'],['2','20'],['3','30'],['4','40']].map(it=>Buffer.from(it));
    const merkleTree = new MerkleTree();

    const root = merkleTree.L(xs,ks);
    console.log(root);

    const proof = merkleTree.W(0,xs,ks);
    console.log(proof);

    const r = await marketInstance.verify.call(proof, merkleTree.H(xs[0]),0);
    assert.equal(r,root.toString('hex'),'root')
  });

});
