// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SimpleStorage {
    // Public state variables — Solidity auto-generates a getter for each.
    uint256 public value;
    address public owner;

    // Track the last value written by each address.
    mapping(address => uint256) public lastValueBy;

    // Event emitted on every change. `indexed` lets clients filter by author.
    event ValueChanged(address indexed by, uint256 newValue);

    // Runs once, at deployment. The deployer becomes the owner.
    constructor() {
        owner = msg.sender;
    }

    // Anyone can set a new value.
    function set(uint256 _value) public {
        value = _value;
        lastValueBy[msg.sender] = _value;
        emit ValueChanged(msg.sender, _value);
    }

    // Anyone can increment by 1. Shows a state change without inputs.
    function increment() public {
        value += 1;
        lastValueBy[msg.sender] = value;
        emit ValueChanged(msg.sender, value);
    }

    // Only the owner can reset. Demonstrates access control with `require`.
    function reset() public {
        require(msg.sender == owner, "Only the owner can reset");
        value = 0;
        emit ValueChanged(msg.sender, 0);
    }
}
