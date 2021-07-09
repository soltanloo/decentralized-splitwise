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

  describe("#increaseDebt()", () => {
    it("should add 50 credits for 1 -> 2", async function () {
      let instance = await Splitwise.deployed();
      let initialBalance = await instance.lookup(accounts[1], accounts[2]);
      await instance.increaseDebt.sendTransaction(accounts[1], accounts[2], 50);
      let balance = await instance.lookup(accounts[1], accounts[2]);
      assert.equal(balance.toNumber(), initialBalance.toNumber() + 50);
    });
    it("should fail for negative amounts", async function () {
      let instance = await Splitwise.deployed();
      try {
        await instance.increaseDebt.sendTransaction(accounts[1], accounts[2], -1);
        assert.fail("The transaction should have thrown an error");
      } catch(err) {
        assert.include(err.message, "value out-of-bounds");
      }
    });
  });

  describe("#decreaseDebt()", () => {
    it("should clear debt for 1 -> 2", async function () {
      let instance = await Splitwise.deployed();
      let initialBalance = await instance.lookup(accounts[1], accounts[2]);
      await instance.decreaseDebt.sendTransaction(accounts[1], accounts[2], 50);
      let balance = await instance.lookup(accounts[1], accounts[2]);
      assert.equal(balance.toNumber(), initialBalance.toNumber() - 50);
    });
    it("should add to creditors debt if amount is more than debtor's debt", async function () {
      let instance = await Splitwise.deployed();
      await instance.decreaseDebt.sendTransaction(accounts[1], accounts[2], 50);
      let balance = await instance.lookup(accounts[1], accounts[2]);
      assert.equal(balance.toNumber(), 0);
      balance = await instance.lookup(accounts[2], accounts[1]);
      assert.equal(balance.toNumber(), 50);
    });
    it("should fail for negative amounts", async function () {
      let instance = await Splitwise.deployed();
      try {
        await instance.decreaseDebt.sendTransaction(accounts[1], accounts[2], -1);
        assert.fail("The transaction should have thrown an error");
      } catch(err) {
        assert.include(err.message, "value out-of-bounds");
      }
    });
  });

  describe("#getUsers()", () => {
    it("should return three users after adding debts for 0 -> 1 and 1 -> 2", async function () {
      let instance = await Splitwise.deployed();
      let users = await instance.getUsers.call();
      assert.equal(users.length, 3);
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
