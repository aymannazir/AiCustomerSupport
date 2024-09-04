"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  ListItemButton,
  ListItemText,
  List,
  Drawer,
  Typography,
  Stack,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation"; // Import useRouter
import useStockStore from "./useUserstore";
import StockChartWidget from "./StockChartWidget"; // Adjust the path as necessary
import { OpenIcon, CloseIcon, GraphIcon } from "./icons"; // Adjust the path as necessary

export default function Home() {
  const router = useRouter(); // Initialize the router

  // -------------------- Drawer States and Handlers --------------------
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  // -------------------- Chart States and Handlers --------------------
  const [chartOpen, setChartOpen] = useState(false);
  const symbol = useStockStore((state) => state.symbol);
  const toggleChart = () => setChartOpen((prev) => !prev);

  useEffect(() => {
    if (symbol !== "") {
      setChartOpen(true);
    }
  }, [symbol]);

  // -------------------- AI Chat Assistant States and Handlers --------------------
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "I am an AI-powered customer support assistant, how can I help you?",
    },
  ]);
  const setSymbolStore = useStockStore((state) => state.setSymbol);
  const [message, setMessage] = useState("");
  const [stockSymbol, setStockSymbol] = useState("");

  const sendMessage = async () => {
    if (message.trim() === "") return; // Prevent sending empty messages

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);
    setMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ...messages,
          { role: "user", content: message },
        ]),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      const processText = ({ done, value }) => {
        if (done) {
          extractTickerJSON(result);
          return;
        }

        const text = decoder.decode(value || new Int8Array(), { stream: true });
        result += text;

        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          const otherMessages = prevMessages.slice(0, prevMessages.length - 1);
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: result,
            },
          ];
        });

        return reader.read().then(processText);
      };

      reader.read().then(processText).catch((error) => {
        console.error("Error reading from the stream:", error);
      });
    } catch (error) {
      console.error("Error while sending the message:", error);
    }
  };

  const extractTickerJSON = (text) => {
    const jsonStringMatch = text.match(
      /```json\s*("ticker":\s*\[\s*{[^}]*}\s*\])\s*```/s
    );

    if (jsonStringMatch && jsonStringMatch[1]) {
      const jsonString = `{ ${jsonStringMatch[1]} }`;

      try {
        const jsonObject = JSON.parse(jsonString);
        const newSymbol = jsonObject.ticker[0].symbol;
        setStockSymbol(`NASDAQ:${newSymbol}`);
        if (newSymbol) {
          setSymbolStore(newSymbol);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("No ticker JSON object found in the response.");
    }
  };

  // -------------------- Navigation Handlers --------------------
  const handleNavigateToHome = () => {
    router.push("/"); // Navigate to the homepage (assumes the homepage is in the root route)
  };

  const handleNavigateToAIChat = () => {
    router.push("/AIChatAssistant"); // Navigate to the AI Chat page (adjust route as necessary)
  };

  // -------------------- Rendered UI --------------------
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
      {/* Title Bar */}
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
        <Typography variant="h4">stockLink</Typography>
      </Box>

      {/* Main Content Area */}
      <Box
        display="flex"
        flexDirection="row"
        height="calc(100% - 60px)"
        width="100%"
        justifyContent="center"
        alignItems="center"
        sx={{ position: "relative" }}
      >
        {/* Drawer (Sidebar) */}
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
            <ListItemButton onClick={handleNavigateToHome}>
              <ListItemText primary="Home" />
            </ListItemButton>
            <ListItemButton onClick={handleNavigateToAIChat}>
              <ListItemText primary="AI Assistant" />
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Graph" />
            </ListItemButton>
          </List>
          {/* Close Button for Drawer */}
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
            <CloseIcon />
          </Button>
        </Drawer>

        {/* Main Content Flex Container */}
        <Box
          flexGrow={1}
          display="flex"
          flexDirection="row"
          height="100%"
          alignItems="center"
          justifyContent="center"
          sx={{ marginLeft: drawerOpen ? 240 : 0, padding: 2 }}
        >
          {/* Stock Chart Widget */}
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
                marginRight: 2,
              }}
            >
              <StockChartWidget sy={symbol} key={symbol} />
            </Box>
          )}

          {/* AI Chat Assistant Interface */}
          <Stack
            direction="column"
            width={chartOpen ? "50%" : "80%"}
            height="700px"
            p={2}
            spacing={3}
            sx={{
              backgroundColor: "#0A0A0A",
              borderTopRightRadius: "10px",
              borderBottomRightRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 0 10px #00FFFF",
            }}
          >
            {/* Messages Display */}
            <Stack
              direction="column"
              flexGrow={1}
              overflow="auto"
              spacing={2}
              p={2}
              maxHeight="100%"
              sx={{
                backgroundColor: "#0A0A0A",
              }}
            >
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent={
                    msg.role === "assistant" ? "flex-start" : "flex-end"
                  }
                >
                  <Box
                    px={2}
                    py={1}
                    borderRadius="10px"
                    bgcolor={
                      msg.role === "assistant" ? "#0078D4" : "#00FFFF"
                    }
                    color="#FFF"
                    sx={{ maxWidth: "70%" }}
                  >
                    {msg.content}
                  </Box>
                </Box>
              ))}
            </Stack>

            {/* Message Input Box */}
            <Stack direction="row" spacing={2} width="100%">
              <TextField
                fullWidth
                placeholder="Enter your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{
                  input: { color: "#00FFFF" },
                  borderColor: "#00FFFF",
                }}
              />
              <Button
                onClick={sendMessage}
                variant="contained"
                sx={{
                  bgcolor: "#00FFFF",
                  color: "#000",
                  "&:hover": {
                    bgcolor: "#00CED1",
                    boxShadow: "0 0 15px #00FFFF",
                  },
                }}
              >
                Send
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* Drawer Open Button */}
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
            <OpenIcon />
          </Button>
        )}
      </Box>
    </Box>
  );
}
