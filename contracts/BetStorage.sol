/**
 *Submitted for verification at Etherscan.io on 2022-04-22
 */

// Version de solidity del Smart Contract
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;
import "../client/node_modules/@openzeppelin/contracts/access/Ownable.sol";

//this contract is used to store data
contract BetStorage is Ownable{
   
    //Estado del contrato
    bool public activeContract;

    //*********** VAR INTERNAS ************
    //Se crea una lista de acceso para las direcciones que pueden utilizar este storage
    address authorizedFather;

    //*********** VAR BET ************
    //mapping de todos los contratos(apuestas) creados por un usuario 
    //      usuario     contrato
    mapping(address =>  address[]) public contractsByUser;

    //mapping de todos los contratos(apuestas) creados para un partido concreto
    //      matchId    contrato
    mapping(uint256 => address[]) public contractsByMatchId;
  
    //*********** MODIFIERS ************
    //modifier checks si la direccion esta permitida para modificar datos
    modifier isAllowed() {
        require(authorizedFather == msg.sender, "Not authorized");
        _;
    }

    //*********** ACCESS FUNCTIONS ************
    //brinda el acceso al contrato father que se encuentra en productivo
    function setAuthorizedFather(address _address) onlyOwner public {
        authorizedFather = _address;  
    }
     
    //Vailda si el contrato está activo    
    function getAuthorizedFather() public view returns (address){
        return authorizedFather;
    }

    function isContractActive() public view returns (bool){
        return activeContract;
    }
    

    //*********** STORAGE FUNCTIONS ************
    
    //CONTRACTS BY USER
    function pushContractsByUser(address _user, address _contract) isAllowed public {
        contractsByUser[_user].push(_contract);
    } 

    function getContractsByUser(address _user) public view returns (address[] memory){
        return contractsByUser[_user];
    }  

    function getAllBetsByUser(address _user) public view returns (address[] memory){
        return contractsByUser[_user];
    }

    function removeBetFromUser(address _userAddress, uint _index) isAllowed public{
        contractsByUser[_userAddress][_index] = contractsByUser[_userAddress][contractsByUser[_userAddress].length - 1];
        contractsByUser[_userAddress].pop();
    }

    //CONTRACTS BY MATCH ID
    function pushContractsByMatchId(uint256 _matchId, address _contract) isAllowed public {
        contractsByMatchId[_matchId].push(_contract);
    }

    function getContractsByMatchId(uint256 _matchId) public view returns (address[] memory){
        return contractsByMatchId[_matchId];
    }    

    function getAllBetsByMatchId(uint256 _matchId) public view returns (address[] memory){
        return contractsByMatchId[_matchId];
    }

    function removeBetFromMatchId(uint256 _matchId, uint _index) isAllowed public{
        contractsByMatchId[_matchId][_index] = contractsByMatchId[_matchId][contractsByMatchId[_matchId].length - 1];
        contractsByMatchId[_matchId].pop();
    }

    //*********** PANIC FUNCTIONS ************
    //habilita el contrato
    function enableContract() public onlyOwner {
        require(!isActive(), "Smart contract is enabled");
        activeContract = true;
    }

    //deshabilita el contrato
    function disableContract() public onlyOwner {
        require(isActive(), "Smart contract is disabled");
        activeContract = false;
    }

    //Vailda si el contrato está activo    
    function isActive() public view returns (bool){
        return (activeContract);
    }
}