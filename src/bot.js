const { keepWebSocketAlive } = require('./tasks');
const chalk = require('chalk');

function displayBanner() {
  console.log(chalk.blue(`
   ___      _       _     
  / _ \\__ _| |_ ___| |__  
 / /_)/ _\` | __/ __| '_ \\ 
/ ___/ (_| | || (__| | | |
\\/    \\__,_|\\__\\___|_| |_|
                          
`));
}

(async () => {
  displayBanner();
  console.log(chalk.green('Starting SparkChain auto bot...'));

  // Keep WebSocket connection alive
  await keepWebSocketAlive();

  console.log(chalk.green('SparkChain auto bot finished.'));
})();
