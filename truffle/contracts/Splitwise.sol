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
        debts[msg.sender][creditor] += amount;
        addUser(msg.sender);
        addUser(creditor);
    }

    function removeDebt(address debtor, address creditor , uint32 amount) public {
        require(
            debts[debtor][creditor] >= amount,
            "Amount is greater than the debt between debtor and creditor"
        );
        debts[debtor][creditor] -= amount;
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
