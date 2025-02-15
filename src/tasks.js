const WebSocket = require('ws');
const axios = require('axios');

const API_URL = 'https://api.depined.org/api/user/widget-connect';

async function connectToApi(token) {
  try {
    const response = await axios.post(API_URL, {
      // Data yang diperlukan untuk permintaan POST
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Connected to API:', response.data);
  } catch (error) {
    console.error('Error connecting to API:', error);
  }
}

async function keepWebSocketAlive(token) {
  const url = `wss://ws-v2.sparkchain.ai/socket.io/?token=${token}&device_id=77aa1b6c-70bd-42f0-bbd4-e8d0a9702964&device_version=0.7.0&EIO=4&transport=websocket`;
  const ws = new WebSocket(url);

  ws.on('open', () => {
    console.log('WebSocket connection opened');
  });

  ws.on('message', (message) => {
    try {
      const messageString = message.toString('utf-8');
      console.log('Received message:', messageString);
      if (messageString.startsWith('{') || messageString.startsWith('[')) {
        const data = JSON.parse(messageString);
        if (data && data.points) {
          console.log(`Points earned: ${data.points}`);
        }
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('ping', () => {
    console.log('Received ping');
  });

  ws.on('pong', () => {
    console.log('Received pong');
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed, reconnecting...');
    setTimeout(() => keepWebSocketAlive(token), 5000); // Coba reconnect setelah 5 detik
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
}

module.exports = { keepWebSocketAlive, connectToApi };
