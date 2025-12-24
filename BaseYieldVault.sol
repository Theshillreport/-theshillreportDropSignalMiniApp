// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "https://github.com/aave/aave-v3-core/blob/master/contracts/interfaces/IPool.sol";
import "https://github.com/aave/aave-v3-core/blob/master/contracts/dependencies/openzeppelin/contracts/IERC20.sol";

contract BaseYieldVault {
    IPool public aavePool;
    IERC20 public usdc;
    address public owner;

    mapping(address => uint256) public deposits;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    constructor(address _aavePool, address _usdc) {
        aavePool = IPool(_aavePool);
        usdc = IERC20(_usdc);
        owner = msg.sender;
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "Must deposit > 0");
        usdc.transferFrom(msg.sender, address(this), amount);
        usdc.approve(address(aavePool), amount);

        aavePool.supply(address(usdc), amount, address(this), 0);
        deposits[msg.sender] += amount;

        emit Deposited(msg.sender, amount);
    }

    function withdraw() external {
        uint256 userBal = deposits[msg.sender];
        require(userBal > 0, "No deposit");

        uint256 totalAmount = aavePool.withdraw(address(usdc), userBal, msg.sender);
        deposits[msg.sender] = 0;

        emit Withdrawn(msg.sender, totalAmount);
    }

    function getUserDeposit(address user) external view returns (uint256) {
        return deposits[user];
    }

    function getEarnings(address user) external view returns (uint256) {
        // Note: This is simplistic: in reality, Aave earnings are reflected in the aUSDC balance
        uint256 invested = deposits[user];
        uint256 current = usdc.balanceOf(address(this));
        if (current <= invested) return 0;
        return current - invested;
    }

    function getAPY() external pure returns (uint256) {
        return 0;
    }
}