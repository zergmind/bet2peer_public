/**
 *Submitted for verification at Etherscan.io on 2022-04-22
 */

// Version de solidity del Smart Contract
// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.14;
import "./Father.sol";
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
    struct contractInformation {
        address originalOwner;
        address counterGambler;
        uint256 currentMatch;
        uint8 result;
        uint256 originalBet;
        uint256 minimumCounterBet;
    }
    mapping (address => contractInformation) public contractInfo;
    mapping (uint256 => uint8) private resultsByMatch; //TO-DO Quitar cuando esté hecha la parte de chainlink
    uint256 public currentMatch;
    address payable originalOwner;
    address payable counterGambler;
    uint8 result;
    uint256 originalBet;
    uint256 minimumCounterBet;
    address fatherAddress;
    Father fatherContract;

    bool activeBet;
    bool isAccepted;

    // ----------- Events -----------
    event Status(string _message);
    event betCreated (
        string betCreated
    );
    event betAccepted (
        string betAccepted
    );

    // ------------Modifiers ----------
    modifier isParticipant(address sender) {
        require(
            sender == originalOwner || 
            sender == counterGambler,
            "No participas en esta apuesta"
        );
        _;
    }
    modifier isOriginalOwner(address sender) {
        require(
            sender == originalOwner,
            "No eres el creador de la apuesta"
        );
        _;
    }
    modifier contractActive() {
        require(
            activeBet, 
            "Esta apuesta no esta activa"
            );
        _;
    }

    // ----------- Constructor -----------
    /**
    _originalGambler: usuario que crea la apuesta
    _matchId: id del partido de la apuesta
    _result: resultado al que se apuesta
    _originalBet: cantidad apostada
    _minimumCounterBet: cantidad a percibir en caso de ganar
    _fatherAddress: dirección del contrato padre
     */
    constructor(address _originalGambler, uint256 _matchId, uint8 _result, uint256 _originalBet, uint256 _minimumCounterBet, address _fatherAddress) {
        originalOwner = payable(_originalGambler); //
        currentMatch = _matchId; //
        result = _result; //
        originalBet = _originalBet; //
        minimumCounterBet = _minimumCounterBet; //
        fatherAddress = _fatherAddress;
        activeBet = true;
        isAccepted = false;
        //Relleno el struct con toda la info del contrato
        contractInfo[address(this)].originalOwner = _originalGambler;
        contractInfo[address(this)].currentMatch = _matchId;
        contractInfo[address(this)].result = _result;
        contractInfo[address(this)].originalBet = _originalBet;
        contractInfo[address(this)].minimumCounterBet = _minimumCounterBet;

        //TO-DO Quitar estos datos hardcodeados cuando esté hecho lo de chainlink
        resultsByMatch[18165994] = 0;
        resultsByMatch[18165993] = 2;
        resultsByMatch[18166002] = 2;
        resultsByMatch[18165998] = 1;
        resultsByMatch[18166001] = 2;
        resultsByMatch[18165997] = 1;
        
        // Se emite un Evento
        emit Status(string(abi.encodePacked("Partido ", _matchId, " creado")));
    }

    // -------------------Functions ------------------

    /**
    Función para recibir los fondos desde el contrato padre
     */
    receive() external payable {}

    /**
    Función para aceptar la apuesta de otro usuario
     */
    function acceptBet() public payable 
        contractActive
    {
        require(msg.value >= minimumCounterBet, "Apuesta insuficiente");
        require(isAccepted == false, "Apuesta ya aceptada");
        counterGambler = payable(tx.origin);
        contractInfo[address(this)].counterGambler = counterGambler;
        isAccepted = true;
        
        fatherContract = Father(address(fatherAddress));
        fatherContract.addBetToCounterGambler(counterGambler, address(this));

        emit Status(string(abi.encodePacked(counterGambler, " ha aceptado la apuesta de ", originalOwner)));
    }

    /**
    Función para resulver una apuesta y repartir las ganancias
     */
    function resolveBet(address _sender) public payable 
        isParticipant(_sender)
        contractActive returns (bool)
    {
        require(isAccepted);
        //TO-DO 
        //Poner validación para saber que el partido ha terminado
        //TODO
        //Hacemos la llamada a ChainLink
        //comparamos result con el valor de ChainLink
        if(resultsByMatch[currentMatch] == result/*resultado de ChainLink*/) {
            //transferimos las ganancias al originalOwner
            originalOwner.transfer(address(this).balance);
        }
        else {
            //transferimos las ganancias al counterGambler
            counterGambler.transfer(address(this).balance);
        }
        //desactivamos le contrato
        activeBet = false;
        //Emitimos el estatus
        emit Status(string(abi.encodePacked("Apuesta ", getContractAddress(), " resuelta")));

        return true;
    }

    /**
    Función que elimina la apuesta en caso de no estar aceptada
    Returns: true si la apuesta se elimina correctamente
     */
    function removeBet(address _originalOwner) public payable 
        isOriginalOwner(_originalOwner)
        contractActive
        returns (bool)
    {
        require(!isAccepted, "La apuesta ya ha sido aceptada");
        originalOwner.transfer(address(this).balance);
        activeBet = false;
        //Emitimos el estatus
        emit Status(string(abi.encodePacked("Apuesta ", getContractAddress(), " eliminada")));
        return true;
    }

    /**
    Función que devuelve la dirección del contrato
     */
    function getContractAddress() public view returns (address)  {
        return address(this);
    }

    /**
    Función que devuelve información del contrato
     */
    function getContractInfo() public view returns(contractInformation memory){
        return contractInfo[address(this)];
    }

    /**
    Función que devuelve el id del partido
     */
    function getMatchId() public view returns(uint256){
        return currentMatch;
    }

    /**
    Función que devuelve la dirección del creador de la apuesta
     */
    function getOriginalOwner() public view returns(address) {
        return originalOwner;
    }

     /**
    Función que devuelve la dirección del que aceptó la apuesta
     */
    function getCounterGambler() public view returns(address) {
        return counterGambler;
    }
   
   /**
    Función temporal para comprobar que el balance está bien hecho
     */
   function getBalance() 
    public view returns(uint256) {
        return address(this).balance;
    }
}
