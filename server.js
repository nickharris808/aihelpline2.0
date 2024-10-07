const express = require('express');
const { handleIncomingMessagePlivo, handleIncomingMessageTestPlivo, handleReset } = require('./controllers/MessageController');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('combined'));

const uri = "mongodb+srv://hline:CYi9Bu0bKHqXIuAy@hline.081tr.mongodb.net/?retryWrites=true&w=majority&appName=Hline";

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error(err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.delete('/reset', handleReset);
app.post('/api/plivo/messages', handleIncomingMessagePlivo);
app.post('/api/test/messages', handleIncomingMessageTestPlivo);

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

module.exports = app;