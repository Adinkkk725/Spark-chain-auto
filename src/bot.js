const { keepWebSocketAlive } = require('./tasks');

function displayBanner() {
  console.log(`
  ____  _     _  ____    ____      _   
 / ___|| |__ (_)/ ___|  / ___|__ _| |_ 
 \\___ \\| '_ \\| | |  _  | |   / _\` | __|
  ___) | | | | | |_| | | |__| (_| | |_ 
 |____/|_| |_|_|\\____|  \\____\\__,_|\\__|
                                       
`);
}

(async () => {
  displayBanner();
  console.log('Starting SparkChain auto bot...');

  // Keep WebSocket connection alive
  await keepWebSocketAlive();

  console.log('SparkChain auto bot finished.');
})();
