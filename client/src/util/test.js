
const xs =  ['x1','x2','x3','x4',].map(el=>Buffer.from(el)); 
const ks =  [['1','10'],['2','20'],['3','30'],['4','40']].map(it=>{
    buff = Buffer.alloc(12);
    buff.writeIntBE(it[0],0,6);
    buff.writeIntBE(it[1],6,6);
    return buff;
});

const merkleTree = new MerkleTree();
const root = merkleTree.L(xs,ks);
const proof = merkleTree.W(0,xs,ks);
const proof1 = merkleTree.W(1,xs,ks);
const proof2 = merkleTree.W(2,xs,ks);
const proof3 = merkleTree.W(3,xs,ks);
console.log('hexxxxxxxxxxxxxxxxxxxxxxxxx');
console.log(root.toString('hex'));
console.log('hexxxxxxxxxxxxxxxxxxxxxxxxx');


// console.log(proof[0].length);
console.log(proof.map(el=>el.toString('hex')));
console.log(proof1.map(el=>el.toString('hex')));
console.log(proof2.map(el=>el.toString('hex')));
console.log(proof3.map(el=>el.toString('hex')));


console.log('---------------------');
var buff1 = Buffer.alloc(6);
buff1.writeIntBE(1,0,6);

const h1 = Buffer.concat([ks[0],(merkleTree.H(xs[0]))])
const h2 = Buffer.concat([ks[1],(merkleTree.H(xs[1]))])
const h3 = Buffer.concat([ks[2],(merkleTree.H(xs[2]))])
const h4 = Buffer.concat([ks[3],(merkleTree.H(xs[3]))])

console.log(h1.toString('hex'))
console.log(h2.toString('hex'))
console.log(h3.toString('hex'))
console.log(h4.toString('hex'))

const h12 = Buffer.concat([ks[1],merkleTree.H(Buffer.concat([buff1, h1,h2]))]);
const h34 = Buffer.concat([ks[3],merkleTree.H(Buffer.concat([buff1, h3,h4]))]);

console.log(h12.toString('hex'))
console.log(h34.toString('hex'))

var buff2 = Buffer.alloc(6);
buff2.writeIntBE(2,0,6);
const h1234 = merkleTree.H(Buffer.concat([buff2, h12,h34]));

console.log(h1234);
// console.log('0x00000000000100000000000a'.length/2);
// console.log('0x97fcb6801f7af5eda3a72046950a7966e5839262'.length/2);
// console.log('0x00000000000100000000000a97fcb6801f7af5eda3a72046950a7966e5839262'.length/2);
