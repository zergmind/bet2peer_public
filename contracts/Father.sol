/**
 *Submitted for verification at Etherscan.io on 2022-04-22
 */

// Version de solidity del Smart Contract
// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.14;
import "./Bet2Peer.sol";
import "../client/node_modules/@openzeppelin/contracts/access/Ownable.sol";
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

    function createBet() public payable {
    }

    function removeBet(address originalOwner, uint256 matchId) public{
        delete contractsByUserAndMatchId[originalOwner][matchId];
    }


}
