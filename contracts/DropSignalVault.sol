// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address user) external view returns (uint256);
}

contract DropSignalVault {
    IERC20 public immutable usdc;
    address public owner;

    uint256 public performanceFee = 2000; // 20% (basis points)
    uint256 constant FEE_DENOMINATOR = 10000;

    mapping(address => uint256) public balances;
    mapping(address => uint256) public deposited;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event FeePaid(address indexed owner, uint256 amount);

    constructor(address _usdc) {
        usdc = IERC20(_usdc);
        owner = msg.sender;
    }

    /* -------- USER -------- */

    function deposit(uint256 amount) external {
        require(amount > 0, "Zero amount");

        usdc.transferFrom(msg.sender, address(this), amount);

        balances[msg.sender] += amount;
        deposited[msg.sender] += amount;

        emit Deposit(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        require(amount > 0, "Zero amount");
        require(balances[msg.sender] >= amount, "Insufficient");

        uint256 principal = deposited[msg.sender];
        uint256 userBalance = balances[msg.sender];

        uint256 profit = 0;
        if (userBalance > principal) {
            profit = userBalance - principal;
        }

        uint256 fee = (profit * performanceFee) / FEE_DENOMINATOR;

        balances[msg.sender] -= amount;

        if (fee > 0) {
            usdc.transfer(owner, fee);
            emit FeePaid(owner, fee);
        }

        usdc.transfer(msg.sender, amount - fee);

        emit Withdraw(msg.sender, amount);
    }

    /* -------- VIEW -------- */

    function balanceOf(address user) external view returns (uint256) {
        return balances[user];
    }

    /* -------- ADMIN -------- */

    function setPerformanceFee(uint256 newFee) external {
        require(msg.sender == owner, "Not owner");
        require(newFee <= 3000, "Max 30%");
        performanceFee = newFee;
    }
}