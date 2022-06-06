// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter {

    event CountUpdated(uint _amount);

    uint public counter;
    function incrementCounter() public {
        counter++;
        emit CountUpdated(counter);
    }

    function get() public view returns (uint) {
        return counter;
    }

    function decrementCounter() public {
        counter--;
        emit CountUpdated(counter);
    }

    function reset() public {
        counter = 0;
        emit CountUpdated(counter);
    }


}
