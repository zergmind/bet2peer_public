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
    Bet2Peer public bet;
    //dirección del creador de la apuesta
    address payable contractOwner;

    //mapping de todos los contratos(apuestas) creados por un usuario 
    //      usuario     contrato
    mapping(address =>  address[]) private contractsByUser;
    //mapping de todos los contratos(apuestas) creados para un partido concreto
    //      matchId    contrato
    mapping(uint256 => address[]) private contractsByMatchId;
    //mapping de todos los contratos(apuestas) creados por un usuario con su contractId y MatchId
    //      usuario            matchId    contrato
    mapping(address => mapping(uint256 => address[])) private contractsByMatchIdAndUser;
    
    //Estado del contrato
    bool activeContract;

    // ----------- Events -----------
    event Status(string _message);

    // ------------Modifiers ----------
    modifier contractActive() {
        require(activeContract, "Sorry, contract disabled");
        _;
    }

    // ----------- Constructor -----------
    // Uso: Inicializa el Smart Contract - Father
    constructor() {
        contractOwner = payable(msg.sender);
        activeContract = true;
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
    function createBet(uint256 _matchId, uint8 _result, uint256 _originalBet, uint8 _minimumCounterBet) public payable 
        contractActive
    {
        //Creo un nuevo contrato hijo para la apuesta
        bet = new Bet2Peer(msg.sender, _matchId, _result, _originalBet, _minimumCounterBet, address(this));
        //Añado la dirección del contrato a los mapas del usuario y del partido
        contractsByUser[msg.sender].push(bet.getContractAddress());
        contractsByMatchId[_matchId].push(bet.getContractAddress());
        emit Status("Bet created");
    }

    /**
    Función para eliminar una apuesta
    _contracto: dirección de la apuesta que se quiere eliminar
    _matchId: id del partido de la apuesta
     */
    function removeBet(address _contract) public
        contractActive
    {
        //Asigno a la variable bet el contrato hijo en cuestión
        bet = Bet2Peer(_contract);
        require(bet.getOriginalOwner() == msg.sender, "No eres el creador de esta apuesta");
        //busco el index del contrato en los arrays del usurio y partido
        uint256 _index = indexOf(contractsByUser[msg.sender], _contract);
        uint256 _index2 = indexOf(contractsByMatchId[bet.getMatchId()], _contract);
        //si el contrato se desactiva correctamente elimino el address de los arrays
        if(bet.removeBet()){
            delete contractsByUser[msg.sender][_index];
            delete contractsByMatchId[bet.getMatchId()][_index2];
        }
    }

    /**
    Función que devuelve todos los contratos(apuestas) creadas por un usuario
    _user: dirección del usuario del que se muestran las apuestas
     */
    function getAllBetsByUser(address _user) public view returns (address[] memory){
        return contractsByUser[_user];
    }

    /**
    Función que devuelve todos los contratos(apuetas) creadas para un partido concreto
    _matchId: id del partido del que se muestran las apuestas
     */
    function getAllBetsByMatchId(uint256 _matchId) public view returns (address[] memory){
        return contractsByMatchId[_matchId];
    }

    /**
    Función que devuelve si el contrato está activo o no
     */
    function isActive() public view returns (bool){
        return (activeContract);
    }

    /**
    Función que devuelve la posición de un elemento de un array
    _arr: array en el que se busca el elemento
    _searchFor: elemento que se busca
     */
    function indexOf(address[] memory _arr, address _searchFor) private pure returns (uint256) {
    for (uint256 i = 0; i < _arr.length; i++) {
      if (_arr[i] == _searchFor) {
        return i;
      }
    }
    revert("Not Found");
  }


////////////////////////////Panic Functions////////////////////////
    // Funcion
    // Nombre: stopContract
    // Uso: pausa el contrato y saca todos los fondos en caso de emergencia
    function stopContract() public {
        require(msg.sender == contractOwner, "You must be the original OWNER");
        // Finaliza la subasta
        activeContract = false;
        // Devuelve el dinero al maximo postor
        contractOwner.transfer(address(this).balance);
        
        // Se emite un evento
        emit Status("El contrato se ha parado");
    }
}
