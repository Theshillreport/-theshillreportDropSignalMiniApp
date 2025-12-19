// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address, address, uint256) external returns (bool);
    function transfer(address, uint256) external returns (bool);
}

contract DropSignalVault {
    IERC20 public usdc;
    address public feeReceiver;
    uint256 public constant FEE_BPS = 5000; // 50%

    mapping(address => uint256) public balances;

    constructor(address _usdc, address _feeReceiver) {
        usdc = IERC20(_usdc);
        feeReceiver = _feeReceiver;
    }

    function deposit(uint256 amount) external {
        uint256 fee = amount * FEE_BPS / 10000;
        uint256 net = amount - fee;

        usdc.transferFrom(msg.sender, feeReceiver, fee);
        usdc.transferFrom(msg.sender, address(this), net);

        balances[msg.sender] += net;
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient");
        balances[msg.sender] -= amount;
        usdc.transfer(msg.sender, amount);
    }
}
