/**
 *Submitted for verification at Etherscan.io on 2022-04-22
 */

// Version de solidity del Smart Contract
// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.14;

// Informacion del Smart Contract
// Nombre: Subasta
// Logica: Implementa subasta de productos entre varios participantes

// Declaracion del Smart Contract - Auction
contract MatchBet {
    // ----------- Variables (datos) -----------
    string public currentMatch;
    enum resultType {
        draw,
        localWin,
        visitorWin
    }
    mapping(resultType => uint256) public totalBetByResult;
    mapping(address => resultType) private resultByAddress;
    mapping(address => uint256) public betByAddress;
    address payable[] addresses;
    uint256 public totalBet;

    // Antiguo/nuevo dueño de subasta
    address payable public originalOwner;
    bool private activeBet;

    // ----------- Eventos (pueden ser emitidos por el Smart Contract) -----------
    event Status(string _message);

    // ----------- Constructor -----------
    // Uso: Inicializa el Smart Contract - Auction con: description, precio y tiempo
    constructor(string memory newMatch) {
        currentMatch = newMatch;
        originalOwner = payable(msg.sender);
        activeBet = true;
        // Se emite un Evento
        // emit Status(string(abi.encodePacked("Partido ", newMatch, " creado")));
    }

    // ------------ Funciones que modifican datos (set) ------------

    // Funcion
    // Nombre: bid
    // Uso:    Permite a cualquier postor apostar a un resultado concreto
    //         El dinero es almacenado en el contrato, junto con el nombre del postor
    //         El postor cuya oferta ha sido superada recibe de vuelta el dinero pujado
    function bet(uint256 result) public payable {
        require(activeBet == false);
        require(
            result > 2,
            "Resultado no valido. Los resultados son Empate = 0, Victoria Local = 1, Victoria Visitante = 2"
        );

        //Obtenemos el resultado al que se pretende apostar
        resultType currentType = resultType(result);
        //Realizamos la apuesta
        totalBetByResult[currentType] += msg.value;
        resultByAddress[msg.sender] = currentType;
        betByAddress[msg.sender] += msg.value;
        totalBet += msg.value;
        addresses.push(payable(msg.sender));
    }

    // Funcion
    // Nombre: resolveMatch
    // Uso:    Para las apuestas y devuelve el dinero al maximo postor
    function resolveMatch(uint256 result) public {
        require(activeBet == false);
        require(
            msg.sender == originalOwner,
            "No puedes cerrar un partido que no has creado"
        );
        require(
            result > 2,
            "Resultado no valido. Los resultados son Empate = 0, Victoria Local = 1, Victoria Visitante = 2"
        );

        //desactivamos la apuesta
        activeBet = false;
        resultType finishedMatchResult = resultType(result);
        for (uint256 i = 0; i < addresses.length; i++) {
            address payable currentAddress = addresses[i];
            if (resultByAddress[currentAddress] == finishedMatchResult) {
                currentAddress.transfer(
                    (totalBet * betByAddress[currentAddress]) /
                        totalBetByResult[finishedMatchResult]
                );
            }
        }

        emit Status("El partido ha terminado y se ha pagado a los ganadores");
    }

    // ------------ Funciones que consultan datos (get) ------------

    // Funcion
    // Nombre: getHighestPrice
    // Logica: Consulta el total de dinero apostado
    function getTotalBet() public view returns (uint256) {
        return (totalBet);
    }

    // Funcion
    // Nombre: getLocalWinBet
    // Logica: Consulta el total de dinero apostado al ganador local
    function getLocalWinBet() public view returns (uint256) {
        return (totalBetByResult[resultType.localWin]);
    }

    // Funcion
    // Nombre: getVisitorWinBet
    // Logica: Consulta el total de dinero apostado al ganador visitante
    function getVisitorWinBet() public view returns (uint256) {
        return (totalBetByResult[resultType.visitorWin]);
    }

    // Funcion
    // Nombre: getDrawBet
    // Logica: Consulta el total de dinero apostado al empate
    function getDrawBet() public view returns (uint256) {
        return (totalBetByResult[resultType.draw]);
    }

    // Funcion
    // Nombre: getBetByAddress
    // Logica: Consulta el total de dinero apostado al empate
    function getBetByAddress(address userAddress)
        public
        view
        returns (uint256 amount, uint256 result)
    {
        return (
            betByAddress[userAddress],
            uint256(resultByAddress[userAddress])
        );
    }
}
