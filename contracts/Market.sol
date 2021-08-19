pragma solidity >=0.5.2 <0.8.4;
pragma experimental ABIEncoderV2;

contract Market {

    struct Contract {
        uint256 amount;
        bytes32 lock;
        uint256 expire;
        uint48 claimed_value;
    }
    
    struct Witness {
        bytes32[] W1;
        bytes32[] W2;
        bytes32[] W3;
    }

    mapping(address => Contract) contracts;
    mapping (address => mapping (uint48 => mapping(uint48=>bool))) private claims;
    
    event NewContract(uint256 index);
    event Root(bytes32 proofElement);
    event Root20(bytes20 proofElement);
    event Test(uint48 test);

    function newContract(bytes20 lock, uint256 expire ) public payable {
        require(msg.value > 0);
        contracts[msg.sender] = Contract(
            {
                amount: msg.value,
                lock:lock,
                expire:expire,
                claimed_value:0
            }
        );
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

    function refund() public payable {
        address payable owner = msg.sender;
        Contract memory c = contracts[owner];
        if(c.expire < block.timestamp){
            delete contracts[owner];
            // delete claims[owner];
            owner.transfer(c.amount - c.claimed_value);
        }
    }
    
     function is_valid_signature(
        address signer,
        address sender,
        bytes20 value,
        bytes20 expire,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal pure returns(bool) {
        return ecrecover( ripemd160(abi.encodePacked(sender, value, expire)), v, r, s) == signer;
    }
    
    
    function verify(
        bytes32[] memory W,
        bytes32 h,
        uint256 j,
        uint8 layer
    ) internal  pure returns (bytes32) {
        bytes32 ln = h;

        for (uint48 i = 0; i < W.length; i++) {
            uint48 height = i + 1;

            (bytes12 p1, bytes32 p2, bytes32 p3) = _F(j, ln, W[i], layer);
            ln = _concat2(p1, ripemd160(abi.encodePacked(height, p2, p3)));

            j = j / 2;
        }
        return ln;
    }

    function claim(
        address owner,
        Witness memory witness,
        bytes memory x1,
        bytes6 v1,
        bytes6 e1,
        uint48 i1,
        uint48 i2,
        uint48 i3, // bytes32 sig
        uint8 v, bytes32 r, bytes32 s
    ) public payable {

        //already claimed check
        require(!claims[owner][i1][i2]);

        //signature verification
        require(is_valid_signature(owner, msg.sender, v1, e1, v, r, s));

        bytes32 l;
        {
        //level alpha check
        l = verify(
            witness.W1,
            _concat3(v1, e1, ripemd160(abi.encodePacked(x1))),
            i1,
            1
        );

        //level beta check
        l = verify(
            witness.W2,
            _concat2(_k(l), _x(l)),
            i2,
            2
        );

        //level theta check
        l = verify(
            witness.W3,
            _concat2(_k(l), ripemd160(abi.encodePacked(msg.sender, _x(l)))),
            i3,
            3
        );
        }
        
        Contract memory c = contracts[owner];
        //root lock verification
        if(c.lock == _x(l)){
            claims[owner][i1][i2] = true; // add to claimed list
            c.claimed_value = c.claimed_value + uint48(v1); 
            address payable sender = msg.sender;
            sender.transfer(uint48(v1)); // transfer money
        }

    }
}