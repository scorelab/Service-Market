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

  const xs = ['x1', 'x2', 'x3', 'x4',].map(el => Buffer.from(el));
  const ks = [['1', '10'], ['2', '20'], ['3', '30'], ['4', '40']].map(it => {
    buff = Buffer.alloc(12);
    buff.writeIntBE(it[0], 0, 6);
    buff.writeIntBE(it[1], 6, 6);
    return buff;
  });
  const merkleTree = new MerkleTree();
  const root = '0x'+merkleTree.L(xs, ks).toString('hex');
  let proofs = []
  let hashes = []
  xs.forEach((element, index) => {
    proofs[index] = merkleTree.W(index, xs, ks);
    hashes[index] = Buffer.concat([ks[index], merkleTree.H(element)])
  });

  it('inclusion proof level 1', async () => {
    const instance = await Market.deployed();

    for (let index = 0; index < proofs.length; index++) {
      const res = await instance.verify.call(proofs[index], hashes[index], index);
      assert.equal(res,root, xs[index] +":"+ res + "equals to root" + root);
    };

  });

});


// Market.deployed().then(function (instance) { return instance.verify(['0x0000000000020000000000144d71459cafd523aae4d2ad95ffd9004d089f758a', '0x000000000004000000000028634cac8182f43ea5c546ffe6b941c347dd9fd4b5'], '0x00000000000100000000000a97fcb6801f7af5eda3a72046950a7966e5839262', 0); });
// Market.deployed().then(function (instance) { return instance.verify(['0x00000000000300000000001ea9a156906db2920660f922c3ef1ca0ae1a1bcb5e', '0x000000000002000000000014902db885a13406603f17e55348fa398352675c26'], '0x000000000004000000000028105e3ccc6ad34fdf2aa6c65b7548520d8712bb9f', 3); });
// Market.deployed().then(function (instance) { return instance.verify(['0x00000000000300000000001ea9a156906db2920660f922c3ef1ca0ae1a1bcb5e', '0x000000000002000000000014902db885a13406603f17e55348fa398352675c26'], '0x000000000004000000000028105e3ccc6ad34fdf2aa6c65b7548520d8712bb9f', 3); });
// Market.deployed().then(function (instance) { return instance.verify(['0x00000000000300000000001ea9a156906db2920660f922c3ef1ca0ae1a1bcb5e', '0x000000000002000000000014902db885a13406603f17e55348fa398352675c26'], '0x000000000004000000000028105e3ccc6ad34fdf2aa6c65b7548520d8712bb9f', 3); });
// 00000000000100000000000100000000000a97fcb6801f7af5eda3a72046950a7966e58392620000000000020000000000144d71459cafd523aae4d2ad95ffd9004d089f758a
// 00000000000100000000000100000000000a97fcb6801f7af5eda3a72046950a7966e58392620000000000020000000000144d71459cafd523aae4d2ad95ffd9004d089f758a