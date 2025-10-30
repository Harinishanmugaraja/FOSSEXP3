const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const redis = require('redis');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve a simple HTML page for testing
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Redis Notifications</title></head>
        <body>
            <h1>Real-time Notifications</h1>
            <div id="messages"></div>
            <script src="/socket.io/socket.io.js"></script>
            <script>
                const socket = io();
                socket.on('notification', msg => {
                    const div = document.getElementById('messages');
                    div.innerHTML += '<p>' + msg + '</p>';
                });
            </script>
        </body>
        </html>
    `);
});

// Redis subscriber
const subscriber = redis.createClient();
subscriber.connect().catch(console.error);

// Subscribe to "notifications" channel
subscriber.subscribe('notifications', (message) => {
    console.log('Received from Redis:', message);
    io.emit('notification', message); // Send to all connected clients
});

// Start the server
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
