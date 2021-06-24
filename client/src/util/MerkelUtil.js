const { ripemd160 } = require('ethereumjs-util');

class MerkleTree {
    concat (...args) {
        return Buffer.concat([...args]);
    }

    F(X,K){
        return K.slice(-1)[0]
    }

    height(X){
        return Buffer.from(Math.log(X.length,2).toFixed(0));
    }

    H(arg){
        return ripemd160(arg)
    }

    L(X,K) {
        const l = X.length
        if(l == 1){
            return this.concat(K[0],this.H(X[0]));
        }
        let j = Math.pow(2,(Math.log(l,2)).toFixed(0));
        if(j == l){
            j = Math.pow(2,(Math.log(l-1,2)).toFixed(0));
        }
        return this.concat(
            this.F(X,K), 
            this.H(
                this.concat(
                    this.height(X),
                    this.L(X.slice(0,j),K.slice(0,j)),
                    this.L(X.slice(j,l),K.slice(j,l))
                )
            )
        );
        
    }

    W(i,X,K){
        const l = X.length
        if(l == 1){
            return [];
        }
        let j = Math.pow(2,(Math.log(l,2)).toFixed(0));
        if(j == l){
            j = Math.pow(2,(Math.log(l-1,2)).toFixed(0));
        }
        if(i<j){
            return this.W(i,X.slice(0,j),K.slice(0,j)).concat([(this.F(X,K),this.L(X.slice(j,l),K.slice(j,l)))]);
        }else{
            return this.W(i-j,X.slice(j,l),K.slice(j,l)).concat([(this.F(X,K),this.L(X.slice(0,j),K.slice(0,j)))]);
        }
    }

}

module.exports = {
    MerkleTree,
};