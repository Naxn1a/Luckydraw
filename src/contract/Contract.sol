// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract luckydraw {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function _send() public payable {
        require(msg.value >= 0.1 ether, "0.1 ether");
        payable(msg.sender);
    }

    function _receive(uint amount, address player) public onlyOwner {
        require(address(this).balance >= amount);
        payable(player).transfer(amount);
    }

    function _balance() public view onlyOwner returns (uint) {
        return address(this).balance;
    }

    function _withdraw(uint amount) public onlyOwner {
        require(address(this).balance >= amount);
        payable(owner).transfer(amount);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "owner only!");
        _;
    }
}
