// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address user) external view returns (uint256);
}

contract DropSignalVault {
    IERC20 public immutable usdc;
    address public owner;

    uint256 public feeBps = 100; // 1%
    uint256 public totalDeposits;

    mapping(address => uint256) public balances;

    constructor(address _usdc) {
        usdc = IERC20(_usdc);
        owner = msg.sender;
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "amount = 0");

        uint256 fee = (amount * feeBps) / 10_000;
        uint256 net = amount - fee;

        usdc.transferFrom(msg.sender, address(this), amount);
        usdc.transfer(owner, fee);

        balances[msg.sender] += net;
        totalDeposits += net;
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "insufficient");

        balances[msg.sender] -= amount;
        totalDeposits -= amount;

        usdc.transfer(msg.sender, amount);
    }

    function setFee(uint256 newFeeBps) external {
        require(msg.sender == owner, "not owner");
        require(newFeeBps <= 300, "max 3%");
        feeBps = newFeeBps;
    }
}