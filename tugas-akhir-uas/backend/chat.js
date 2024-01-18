const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM messages');
      res.json(rows);
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

        await pool.query('INSERT INTO messages (user, text) VALUES (?, ?)', [user, text]);

        app.getWss().clients.forEach((client) => {
          client.send(JSON.stringify({ user, text }));
        });
      } catch (error) {
        console.error('Error handling message:', error);
      }
    });
  });

  return router;
};
