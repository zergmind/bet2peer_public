/**
 *Submitted for verification at Etherscan.io on 2022-04-22
 */

// Version de solidity del Smart Contract
// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.14;
import "./Bet2Peer.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
// Informacion del Smart Contract
// Nombre: Creador de Apuestas
// Logica: Implementa la creación de contratos

// Declaracion del Smart Contract - Auction
contract Father {
    // ----------- Variables (datos) -----------
    mapping(address => mapping(uint256 => address)) private contractsByUserAndMatchId;

    // ----------- Constructor -----------
    // Uso: Inicializa el Smart Contract - Auction con: description, precio y tiempo
    constructor(string memory newMatch) {
        
        
        
    }

function createBet(uint256 result) public payable {
    Bet2Peer betContract = new Bet2Peer(newMatch);
}


}
