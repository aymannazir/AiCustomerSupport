"use client";
import { useState } from "react";
import Box from "@mui/material/Box"; 
import Stack from "@mui/material/Stack"; 
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function Home() {
  const [message, setMessage] = useState({
    role: "assistant",
    content: "I am an AI-powered customer support assistant for BanglaBulls, how can I help you?"
  });

  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    setMessages((prevMessages) => [...prevMessages, data]);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction="column"
        width="600px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
      >
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
                bgcolor={message.role === "assistant" ? "lightblue" : "lightgreen"}
                p={2}
                borderRadius="10px"
                width="fit-content"
                maxWidth="80%"
                display="flex"
                alignItems="center"
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
            value={message.content}
            onChange={(e) => setMessage({ ...message, content: e.target.value })}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
