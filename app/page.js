"use client";
import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import StockChartWidget from './components/StockChartWidget';

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "I am an AI-powered customer support assistant, how can I help you?"
    }
  ]);

  const sendMessage = async () => {
    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, data]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages((prevMessages) => [...prevMessages, { role: "assistant", content: "Sorry, something went wrong. Please try again later." }]);
    }

    setInput("");
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      width="100%"
      height="100vh"
      justifyContent="center"
      alignItems="center"
      sx={{ background: 'linear-gradient(to right, #C0C0C0, #A9A9A9)', color: 'black' }}
    >
      <Box 
        width="25%" 
        height="90%" 
        sx={{ 
          padding: 2, 
          overflow: 'hidden', 
          border: '1px solid #444', 
          borderRadius: '10px', 
          borderColor: '#FF4500', 
          boxShadow: '0 0 10px #FF4500',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: '2in'
        }}
      >
        <StockChartWidget />
      </Box>
      <Stack
        direction="column"
        width="600px"
        height="700px"
        border="1px solid #444"
        p={2}
        spacing={3}
        sx={{ backgroundColor: '#000000', borderRadius: '10px', borderColor: '#00FFFF', boxShadow: '0 0 10px #00FFFF' }}
      >
        <Typography variant="h4" align="center" gutterBottom sx={{ color: 'white' }}>
          AI Assistant
        </Typography>
        <Stack
          direction="column"
          flexGrow={1}
          overflowY="auto"
          spacing={2}
          p={2}
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={message.role === "assistant" ? "flex-start" : "flex-end"}
            >
              <Box
                bgcolor={message.role === "assistant" ? "#333333" : "#1E90FF"}
                p={2}
                borderRadius="10px"
                width="fit-content"
                maxWidth="80%"
                display="flex"
                alignItems="center"
                sx={{ color: 'white', fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            sx={{ input: { color: 'white' }, label: { color: 'white' } }}
          />
          <Button 
            variant="contained" 
            onClick={sendMessage} 
            sx={{ 
              backgroundColor: '#00FFFF', 
              color: '#000000',
              boxShadow: '0 0 10px #00FFFF',
              '&:hover': {
                backgroundColor: '#00CED1',
                boxShadow: '0 0 15px #00FFFF',
              },
            }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
