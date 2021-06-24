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

    function newContract(bytes32 lock, uint256 expire) public payable {
        require(msg.value > 0);

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

    function _concat(bytes12 a, bytes20 b) internal pure returns (bytes32) {
        return bytes32((uint256(uint96(a)) << 96) | uint160(b));
    }

    function verify(
        bytes32[] memory W,
        bytes32 h,
        uint256 j
    ) public returns (bytes32) {
        bytes32 ln = h;

        for (uint256 i = 0; i < W.length; i++) {
            bytes12 w1 = bytes12(W[i]);
            bytes20 w2 = bytes20(W[i] << 96);

            if (j % 2 == 0) {
                ln = _concat(
                    w1,
                    ripemd160(abi.encodePacked((i + 1), ln, w2))
                );
            } else {
                ln = _concat(
                    w1,
                    ripemd160(abi.encodePacked((i + 1), w2, ln))
                );
            }

            j = j / 2;
        }
        emit Root(ln);
        return ln;
    }
}

// https://ethereum.stackexchange.com/questions/67644/how-to-split-bytes32-into-multiples-of-8-in-solidity
