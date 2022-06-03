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
    //mapping de todos los contratos creados por un usuario con su contractId y MatchId
    mapping(address => mapping(uint256 => address)) private contractsByUserAndMatchId;
    
    //Estado del contrato
    bool activeContract;

    // ----------- Constructor -----------
    // Uso: Inicializa el Smart Contract - Auction con: description, precio y tiempo
    constructor(string memory newMatch) {
        activeContract = true;
    }

    function createBet(uint256 result) public payable {
        Bet2Peer betContract = new Bet2Peer(originalGambler, newMatch ,result, originalBet, minimunCounterBet);
    }

    function isActive() public view returns (bool){
        return (activeContract);
    }

    function getBets() public returns (address){
        return();
    }

////////////////////////////Panic Functions////////////////////////
    // Funcion
    // Nombre: stopAuction
    // Uso:    Para la subasta y devuelve el dinero al maximo postor
    function stopAuction() public isOwner{
        require(msg.sender == originalOwner, "You must be the original OWNER");
        // Finaliza la subasta
        activeContract = false;
        // Devuelve el dinero al maximo postor
        highestBidder.transfer(address(this).balance);
        
        // Se emite un evento
        emit Status("La subasta se ha parado");
    }
}
