// SPDX-License-Identifier: GPL-3.0

// Please paste your contract's solidity code here
// Note that writing a contract here WILL NOT deploy it and allow you to access it from your client
// You should write and develop your contract in Remix and then, before submitting, copy and paste it here

pragma solidity^0.5.0;

contract Splitwise {
    address[] public users;
    mapping(address => mapping(address => uint32)) public debts;
    address owner;

    constructor() public {
        owner = msg.sender;
    }

    function getUsers() public view returns (address[] memory ret){
        ret = new address[](users.length);
        for (uint i = 0; i < users.length; i++){
            ret[i] = users[i];
        }
    }

    function addUser(address user) private {
        for (uint i = 0; i < users.length; i++){
            if (users[i] == user) return;
        }
        users.push(user);
    }

    function add_IOU(address creditor, uint32 amount) public {
        increaseDebt(msg.sender, creditor, amount);
    }

    function increaseDebt(address debtor, address creditor , uint32 amount) public {
        debts[debtor][creditor] += amount;
        addUser(msg.sender);
        addUser(creditor);
    }

    function decreaseDebt(address debtor, address creditor , uint32 amount) public {
        if (debts[debtor][creditor] >= amount) {
            debts[debtor][creditor] -= amount;
        } else {
            debts[creditor][debtor] += amount - debts[debtor][creditor];
        }
        addUser(msg.sender);
        addUser(creditor);
    }

    function lookup(address debtor, address creditor) public view returns (uint32 ret) {
        ret = debts[debtor][creditor];
    }

    modifier ifOwner() {
        if(owner != msg.sender) {
            revert();
        } else {
            _;
        }
    }

    function deposit() payable public {}

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function withdraw(uint funds) public ifOwner {
        msg.sender.transfer(funds);
    }
}
