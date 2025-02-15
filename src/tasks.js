const WebSocket = require('ws');
const axios = require('axios');

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
        console.log('Parsed JSON:', JSON.stringify(data, null, 2));
        if (data && data.points) {
          console.log(`Points earned: ${data.points}`);
        } else {
          console.log('No points data found in message:', data);
        }
      } else if (messageString.startsWith('0')) {
        console.log('Received connection setup message:', messageString);
      } else {
        console.log('Received non-JSON message:', messageString);
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

async function fetchPointsPeriodically(token) {
  const apiUrl = 'https://api.sparkchain.ai/v1/points'; // Ganti dengan URL API yang sesuai
  const headers = {
    'Authorization': `Bearer ${token}`
  };

  async function fetchPoints() {
    try {
      const response = await axios.get(apiUrl, { headers });
      const points = response.data.points;
      console.log(`Fetched points: ${points}`);
    } catch (error) {
      console.error('Error fetching points:', error);
    }
  }

  setInterval(fetchPoints, 60000); // Fetch points setiap 60 detik
}

module.exports = { keepWebSocketAlive, fetchPointsPeriodically };
