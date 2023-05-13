const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Create an Express app
const app = express();
app.use(cors());

// Connect to MongoDB using the connection URI
mongoose.connect('mongodb+srv://rohit45raj:Rohit_Raj_45@cluster0.c55os8w.mongodb.net/cheater', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Create a schema for messages
const messageSchema = new mongoose.Schema({
  text: String
});

// Create a model for messages using the message schema
const Message = mongoose.model('Message', messageSchema, 'msg');

// Parse JSON requests
app.use(bodyParser.json());

app.post('/messages', (req, res) => {
  const newMessage = new Message({
    text: req.body.text
  });
  console.log('New message:', newMessage); // log the new message object
  newMessage.save()
    .then(() => {
      console.log('Message saved!'); // log success message
      res.send('Message saved!');
    })
    .catch((err) => {
      console.error(err); // log the error
      res.status(500).send('Error saving message to database');
    });
});

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/messages', async (req, res) => {
    try {
      const messages = await Message.find().exec();
      res.send(messages);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving messages from database');
    }
  });
  
  app.delete('/messages/:id', async (req, res) => {
    try {
      const messageId = req.params.id;
      const message = await Message.findById(messageId);
      if (!message) {
        res.status(404).send('Message not found');
        return;
      }
      await Message.deleteOne({_id: messageId});
      res.send('Message deleted successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting message from database');
    }
  });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
