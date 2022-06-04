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
    enum resultType {
        draw,
        localWin,
        visitorWin
    }
    uint256 public currentMatch;
    address payable originalOwner;
    address counterGambler;
    uint8 result;
    uint256 origibalBet;
    uint256 minimumCounterBet;

    bool activeBet;
    bool isAccepted;

    // ----------- Events -----------
    event betCreated (
        string betCreated
    );
    event betAccepted (
        string betAccepted
    );

    /*
     ----------- Constructor -----------
    originalGambler: usuario que crea la apuesta
    matchId: id del partido de la apuesta
    result: resultado al que se apuesta
    originalBet: cantidad apostada
    minimumCounterBet: cantidad a percibir en caso de ganar
    */
    constructor(address _originalGambler, uint256 _matchId, uint8 _result, uint256 _originalBet, uint256 _minimumCounterBet) {
        originalOwner = payable(_originalGambler);
        currentMatch = _matchId;
        result = _result;
        origibalBet = _originalBet;
        minimumCounterBet = _minimumCounterBet;
        activeBet = true;
        // Se emite un Evento
        emit betCreated(string(abi.encodePacked("Partido ", _matchId, " creado")));
    }

    function acceptBet() public payable {
        require(msg.value >= minimumCounterBet, "Apuesta insuficiente");
        counterGambler = msg.sender;
        emit betAccepted(string(abi.encodePacked(counterGambler, " accepted the bet of ", originalOwner)));
    }

    function resolveBet() public payable{
        //desactivamos le contrato
        activeBet = false;
        //transferimos las ganancias al usuario
        originalOwner.transfer(address(this).balance);
    }

    function getContractAddress() onlyOwner public view returns (address)  {
        return address(this);
    }

    function removeBet() public payable onlyOwner{
        require(!isAccepted, "La apuesta ya ha sido aceptada");
        originalOwner.transfer(address(this).balance);
        //delete contractsByMatchIdAndUser[originalOwner][matchId];
    }
   
}
