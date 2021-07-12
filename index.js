const express = require('express');
const cors = require('cors');
const logger = require('morgan');
require('dotenv').config();
const db = require('./db.json');

const app = express();

const PORT = process.env.PORT || 8080;
const HOST_URL = process.env.CURRENT_HOST_URL || 'http://localhost';
const environment = process.env.NODE_ENV || 'development';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*', credentials: true }));
app.use(logger('dev'));

app.get('/', (req, res) => {
  res.json(db);
});

app.get('/dialogues', (req, res) => {
  res.json(db.dialogues);
});

app.get('/dialogues/:id', (req, res) => {
  const { id } = req.params;
  const dialoguesById = db.dialogues.filter((dialogue) => dialogue._id === id);
  res.json(dialoguesById);
});

app.get('/messages', (req, res) => {
  res.json(db.messages);
});

app.get('/messages/:id', (req, res) => {
  const { id } = req.params;
  const messagesById = db.messages.filter((message) => message.roomId === id);
  res.json(messagesById);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log(`Environment: ${environment}`);
  console.log(`Link: ${HOST_URL}:${PORT}`);
});
