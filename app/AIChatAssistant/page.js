"use client";
import { useState } from "react";
import StockChartWidget from "./StockChartWidget"; // Ensure this path is correct
import { Box, Button, ListItemButton, ListItemText, List, Drawer, Typography, Stack, TextField } from "@mui/material";

const AiChatAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "I am an AI-powered customer support assistant, how can I help you?",
    },
  ]);

  const [message, setMessage] = useState("");
  const [stockSymbol, setStockSymbol] = useState("");
  const [chartOpen, setChartOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sendMessage = async () => {
    const match = message.match(/Show me stock (\w+)/i);
    if (match) {
      const symbol = match[1];
      setStockSymbol(`NASDAQ:${symbol}`);
      return;
    }

    setMessage("");
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: message }]),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      await reader.read().then(function processText({ done, value }) {
        if (done) {
          console.log("Stream finished:", result);
          return result;
        }
        const text = decoder.decode(value || new Int8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ];
        });
        return reader.read().then(processText);
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const toggleChart = () => {
    setChartOpen(!chartOpen);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      height="100vh"
      sx={{
        background: "#0A0A0A",
        borderColor: "#00FFFF",
        boxShadow: "0 0 10px #00FFFF",
        position: "relative",
      }}
    >
      {/* Title at the top */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundColor: "#0A0A0A",
          color: "#00FFFF",
          height: "60px",
          borderBottom: "1px solid #00FFFF",
          zIndex: 1201,
        }}
      >
        <Typography variant="h4">StockAdvisor AI</Typography>
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        height="calc(100% - 60px)"
        width="100%"
        justifyContent="center"
        alignItems="center"
        sx={{ position: "relative" }}
      >
        {/* Drawer for the sidebar */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer}
          sx={{
            width: 240,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 240,
              backgroundColor: "#0A0A0A",
              color: "#00FFFF",
              boxShadow: "0 0 15px #00FFFF",
              marginTop: "60px",
            },
          }}
        >
          <List>
            <ListItemButton>
              <ListItemText primary="Home" />
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="AI Assistant" />
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Graph" />
            </ListItemButton>
          </List>
          <Button
            onClick={toggleDrawer}
            aria-label="Close drawer"
            sx={{
              position: "absolute",
              top: "50%",
              right: 20,
              backgroundColor: "#00FFFF",
              color: "#000",
              zIndex: 1201,
              borderRadius: "50%",
              minWidth: "auto",
              padding: 1,
              "&:hover": {
                backgroundColor: "#00CED1",
                boxShadow: "0 0 15px #00FFFF",
              },
            }}
          >
            X
          </Button>
        </Drawer>

        {/* Main content area */}
        <Box
          flexGrow={1}
          display="flex"
          flexDirection="row"
          height="100%"
          alignItems="center"
          justifyContent="center"
          sx={{ marginLeft: drawerOpen ? 240 : 0 }}
        >
          {chartOpen && (
            <Box
              width="50%"
              height="700px"
              sx={{
                overflow: "hidden",
                border: "1px solid #444",
                borderTopLeftRadius: "10px",
                borderBottomLeftRadius: "10px",
                borderColor: "#00ffff",
                boxShadow: "0 0 10px #00FFFF",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <StockChartWidget sy={stockSymbol} key={stockSymbol} />
            </Box>
          )}
          <Stack
            direction="column"
            width="50%"
            height="700px"
            border="1px solid #444"
            p={2}
            spacing={3}
            sx={{
              backgroundColor: "#0A0A0A",
              borderTopRightRadius: "10px",
              borderBottomRightRadius: "10px",
              borderColor: "#00FFFF",
              boxShadow: "0 0 10px #00FFFF",
              overflow: "hidden",
            }}
          >
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ color: "white" }}
            >
              AI Stock Assistant
            </Typography>
            <Stack
              direction="column"
              flexGrow={1}
              overflow="auto"
              spacing={2}
              p={2}
              maxHeight="100%"
            >
              {messages.map((message, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent={
                    message.role === "assistant" ? "flex-start" : "flex-end"
                  }
                >
                  <Box
                    bgcolor={
                      message.role === "assistant" ? "#087f5b" : "#c92a2a"
                    }
                    p={2}
                    borderRadius="10px"
                    width="fit-content"
                    maxWidth="80%"
                    display="flex"
                    alignItems="center"
                    sx={{
                      color: "white",
                      fontFamily: "Roboto, sans-serif",
                      fontWeight: "bold",
                    }}
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
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{
                  input: { color: "white" },
                  label: { color: "white" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "&:hover fieldset": {
                      borderColor: "#00FFFF",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#00FFFF",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "white",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#00FFFF",
                  },
                  "& .MuiInputLabel-root:hover": {
                    color: "#00FFFF",
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={sendMessage}
                sx={{
                  backgroundColor: "#00FFFF",
                  color: "#000000",
                  boxShadow: "0 0 10px #00FFFF",
                  "&:hover": {
                    backgroundColor: "#00CED1",
                    boxShadow: "0 0 15px #00FFFF",
                  },
                }}
              >
                Send
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>

      {/* Toggle button for the drawer */}
      {!drawerOpen && (
        <Button
          onClick={toggleDrawer}
          aria-label="Open drawer"
          sx={{
            position: "absolute",
            top: "50%",
            left: 20,
            backgroundColor: "#00FFFF",
            color: "#000",
            zIndex: 1201,
            borderRadius: "50%",
            minWidth: "auto",
            padding: 1,
            "&:hover": {
              backgroundColor: "#00CED1",
              boxShadow: "0 0 15px #00FFFF",
            },
          }}
        >
          &#9776;
        </Button>
      )}

      {/* Toggle button for the chart */}
      <Button
        onClick={toggleChart}
        aria-label="Toggle stock chart"
        sx={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "#00FFFF",
          color: "#000",
          zIndex: 1201,
          borderRadius: "50%",
          minWidth: "auto",
          padding: 1,
          "&:hover": {
            backgroundColor: "#00CED1",
            boxShadow: "0 0 15px #00FFFF",
          },
        }}
      >
        {chartOpen ? "Hide Chart" : "Show Chart"}
      </Button>
    </Box>
  );
};

export default AiChatAssistant;
