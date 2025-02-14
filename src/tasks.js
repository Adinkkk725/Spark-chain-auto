const WebSocket = require('ws');
const chalk = require('chalk');

const blue = chalk.blue.bind(chalk);
const cyan = chalk.cyan.bind(chalk);
const yellow = chalk.yellow.bind(chalk);
const magenta = chalk.magenta.bind(chalk);
const red = chalk.red.bind(chalk);

async function keepWebSocketAlive() {
  const url = 'wss://ws-v2.sparkchain.ai/socket.io/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjQ0NzI0LCJuYW1lIjoiQWRpbms3MjEiLCJlbWFpbCI6ImFkaW5zYWphNzIxQGdtYWlsLmNvbSIsInJlZmVycmVyX2lkIjo0Njc3MjM0OSwiZXhwIjoxNzcxMDcxMzcwfQ.5ATScsQPheCI8D4S2f-L0xCgGXQd8DSg8bwHMrXHX9w&device_id=77aa1b6c-70bd-42f0-bbd4-e8d0a9702964&device_version=0.7.0&EIO=4&transport=websocket';
  const ws = new WebSocket(url);

  ws.on('open', () => {
    console.log(blue('WebSocket connection opened'));
  });

  ws.on('message', (message) => {
    console.log(cyan('Received message:', message));
    try {
      const messageString = message.toString('utf-8');
      if (messageString.startsWith('{') || messageString.startsWith('[')) {
        const data = JSON.parse(messageString);
        if (data && data.points) {
          console.log(yellow(`Points earned: ${data.points}`));
        }
      }
    } catch (error) {
      console.error(red('Error parsing message:', error));
    }
  });

  ws.on('ping', () => {
    console.log(magenta('Received ping'));
  });

  ws.on('pong', () => {
    console.log(magenta('Received pong'));
  });

  ws.on('close', () => {
    console.log(blue('WebSocket connection closed, reconnecting...'));
    setTimeout(keepWebSocketAlive, 5000); // Coba reconnect setelah 5 detik
  });

  ws.on('error', (error) => {
    console.error(red('WebSocket error:', error));
  });
}

module.exports = { keepWebSocketAlive };
