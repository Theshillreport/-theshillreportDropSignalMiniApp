// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address, address, uint256) external returns (bool);
    function transfer(address, uint256) external returns (bool);
    function balanceOf(address) external view returns (uint256);
}

contract DropSignalVault {
    IERC20 public immutable usdc;
    address public owner;

    uint256 public constant APY = 720; // 7.20%
    uint256 public constant FEE = 20;  // 20% performance fee

    mapping(address => uint256) public deposited;
    mapping(address => uint256) public lastUpdate;

    constructor(address _usdc) {
        usdc = IERC20(_usdc);
        owner = msg.sender;
    }

    function deposit(uint256 amount) external {
        _accrue(msg.sender);
        usdc.transferFrom(msg.sender, address(this), amount);
        deposited[msg.sender] += amount;
    }

    function withdraw(uint256 amount) external {
        _accrue(msg.sender);
        deposited[msg.sender] -= amount;
        usdc.transfer(msg.sender, amount);
    }

    function earned(address user) public view returns (uint256) {
        uint256 time = block.timestamp - lastUpdate[user];
        return (deposited[user] * APY * time) / 10000 / 365 days;
    }

    function claim() external {
        uint256 reward = earned(msg.sender);
        uint256 fee = (reward * FEE) / 100;
        lastUpdate[msg.sender] = block.timestamp;

        usdc.transfer(owner, fee);
        usdc.transfer(msg.sender, reward - fee);
    }

    function _accrue(address user) internal {
        if (lastUpdate[user] == 0) {
            lastUpdate[user] = block.timestamp;
        }
    }
}