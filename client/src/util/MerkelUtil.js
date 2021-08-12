const { ripemd160, toBuffer } = require('ethereumjs-util');

class MerkleTree {
    concat(...args) {
        return Buffer.concat([...args]);
    }


    F(X, K, layer) {
        switch (layer) {
            case 1:
                return K.slice(-1)[0]
            default:
                const sum = K.map(el => el.readIntBE(0, 6)).reduce((a, b) => a + b, 0)
                const b = Buffer.alloc(12);
                b.writeIntBE(sum, 0, 6);
                return b
        }
    }

    root_slice(root){
        const value = parseInt(root.slice(0, 6).toString('hex'), 16);
        const lock = '0x'+root.slice(12, 32).toString('hex');
        return [value, lock];
    }

    height(l) {
        const h = Math.log2(l).toFixed(0);
        const buff = Buffer.alloc(6);
        buff.writeIntBE(h, 0, 6);
        return buff;
    }

    H(arg) {
        if (Buffer.isBuffer(arg)) {
            return ripemd160(arg);
        } else {
            return ripemd160(toBuffer(arg));
        }
    }

    L(X, K, layer) {
        const l = X.length
        if (l == 1) {
            return this.concat(K[0], X[0]);
        }

        let j = Math.pow(2, Math.trunc(Math.log2(l)));
        if (j == l) {
            j = Math.pow(2, Math.trunc(Math.log2(l - 1)));
        }
        return this.concat(
            this.F(X, K, layer),
            this.H(
                this.concat(
                    this.height(l),
                    this.L(X.slice(0, j), K.slice(0, j), layer),
                    this.L(X.slice(j, l), K.slice(j, l), layer)
                )
            )
        );
    }

    W(i, X, K, layer) {
        const l = X.length
        if (l == 1) {
            return [];
        }
        let j = Math.pow(2, Math.trunc(Math.log2(l)));
        if (j == l) {
            j = Math.pow(2, Math.trunc(Math.log2(l - 1)));
        }
        if (i < j) {
            return this.W(i, X.slice(0, j), K.slice(0, j), layer).concat(
                [(
                    this.F(X, K, layer),
                    this.L(X.slice(j, l), K.slice(j, l), layer)
                )]
            );
        } else {
            return this.W(i - j, X.slice(j, l), K.slice(j, l), layer).concat(
                [(
                    this.F(X, K, layer),
                    this.L(X.slice(0, j), K.slice(0, j), layer)
                )]
            );
        }
    }

    P(k) {
        console.log(k.toString('hex'));
    }

    PA(msg, k) {
        console.log(msg, k.map(e => e.toString('hex')));
    }

    LL(K) {
        var ks3 = []
        var xs3 = []

        Object.entries(K).forEach(([a, keys3]) => {
            var ks2 = []
            var xs2 = []
            keys3.forEach(keys2 => {
                const k2 = this.L(keys2[0], keys2[1], 1);
                xs2.push(k2.slice(12, 32))
                ks2.push(k2.slice(0, 12).fill(0, 6, 12))
            });

            const k3 = this.L(xs2, ks2, 2);
            const h3 = k3.slice(12, 32);
            const address = toBuffer(a);
            xs3.push(Buffer.concat([address, h3]));
            ks3.push(k3.slice(0, 12).fill(0, 6, 12));
        });
        return this.L(xs3, ks3, 3);
    }

    WW(K, i1, i2, i3) {
        var proofs = {}
        var ks3 = []
        var xs3 = []
        Object.entries(K).forEach(([a, keys2], index2) => {
            var ks2 = []
            var xs2 = []
            keys2.forEach((keys1, index1) => {
                const k2 = this.L(keys1[0], keys1[1], 1);
                if (index1 == i2 & index2 == i3) {
                    const w1 = this.W(i1, keys1[0], keys1[1], 1);
                    proofs[1] = w1;
                    // this.PA('witness1', w1);
                }
                xs2.push(k2.slice(12, 32));
                ks2.push(k2.slice(0, 12).fill(0, 6, 12));
            });
            const k3 = this.L(xs2, ks2, 2);
            if (index2 == i3) {
                const w2 = this.W(i2, xs2, ks2, 2);
                proofs[2] = w2;
                // this.PA('witness2', w2);
            }
            const h = k3.slice(12, 32);
            const address = toBuffer(a);
            xs3.push(Buffer.concat([address, h]));
            ks3.push(k3.slice(0, 12).fill(0, 6, 12));

        });
        const res = this.L(xs3, ks3, i3);
        const w3 = this.W(i3, xs3, ks3, 3);
        proofs[3] = w3;
        // this.PA('witness3', w3);
        // this.P(res);
        return proofs;
    }


}


export {
    MerkleTree,
};