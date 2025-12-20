// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint amount) external returns (bool);
    function transferFrom(address from, address to, uint amount) external returns (bool);
    function balanceOf(address user) external view returns (uint);
}

contract USDCVault {
    IERC20 public immutable usdc;
    address public feeRecipient;

    uint256 public constant PERFORMANCE_FEE = 50; // 50%

    struct User {
        uint256 deposited;
        uint256 claimed;
    }

    mapping(address => User) public users;
    uint256 public totalDeposits;

    constructor(address _usdc, address _feeRecipient) {
        usdc = IERC20(_usdc);
        feeRecipient = _feeRecipient;
    }

    // ------------------------
    // DEPOSIT
    // ------------------------
    function deposit(uint256 amount) external {
        require(amount > 0, "Zero amount");

        usdc.transferFrom(msg.sender, address(this), amount);

        users[msg.sender].deposited += amount;
        totalDeposits += amount;
    }

    // ------------------------
    // WITHDRAW (PRINCIPAL + YIELD)
    // ------------------------
    function withdraw(uint256 amount) external {
        User storage user = users[msg.sender];
        require(amount > 0, "Zero amount");
        require(amount <= getWithdrawable(msg.sender), "Too much");

        uint256 profit = getProfit(msg.sender);
        uint256 fee = (profit * PERFORMANCE_FEE) / 100;

        if (fee > 0) {
            usdc.transfer(feeRecipient, fee);
        }

        usdc.transfer(msg.sender, amount - fee);

        user.claimed += amount;
    }

    // ------------------------
    // VIEW FUNCTIONS
    // ------------------------
    function getProfit(address userAddr) public view returns (uint256) {
        uint256 balance = usdc.balanceOf(address(this));
        if (totalDeposits == 0) return 0;

        uint256 userShare =
            (balance * users[userAddr].deposited) / totalDeposits;

        if (userShare <= users[userAddr].deposited) return 0;

        return userShare - users[userAddr].deposited;
    }

    function getWithdrawable(address userAddr) public view returns (uint256) {
        return users[userAddr].deposited + getProfit(userAddr)
            - users[userAddr].claimed;
    }
}