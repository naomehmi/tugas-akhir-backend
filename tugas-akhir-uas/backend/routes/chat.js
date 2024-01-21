const express = require('express');
const router = express.Router();
const Message = require('../database/messages')
const expressWs = require('express-ws');

const app = express();
expressWs(app);

module.exports = async (ws, req) => {
  router.get('/', async (req, res) => {
    try {
      const messages = await Message.findAll();
      res.json(messages);
    } catch (error) {
      console.error('Error retrieving messages:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.ws('/', (ws, req) => {
    ws.on('message', async (msg) => {
      try {
        const messageData = JSON.parse(msg);
        const { user, text } = messageData;

        await Message.create({ user, text });

        const clients = req.wsServer.clients
        clients.forEach((client) => {
          client.send(JSON.stringify({ user, text }));
        });
      } catch (error) {
        console.error('Error handling message:', error);
      }
    });
  });

  return router;
};
