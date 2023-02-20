const Block = require('./block');
const User = require('./user');

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.users = [];
  }

  createGenesisBlock() {
    return new Block(0, Date.now(), 'Genesis Block');
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(data) {
    const block = new Block(
      this.getLastBlock().index + 1,
      Date.now(),
      data,
      this.getLastBlock().hash
    );
    this.chain.push(block);
  }

  addUser(user) {
    this.users.push(user);
  }

  findUserByEmail(email) {
    return this.users.find((user) => user.email === email);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

module.exports = Blockchain;
