pragma solidity >=0.5.2 <0.8.4;

contract Market {
    struct Contract {
        uint256 amount;
        bytes32 lock;
        uint256 expire;
    }

    mapping(address => Contract[]) contracts;

    event NewContract(uint256 index);
    event Root(bytes32 proofElement);

    function newContract(bytes32 lock) public payable {
        require(msg.value > 0);
        uint256 expire = 10;
        contracts[msg.sender].push(Contract(msg.value, lock, expire));
        uint256 id = contracts[msg.sender].length - 1;
        emit NewContract(id);
    }

    function getContract(address addr, uint256 index)
        public
        view
        returns (
            uint256,
            bytes32,
            uint256
        )
    {
        Contract memory c = contracts[addr][index];
        return (c.amount, c.lock, c.expire);
    }

    function getCount(address a) public view returns (uint256) {
        return contracts[a].length;
    }

    function _concat2(bytes12 a, bytes20 b) internal pure returns (bytes32) {
        return bytes32((uint256(uint96(a)) << 160) | uint160(b));
    }

    function _concat3(
        bytes6 a,
        bytes6 b,
        bytes20 c
    ) internal pure returns (bytes32) {
        bytes12 x = bytes12((uint96(uint48(a)) << 48) | uint48(b));
        bytes32 y = bytes32((uint256(uint96(x)) << 160) | uint160(c));
        return y;
    }

    function _F(
        uint256 j,
        bytes32 ln,
        bytes32 w,
        uint8 layer
    )
        internal
        pure
        returns (
            bytes12 p1,
            bytes32 p2,
            bytes32 p3
        )
    {
        bytes12 w1 = bytes12(w);
        bytes12 ln1 = bytes12(ln);
        if (j % 2 == 0) {
            p1 = w1;
            p2 = ln;
            p3 = w;
        } else {
            p1 = ln1;
            p2 = w;
            p3 = ln;
        }
        if (layer != 1) {
            uint96 sum = uint48(bytes6(w1)) + uint48(bytes6(ln1));
            p1 = bytes12(sum << 48);
        }
    }

    function _k(bytes32 l) internal pure returns (bytes12) {
        return bytes12(uint96(uint48(bytes6(l))) << 48);
    }

    function _x(bytes32 l) internal pure returns (bytes20) {
        return bytes20(uint160(uint256(l)));
    }

    function verify(
        bytes32[] memory W,
        bytes32 h,
        uint256 j,
        uint8 layer
    ) public returns (bytes32) {
        bytes32 ln = h;

        for (uint48 i = 0; i < W.length; i++) {
            uint48 height = i + 1;

            (bytes12 p1, bytes32 p2, bytes32 p3) = _F(j, ln, W[i], layer);
            ln = _concat2(p1, ripemd160(abi.encodePacked(height, p2, p3)));

            j = j / 2;
        }
        emit Root(ln);
        return ln;
    }

    function claim(
        address owner, 
        uint48 index,
        bytes32[] memory W1,
        bytes32[] memory W2,
        bytes32[] memory W3,
        bytes memory x1,
        bytes6 v1,
        bytes6 e1,
        uint48 i1,
        uint48 i2,
        uint48 i3 // bytes32 sig
    ) public {
        bytes32 l = verify(
            W1,
            _concat3(v1, e1, ripemd160(abi.encodePacked(x1))),
            i1,
            1
        );
        l = verify(
            W2,
            _concat2(_k(l), ripemd160(abi.encodePacked(_x(l)))),
            i2,
            2
        );
        l = verify(
            W3,
            _concat2(_k(l), ripemd160(abi.encodePacked(msg.sender, _x(l)))),
            i3,
            3
        );
        Contract memory c = contracts[owner][index];
        if(c.lock == l){
            msg.sender.transfer(uint48(v1));
        }

    }
}