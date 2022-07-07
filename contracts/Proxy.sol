/**
 *Submitted for verification at Etherscan.io on 2022-04-22
 */

// Version de solidity del Smart Contract
// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.14;
import "../client/node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./IFather.sol";

//defined interface needed to interact with other contract

// Informacion del Smart Contract
// Nombre: Creador de Apuestas
// Logica: Implementa la creación de contratos

// Declaracion del Smart Contract - Auction
contract Proxy is Ownable {

    // ----------- Events -----------
    event Status(string _message);

    //interface contract address
    IFather public businesslogic;
    address businessLogicAddress;

    // ----------- Constructor -----------
    // Uso: Inicializa el Smart Contract - Father
    constructor() {}

    // Uso: indica la dirección del contrato que implementa el BL de la interface IFather
    function setFather(address _businesslogic) external onlyOwner{
        businesslogic = IFather(_businesslogic);
        businessLogicAddress = _businesslogic;
    }

    // -------------------Functions ------------------
    /**
    Funcion
    Función lanzada para cear una nueva apuesta
    _matchId: id del partido de la apuesta
    _result: resultado al que se apuesta
    _originalBet: cantidad apostada
    _minimumCounterBet: cantidad a percibir en caso de ganar
     */
    function createBet(uint256 _matchId, uint8 _result, uint256 _originalBet, uint256 _minimumCounterBet) external payable
    {
        businesslogic.createBet{value: msg.value}(_matchId, _result, _originalBet, _minimumCounterBet);
    }

    /**
    Función para eliminar una apuesta
    _contracto: dirección de la apuesta que se quiere eliminar
    _matchId: id del partido de la apuesta
     */
    function removeBet(address payable _contract) external 
    {
        businesslogic.removeBet(_contract);
    }

    function resolveBet(address payable _contract) external 
    {
        businesslogic.resolveBet(_contract);
    }

    /**
    Función que devuelve todos los contratos(apuestas) creadas por un usuario
    _user: dirección del usuario del que se muestran las apuestas
     */
    function getAllBetsByUser(address _user) external view returns (address[] memory){
        return businesslogic.getAllBetsByUser(_user);
    }

    /**
    Función que devuelve todos los contratos(apuetas) creadas para un partido concreto
    _matchId: id del partido del que se muestran las apuestas
     */
    function getAllBetsByMatchId(uint256 _matchId) external view returns (address[] memory){
        return businesslogic.getAllBetsByMatchId(_matchId);
    }

    function addBetToCounterGambler(address counterGambler, address _sonContract) external payable{
        businesslogic.addBetToCounterGambler(counterGambler, _sonContract);
    }

    function getVersionFather() external view returns (string memory){
        return businesslogic.version();
    }
}