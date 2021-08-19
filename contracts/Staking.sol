// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;
// CAUTION
// This version of SafeMath should only be used with Solidity 0.8 or later,
// because it relies on the compiler's built in overflow checks.

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Staking {

    IERC20 private token;

    using SafeMath for uint256;

    struct Stake {
        address user;
        uint256 amount;
        uint256 since;
    }

    struct Stakeholder {
        address user;
        Stake[] address_stakes;
    }

    constructor (IERC20 _token) {
        token = _token;
        stakeholders.push(); //no staker can have index 0
    }

    Stakeholder[] internal stakeholders;                    // actual stakeholder array with their stakes
    mapping(address => uint256) internal staker_indexes;    // index of a staker in stakeholders array

    event Staked(address indexed _staker, uint256 _amount, uint256 index, uint256 timestamp);


    function isStakeholder(address _address) public view returns (bool, uint256) {
            for(uint256 i = 0; i < stakeholders.length; i++){
                if(_address == stakeholders[i].user) return (true, i);
            }
        return (false, 0);
    }

    function addStakeholder(address _address) internal returns(uint256) {
        (bool _stakeholder, ) = isStakeholder(_address);
        require(!_stakeholder, 'cant add stakeholder because the address already is a stakeholder');
        stakeholders.push();
        uint256 user_idx = stakeholders.length - 1;
        stakeholders[user_idx].user = _address;
        staker_indexes[_address] = user_idx;
        return user_idx;
    }

    function removeStakeholder(address _address) public {
        (bool _stakeholder, uint256 i) = isStakeholder(_address);
        require(_stakeholder, 'cant remove stakeholder because the address is not a stakeholder');
        stakeholders[i] = stakeholders[stakeholders.length - 1];
        stakeholders.pop();
        staker_indexes[_address] = 0;
    }

    function getStake(address _address) public view returns(uint256) {
        (bool isStaker, uint256 staker_index) = isStakeholder(_address);
        require(isStaker, 'address is not a staker');
        uint256 totalStake = 0;
        for(uint256 i = 0; i < stakeholders[staker_index].address_stakes.length - 1; i++){
            totalStake.add(stakeholders[staker_index].address_stakes[i].amount);
        }
        return totalStake;
    }

    function createStake(uint256 _amount) public {
        require(_amount > 0, 'You need to stake some tokens');
        uint256 allowance = token.allowance(msg.sender, address(this));
        require(allowance >= _amount, 'You do not have enough tokens to stake this amount');

        uint timestamp = block.timestamp;
        uint256 user_idx = staker_indexes[msg.sender];
        if(user_idx == 0){
            user_idx = addStakeholder(msg.sender);
        } 

        token.transferFrom(msg.sender, address(this), _amount);
        stakeholders[user_idx].address_stakes.push(Stake(msg.sender, _amount, timestamp));
        emit Staked(msg.sender, _amount, user_idx, timestamp);
    }


}