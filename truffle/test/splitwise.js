const Splitwise = artifacts.require("Splitwise");

contract('Splitwise', (accounts) => {

  describe("#add_IOU()", () => {
    it("should add 100 credits for 0 -> 1", async function () {
      let instance = await Splitwise.deployed();
      await instance.add_IOU.sendTransaction(accounts[1], 100);
      let balance = await instance.lookup.call(accounts[0], accounts[1]);
      assert.equal(balance.toNumber(), 100);
    });
    it("should fail for negative amounts", async function () {
      let instance = await Splitwise.deployed();
      try {
        await instance.add_IOU.sendTransaction(accounts[1], -1);
        assert.fail("The transaction should have thrown an error");
      } catch(err) {
        assert.include(err.message, "value out-of-bounds");
      }
    });
  });

  describe("#lookup()", () => {
    it("should return 100 credits for 0 -> 1", async function () {
      let instance = await Splitwise.deployed();
      let balance = await instance.lookup.call(accounts[0], accounts[1]);
      assert.equal(balance.toNumber(), 100);
    });
  });

  describe("#removeDebt()", () => {
    it("should clear debt for 0 -> 1", async function () {
      let instance = await Splitwise.deployed();
      let initialBalance = await instance.lookup(accounts[0], accounts[1]);
      await instance.removeDebt.sendTransaction(accounts[0], accounts[1], initialBalance);
      let balance = await instance.lookup(accounts[0], accounts[1]);
      assert.equal(balance.toNumber(), 0);
    });
    it("should fail if amount is greater than debt", async function () {
      let instance = await Splitwise.deployed();
      try {
        await instance.removeDebt.sendTransaction(accounts[0], accounts[1], 1);
        assert.fail("The transaction should have thrown an error");
      } catch(err) {
        assert.include(err.message, "Amount is greater than the debt between debtor and creditor");
      }
    });
    it("should fail for negative amounts", async function () {
      let instance = await Splitwise.deployed();
      try {
        await instance.removeDebt.sendTransaction(accounts[0], accounts[1], -1);
        assert.fail("The transaction should have thrown an error");
      } catch(err) {
        assert.include(err.message, "value out-of-bounds");
      }
    });
  });

  describe("#getUsers()", () => {
    it("should return two users after adding debts for 0 -> 1", async function () {
      let instance = await Splitwise.deployed();
      let users = await instance.getUsers.call();
      assert.equal(users.length, 2);
    });
  });

  describe("#deposit()", () => {
    it("should deposit 10 wei to contract", async function () {
      let instance = await Splitwise.deployed();
      await instance.deposit.sendTransaction({value: 10});
      let balance = await instance.getBalance.call();
      assert.equal(balance.toNumber(), 10);
    });
  });

  describe("#withdraw()", () => {
    it("should withdraw 1 wei from contract", async function () {
      let instance = await Splitwise.deployed();
      await instance.withdraw.sendTransaction(1);
      let balance = await instance.getBalance.call();
      assert.equal(balance.toNumber(), 9);
    });
    it("should not let accounts other than the owner withdraw", async function () {
      let instance = await Splitwise.deployed();
      try {
        await instance.withdraw.sendTransaction(1, {from: accounts[1]});
        assert.fail("The transaction should have thrown an error");
      } catch(err) {
        assert.include(err.message, "revert");
      }
    });
  });

  describe("#getBalance()", () => {
    it("should return 9 credits", async function () {
      let instance = await Splitwise.deployed();
      let balance = await instance.getBalance.call();
      assert.equal(balance.toNumber(), 9);
    });
  });

});

