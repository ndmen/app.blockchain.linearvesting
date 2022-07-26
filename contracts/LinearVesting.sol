// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LinearVesting {
    uint256 private _releaseRate;

    // get _releaseRate, amount of to get released per second
    function setReleaseRate(uint256 vestingDuration_, uint256 value_) public returns (uint256) {
        _releaseRate = (value_ * 60 * 60) / vestingDuration_;
        return _releaseRate;
    }
}