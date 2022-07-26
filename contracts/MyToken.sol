// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./LinearVesting.sol";

contract MyToken is ERC20, Ownable, LinearVesting {

    struct Benificiar {
        address benificiar;
        uint256 value;
        uint256 vestingStart;
        uint256 vestingEnd;
        uint256 vestingDuration;
        uint256 releaseRate;
        uint256 claimedValue;
    }

    // addresses with values where we will disperse token
    Benificiar[] private _beneficiaries;
    // timestamp when the token vesting is enabled
    uint256 private _vestingStartTime;
    // duration for which token will get dispersed(in seconds)
    uint256 private _vestingDuration;
    // amount of to get released per second
    uint256 private _releaseRate;
     // timestamp when the token vesting is disabled
    uint256 private _vestingEnd;
    
 
    constructor(uint256 initialSupply) ERC20("My Token", "My") {
        _mint(msg.sender, initialSupply * (10**decimals()));
    }

    // add beneficiaries
    function addBenificiar(address address_, uint256 value_)
        external
        onlyOwner
    {
        value_ = value_ * (10**18);
        _beneficiaries.push(
            Benificiar({
                benificiar: address_,
                value: value_,
                vestingStart: 0,
                vestingEnd: 0,
                vestingDuration: 0,
                releaseRate: 0,
                claimedValue: 0
            })
        );
    }

    // get beneficiaries
    function getBenificiaries() public view returns (Benificiar[] memory) {
        return _beneficiaries;
    }

    // get beneficiar
    function getBenificiar(uint256 index_) public view returns (address benificiar, uint256 value) {
        Benificiar storage _beneficiar = _beneficiaries[index_];
        return (_beneficiar.benificiar, _beneficiar.value);
    }

    // add linear vesting
    function addLinearVesting(uint256 vestingDuration_) external onlyOwner {
        require(_vestingStartTime == 0, "Linear vesting already started!");
        _vestingStartTime = block.timestamp;
        _vestingDuration = vestingDuration_;
        _vestingEnd = _vestingStartTime + _vestingDuration;
        for (uint256 index_ = 0; index_ < _beneficiaries.length; index_++) {
            Benificiar storage _beneficiar = _beneficiaries[index_];
            _releaseRate = LinearVesting.setReleaseRate(_vestingDuration, _beneficiar.value);
            _beneficiar.vestingStart = _vestingStartTime;
            _beneficiar.vestingEnd = _vestingEnd;
            _beneficiar.vestingDuration = _vestingDuration;
            _beneficiar.releaseRate = _releaseRate;
        }
    }

    // get amount of to get released per second
    function getBenificiarTokenVested(uint256 index_) public view returns (uint256) {
        Benificiar storage _beneficiar = _beneficiaries[index_];
        uint256 _secondElasped = (block.timestamp - _beneficiar.vestingStart);
        uint256 duration = (_beneficiar.vestingEnd - _beneficiar.vestingStart);
        if (_secondElasped > duration) _secondElasped = duration;
        return (_secondElasped * _beneficiar.releaseRate);
    }

    // add claimed value
    function claim(uint256 index_) external onlyOwner {
        // require(IsBeneficiar(), "Sender not beneficiar");
        Benificiar storage _beneficiar = _beneficiaries[index_];
        _beneficiar.claimedValue = getBenificiarTokenVested(index_);
    }

    // withdraw claimed value
    function withdraw(uint256 value_)  external payable onlyOwner {
        payable(msg.sender).transfer(value_);
    }
}