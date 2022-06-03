/**
 *Submitted for verification at Etherscan.io on 2022-04-22
 */

// Version de solidity del Smart Contract
// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";


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
  
    // ----------- Constructor -----------
    // Uso: Inicializa el Smart Contract - Auction con: description, precio y tiempo
    constructor(string memory newMatch) {
        currentMatch = newMatch;
        originalOwner = payable(msg.sender);
        activeBet = true;
        // Se emite un Evento
        // emit Status(string(abi.encodePacked("Partido ", newMatch, " creado")));
    }





    function getAddress() onlyOwner public view returns (uint256)  {
        return (totalBet);
    }
   
}
