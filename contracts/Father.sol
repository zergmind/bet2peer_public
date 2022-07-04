/**
 *Submitted for verification at Etherscan.io on 2022-04-22
 */

// Version de solidity del Smart Contract
// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.14;
import "./IFather.sol";
import "./Bet2Peer.sol";
import "./BetStorage.sol";
import "../client/node_modules/@openzeppelin/contracts/access/Ownable.sol";

// Informacion del Smart Contract
// Nombre: Creador de Apuestas
// Logica: Implementa la creación de contratos

// Declaracion del Smart Contract - Auction
contract Father is IFather, Ownable{

    // ----------- Variables (datos) -----------
    //Contrato hijo
    Bet2Peer public bet;
    
    BetStorage _betStorage;
   
    // ----------- Events -----------
    event Status(string _message);

    // ------------Modifiers ----------
    modifier contractActive() {
        require(_betStorage.isContractActive(), "Sorry, contract disabled");
        _;
    }

    //set the address of the storage contract that this contract should user
    //all functions will read and write data to this contract
    function setStorageContract(address _storageAddress) public {
        _betStorage = BetStorage(_storageAddress);    
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
    function createBet(uint256 _matchId, uint8 _result, uint256 _originalBet, uint256 _minimumCounterBet) override external payable 
        contractActive
    {
         //Creo un nuevo contrato hijo para la apuesta
        bet = new Bet2Peer(msg.sender, _matchId, _result, _originalBet, _minimumCounterBet, address(this));
        // address contractAddress = address(bet);
        address payable payableContractAddress = payable(address(bet));
        // address payable payableContractAddress = address(uint160(contractAddress));
        payableContractAddress.transfer(msg.value);

        // payable(bet).transfer(msg.value);
        //Añado la dirección del contrato a los mapas del usuario y del partido
        _betStorage.pushContractsByUser(msg.sender, bet.getContractAddress());
        _betStorage.pushContractsByMatchId(_matchId, bet.getContractAddress());
                       
        emit Status("Bet created");
    }  

    /**
    Función para eliminar una apuesta
    _contracto: dirección de la apuesta que se quiere eliminar
    _matchId: id del partido de la apuesta
     */
    function removeBet(address payable _contract) override external 
        contractActive
    {
        //Asigno a la variable bet el contrato hijo en cuestión
        bet = Bet2Peer(_contract);
        require(bet.getOriginalOwner() == msg.sender, "No eres el creador de esta apuesta");
        //si el contrato se desactiva correctamente elimino el address de los arrays
        if(bet.removeBet(msg.sender)){
            //busco el index del contrato en los arrays del usurio y partido
            uint256 _userContractIndex = indexOf(_betStorage.getContractsByUser(msg.sender), _contract);
            uint256 _matchContractIndex = indexOf(_betStorage.getContractsByMatchId(bet.getMatchId()), _contract);
            _betStorage.removeBetFromUser(msg.sender, _userContractIndex);
            _betStorage.removeBetFromMatchId(bet.getMatchId(), _matchContractIndex);
        }

    }

    /**
    Función para resolver apuesta
    _contracto: dirección de la apuesta que se quiere resolver
     */
    function resolveBet(address payable _contract) override external
        contractActive
    {
        //Asigno a la variable bet el contrato hijo en cuestión
        bet = Bet2Peer(_contract);

        //si el contrato se desactiva correctamente elimino el address de los arrays
        if(bet.resolveBet(msg.sender)){
            //busco el index del contrato en los arrays del usurio y partido
            address originalOwner = bet.getOriginalOwner();
            address counterGambler = bet.getCounterGambler();
            uint256 _originalOwnerContractIndex = indexOf(_betStorage.getContractsByUser(msg.sender), _contract);
            uint256 _counterGamblerContractIndex = indexOf(_betStorage.getContractsByUser(msg.sender), _contract);
            uint256 _matchContractIndex = indexOf(_betStorage.getContractsByMatchId(bet.getMatchId()), _contract);
            _betStorage.removeBetFromUser(originalOwner, _originalOwnerContractIndex);
            _betStorage.removeBetFromUser(counterGambler, _counterGamblerContractIndex);
            _betStorage.removeBetFromMatchId(bet.getMatchId(), _matchContractIndex);
        }
    }
    
    function addBetToCounterGambler(address counterGambler, address _sonContract) override external payable{
        _betStorage.pushContractsByUser(counterGambler, _sonContract);
    }

    /**
    Función que devuelve todos los contratos(apuestas) creadas por un usuario
    _user: dirección del usuario del que se muestran las apuestas
     */
    function getAllBetsByUser(address _user) override external view returns (address[] memory){
        return _betStorage.getAllBetsByUser(_user);
    }

    /**
    Función que devuelve todos los contratos(apuetas) creadas para un partido concreto
    _matchId: id del partido del que se muestran las apuestas
     */
    function getAllBetsByMatchId(uint256 _matchId) override external view returns (address[] memory){
        return _betStorage.getAllBetsByMatchId(_matchId);
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

    //*********** PANIC FUNCTIONS ************
    //Vailda si el contrato está activo    
    function isActive() override external view returns (bool){
        return _betStorage.isActive();
    }

    function version() override external pure returns (string memory){
        return "v1.0";
    }
}