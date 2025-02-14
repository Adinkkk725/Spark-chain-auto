const { keepWebSocketAlive } = require('./tasks');

function displayBanner() {
  console.log(`
   ___      _       _     
  / _ \\__ _| |_ ___| |__  
 / /_)/ _\` | __/ __| '_ \\ 
/ ___/ (_| | || (__| | | |
\\/    \\__,_|\\__\\___|_| |_|
                          
`);
}

(async () => {
  displayBanner();
  console.log('Starting SparkChain auto bot...');

  // Keep WebSocket connection alive
  await keepWebSocketAlive();

  console.log('SparkChain auto bot finished.');
})();
