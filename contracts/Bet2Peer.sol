/**
 *Submitted for verification at Etherscan.io on 2022-04-22
 */

// Version de solidity del Smart Contract
// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.14;

import "../client/node_modules/@openzeppelin/contracts/access/Ownable.sol";


// Informacion del Smart Contract
// Nombre: Subasta
// Logica: Implementa subasta de productos entre varios participantes

// Declaracion del Smart Contract - Auction
contract Bet2Peer is Ownable {
    // ----------- Variables (datos) -----------
    string public currentMatch;
    enum resultType {
        draw,
        localWin,
        visitorWin
    }
  
    constructor(address originalGambler, uint256 matchId, uint8 result, uint256 originalBet, uint256 minimumCounterBet) {
    }





    function getContractAddress() onlyOwner public view returns (address)  {
        return (address(this));
    }
   
}
