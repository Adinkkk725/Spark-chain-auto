# SparkChain Auto Bot

A Node.js bot to keep SparkChain WebSocket connection active by periodically sending pings to the server and display points earned.

## Features

- **Keep WebSocket Connection Alive**: Periodically send pings to SparkChain WebSocket server.
- **Display Points Earned**: Display points earned from active connection.
- **Connect to API**: POST request to connect widget using provided API.
- **Token Management**: Read token from `token.txt` for better security and manageability.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Adinkkk725/Spark-chain-auto.git
   cd Spark-chain-auto
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `token.txt` and add your token:
   ```bash
   nano token.txt
   ```

## Usage

Run the bot:
```bash
npm start
```

Customize the bot by editing `src/bot.js` and `src/tasks.js`.

## License

This project is licensed under the MIT License.
