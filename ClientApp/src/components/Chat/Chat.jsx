import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import style from './style.module.css'; 

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

export default function Chat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSendMessage = async () => {
    
    const newUserMessage = {
      content: messageInput,
      sender: 'user',
    };

    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);

    
    const requestBody = {
      model: "gpt-4o",
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: messageInput },
      ],
    };

    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      const botMessage = responseData.choices[0].message.content.trim();

      
      const newBotMessage = {
        content: botMessage,
        sender: 'bot',
      };

      
      setMessages(prevMessages => [...prevMessages, newBotMessage]);

      
      setMessageInput('');

    } catch (error) {
      console.error('Error fetching from OpenAI:', error);
      
    }
  };

  
  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className={style.container}>
      <div className={style.chatButton} onClick={handleOpen}>
        Chat with AI
      </div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="chat-dialog-title">
        <DialogTitle id="chat-dialog-title">Chat with AI</DialogTitle>
        <DialogContent className={style.dialog}>
          <div className={style.messageContainer}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${style.message} ${message.sender === 'user' ? style.right : style.left}`}
              >
                {message.content}
              </div>
            ))}
          </div>
          <TextField
            autoFocus
            margin="dense"
            id="message"
            label="Message"
            fullWidth
            variant="outlined"
            multiline
            rows={2}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button onClick={handleSendMessage} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
