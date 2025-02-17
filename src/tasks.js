const fs = require('fs');
const WebSocket = require('ws');
const SocksProxyAgent = require('socks-proxy-agent');
const { HttpsProxyAgent } = require('https-proxy-agent');
const chalk = require('chalk');

function parseProxy(proxyString) {
  try {
    let protocol, host, port;
    if (proxyString.includes('://')) {
      const url = new URL(proxyString);
      protocol = url.protocol.replace(':', '');
      host = url.hostname;
      port = url.port;
    } else {
      const parts = proxyString.split(':');
      if (parts.length === 3) {
        [host, port, protocol] = parts;
      } else if (parts.length === 2) {
        [host, port] = parts;
        protocol = 'http';
      }
    }
    return { protocol: protocol.toLowerCase(), host, port: parseInt(port) };
  } catch (error) {
    console.error(chalk.magenta('Error parsing proxy:', proxyString, error.message));
    return null;
  }
}

function loadProxies() {
  try {
    const data = fs.readFileSync('proxies.txt', 'utf8');
    return data.split('\n')
      .filter(line => line.trim())
      .map(proxy => parseProxy(proxy))
      .filter(proxy => proxy !== null);
  } catch (error) {
    console.log(chalk.cyan('No proxies found, using direct connection'));
    return [];
  }
}

function getProxyAgent(proxy) {
  if (!proxy) return null;
  const proxyUrl = `${proxy.protocol}://${proxy.host}:${proxy.port}`;
  switch (proxy.protocol.toLowerCase()) {
    case 'socks4':
    case 'socks5':
      return new SocksProxyAgent(proxyUrl);
    case 'http':
    case 'https':
      return new HttpsProxyAgent(proxyUrl);
    default:
      return null;
  }
}

function getNextProxy(proxies, proxyIndex) {
  if (proxies.length === 0) return { proxy: null, proxyIndex };
  const proxy = proxies[proxyIndex];
  proxyIndex = (proxyIndex + 1) % proxies.length;
  return { proxy, proxyIndex };
}

function handleMessage(ws, data, token) {
  const message = data.toString();
  console.log(chalk.blue(`Received [${token.substring(0, 15)}...]:`, message));

  if (message.startsWith('0')) {
    const handshake = JSON.parse(message.substring(1));
    ws.pingInterval = handshake.pingInterval;
    ws.pingTimeout = handshake.pingTimeout;

    setTimeout(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send('40{"sid":"' + handshake.sid + '"}');
      }
    }, 500);

  } else if (message.startsWith('2')) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send('3');
    }
  }
}

function setupPingPong(ws, token) {
  let upMessageSent = false;
  let messageCount = 0;

  ws.on('message', (data) => {
    handleMessage(ws, data, token);
    messageCount++;

    if (!upMessageSent && messageCount >= 10) {
      upMessageSent = true;
      if (ws.readyState === WebSocket.OPEN) {
        console.log(chalk.green(`Sending "up" message for token: ${token.substring(0, 15)}...`));
        ws.send('42["up",{}]');
      }
    }
  });
}

function createConnection(token, proxies, proxyIndex) {
  const { proxy, newProxyIndex } = getNextProxy(proxies, proxyIndex);
  const agent = getProxyAgent(proxy);

  const wsUrl = `wss://ws-v2.sparkchain.ai/socket.io/?token=${token}&device_id=77aa1b6c-70bd-42f0-bbd4-e8d0a9702964&device_version=0.7.0&EIO=4&transport=websocket`;

  const wsOptions = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
      'Origin': 'chrome-extension://jlpniknnodfkbmbgkjelcailjljlecch',
      'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
      'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits'
    },
    agent: agent
  };

  const ws = new WebSocket(wsUrl, wsOptions);

  ws.on('open', () => {
    console.log(chalk.green(`Connected: ${token.substring(0, 15)}... ${proxy ? `via ${proxy.protocol} proxy` : 'direct'}`));
  });

  setupPingPong(ws, token);

  ws.on('error', (error) => {
    console.error(chalk.magenta(`Error [${token.substring(0, 15)}...]:`, error.message));
    ws.close();
    setTimeout(() => createConnection(token, proxies, newProxyIndex), 5000);
  });

  ws.on('close', (code, reason) => {
    console.log(chalk.blue(`Disconnected: ${token.substring(0, 15)}... Code: ${code}, Reason: ${reason ? reason.toString() : 'N/A'}`));
    setTimeout(() => createConnection(token, proxies, newProxyIndex), 5000);
  });
}

function startWebSocketBot(token) {
  const proxies = loadProxies();
  let proxyIndex = 0;

  createConnection(token, proxies, proxyIndex);
}

module.exports = { startWebSocketBot };
