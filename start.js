const { getTx, getPastLogs, decodeLogPair, getBlockNumber } = require("./utils");

const events = [];
async function start() {
  const toBlock = 26024907 + 10;
  const fromBlock = 26024907;
//   console.log({ fromBlock, toBlock });
  await getTx()
//   const logs = await getTx();
//   for (const log of logs) {
//     const event = decodeLogPair(log);
//     if (event) {
//       events.push(event);
//     }
//   }

//   console.log({ events });
}

start();
