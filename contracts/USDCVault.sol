// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address, address, uint256) external returns (bool);
    function transfer(address, uint256) external returns (bool);
    function balanceOf(address) external view returns (uint256);
}

contract DropSignalVault {
    IERC20 public usdc;
    address public owner;
    uint256 public performanceFee = 20; // 20%

    mapping(address => uint256) public deposited;

    constructor(address _usdc) {
        usdc = IERC20(_usdc);
        owner = msg.sender;
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "amount = 0");
        usdc.transferFrom(msg.sender, address(this), amount);
        deposited[msg.sender] += amount;
    }

    function withdraw(uint256 amount) external {
        require(deposited[msg.sender] >= amount, "not enough");
        deposited[msg.sender] -= amount;
        usdc.transfer(msg.sender, amount);
    }

    // simulated yield claim (MVP)
    function claimYield(uint256 yieldAmount) external {
        uint256 fee = (yieldAmount * performanceFee) / 100;
        uint256 userAmount = yieldAmount - fee;

        usdc.transfer(owner, fee);
        usdc.transfer(msg.sender, userAmount);
    }
}