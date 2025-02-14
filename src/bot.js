const { keepWebSocketAlive } = require('./tasks');
const chalk = require('chalk');

const blue = chalk.blue.bind(chalk);
const cyan = chalk.cyan.bind(chalk);
const yellow = chalk.yellow.bind(chalk);
const magenta = chalk.magenta.bind(chalk);
const red = chalk.red.bind(chalk);

function displayBanner() {
  console.log(blue(`
   ___      _       _     
  / _ \\__ _| |_ ___| |__  
 / /_)/ _\` | __/ __| '_ \\ 
/ ___/ (_| | || (__| | | |
\\/    \\__,_|\\__\\___|_| |_|
                          
`));
}

(async () => {
  displayBanner();
  console.log(cyan('Starting SparkChain auto bot...'));

  // Keep WebSocket connection alive
  await keepWebSocketAlive();

  console.log(cyan('SparkChain auto bot finished.'));
})();
