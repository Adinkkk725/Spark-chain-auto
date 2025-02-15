const { keepWebSocketAlive } = require('./tasks');
const fs = require('fs');

function displayBanner() {
  console.log(`
   ___      _       _     
  / _ \\__ _| |_ ___| |__  
 / /_)/ _\` | __/ __| '_ \\ 
/ ___/ (_| | || (__| | | |
\\/    \\__,_|\\__\\___|_| |_|
                          
`);
}

function getToken() {
  return fs.readFileSync('token.txt', 'utf-8').trim();
}

(async () => {
  displayBanner();
  console.log('Starting SparkChain auto bot...');

  const token = getToken();

  // Keep WebSocket connection alive
  await keepWebSocketAlive(token);

  console.log('SparkChain auto bot finished.');
})();
