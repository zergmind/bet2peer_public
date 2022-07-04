/**
 *Submitted for verification at Etherscan.io on 2022-04-22
 */

// Version de solidity del Smart Contract
// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.14;

interface IFather {

    function createBet(uint256 _matchId, uint8 _result, uint256 _originalBet, uint256 _minimumCounterBet) external payable;
  
    function removeBet(address payable _contract) external;

    function resolveBet(address payable _contract) external;
     
   
    function getAllBetsByUser(address _user) external view returns (address[] memory);

    function getAllBetsByMatchId(uint256 _matchId) external view returns (address[] memory);

    function addBetToCounterGambler(address counterGambler, address _sonContract) external payable;


    function isActive() external view returns (bool);

    function version() external pure returns (string memory);
 
}