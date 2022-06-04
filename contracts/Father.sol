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
    //Contrato hijo
    Bet2Peer public newBet;
    //dirección del creador de la apuesta
    address payable contractOwner;

    //mapping de todos los contratos(apuestas) creados para un partido concreto con su contractId
    //      matchId    contrato
    mapping(uint256 => address[]) private contractsByMatchId;
    //mapping de todos los contratos(apuestas) creados por un usuario 
    //      usuario     contrato
    mapping(address =>  address[]) private contractsByUser;
    //mapping de todos los contratos(apuestas) creados por un usuario con su contractId y MatchId
    //      usuario            matchId    contrato
    mapping(address => mapping(uint256 => address[])) private contractsByMatchIdAndUser;
    
    //Estado del contrato
    bool activeContract;

    // ----------- Events -----------
    event Status(string _message);

    // ----------- Constructor -----------
    // Uso: Inicializa el Smart Contract - Father
    constructor() {
        contractOwner = payable(msg.sender);
        activeContract = true;
    }

    /*
    Funcion
    Función lanzada para cear una nueva apuesta
    matchId: id del partido de la apuesta
    result: resultado al que se apuesta
    originalBet: cantidad apostada
    minimumCounterBet: cantidad a percibir en caso de ganar
    */
    function createBet(uint matchId, uint8 result, uint originalBet, uint minimumCounterBet) public payable {
        newBet = new Bet2Peer(msg.sender, matchId, result, originalBet, minimumCounterBet);
        contractsByMatchIdAndUser[msg.sender][matchId].push(newBet.getContractAddress());
    }

    function removeBet(address originalOwner, uint256 matchId) public{
        delete contractsByMatchIdAndUser[originalOwner][matchId];
    }

    /**
    Función que devuelve todos los contratos(apuestas) creadas por un usuario
     */
    function getBetsByUser(address originalOwner) public view returns (address[] memory){
        return contractsByUser[originalOwner];
    }
    /**
    Función que devuelve todos los contratos(apuetas) creadas para un partido 
    concreto
     */
    function getBetsByMatchId(uint256 matchId) public view returns (address[] memory){
        return contractsByMatchId[matchId];
    }

    // function getMatchesByUser(uint256 matchId, address originalOwner) public view returns (mapping(uint256 => address)){
    //     return contractsByMatchIdAndUser[originalOwner];
    // }

    function isActive() public view returns (bool){
        return (activeContract);
    }


////////////////////////////Panic Functions////////////////////////
    // Funcion
    // Nombre: stopContract
    // Uso:    
    function stopContract() public {
        require(msg.sender == contractOwner, "You must be the original OWNER");
        // Finaliza la subasta
        activeContract = false;
        // Devuelve el dinero al maximo postor
        contractOwner.transfer(address(this).balance);
        
        // Se emite un evento
        emit Status("La subasta se ha parado");
    }
}
