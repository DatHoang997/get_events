const Web3 = require("web3");
const endpoint = `https://rpc.ankr.com/bsc`;
const web3Default = new Web3(endpoint);
const erc20Json = require("./ERC20.json");
const EVENTS_SYNC = ["Transfer"];
const data = require('./data.json');
fs = require("fs");

const getTx = async () => {
    for (let i = 0; i < data.length; i++) {
        let tx = await web3Default.eth.getTransactionReceipt(data[i].txhash)
        data[i].from = tx.from
        console.log(i+1, '/', data.length )
    }
    let config = JSON.stringify(data);
    await fs.writeFileSync("result0.json", config, (error) => {});
    return
}

const getPastLogs = async (fromBlock, toBlock) => {
  const logs = await web3Default.eth.getPastLogs({
    fromBlock,
    toBlock,
    address: ["0x3B78458981eB7260d1f781cb8be2CaAC7027DbE2"],
    topics: [
      "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
    ],
  });
  return logs;
};

const decodeLogPair = (log) => {
  try {
    const eventAbisMapWithSignature = {};

    for (const abi of erc20Json.abi) {
      if (abi.type === "event") {
        const signature = web3Default.eth.abi.encodeEventSignature(abi);
        eventAbisMapWithSignature[signature] = abi;
      }
    }

    const signature = log.topics[0];
    const eventAbi = eventAbisMapWithSignature[signature];
    if (!eventAbi) {
      return;
    } else {
      const { inputs, anonymous, name } = eventAbi;
      console.log({ name });
      // if (!EVENTS_SYNC.includes(name)) {
      //   return null;
      // }

      const hexString = log.data;
      if (!anonymous) {
        log.topics.splice(0, 1);
      }
      const data = web3Default.eth.abi.decodeLog(inputs, hexString, log.topics);
      const { from, to, value } = data;
      return {
        address: log.address,
        blockHash: log.blockHash,
        blockNumber: log.blockNumber,
        event: name,
        // returnValues: data,
        transactionHash: log.transactionHash,
        // transactionIndex: log.transactionIndex,
        /// transfer event
        from,
        to,
        value,
      };
    }
  } catch (error) {
    return;
  }
};

const getBlockNumber = async () => {
  return await web3Default.eth.getBlockNumber();
};

module.exports = {
  web3Default,
  getPastLogs,
  decodeLogPair,
  getBlockNumber,
  getTx,
};
