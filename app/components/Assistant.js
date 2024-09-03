"use client";
import React, { useState } from "react";
import { Box, Stack, Typography, TextField, Button } from "@mui/material";
import useStockStore from "../useUserstore";

export default function Assistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "I am an AI-powered customer support assistant, how can I help you?",
    },
  ]);
  const setSymbol = useStockStore((state) => state.setSymbol);
  const [message, setMessage] = useState("");
  const [stockSymbol, setStockSymbol] = useState("");

  const sendMessage = async () => {
    // Clear the input field and update the messages state to include the new user message
    setMessage("");
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    try {
      // Fetch the response from the chat API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: message }]),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = ""; // Variable to store the entire response

      // Function to handle reading the stream
      const processText = ({ done, value }) => {
        if (done) {
          // When the stream is complete, log the full accumulated result
          extractTickerJSON(result);
          return;
        }

        // Decode the current chunk of text
        const text = decoder.decode(value || new Int8Array(), { stream: true });
        result += text; // Accumulate the streamed text

        // Update the last message in the state with the accumulated result so far
        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];
          const otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: result, // Update the message with the accumulated result
            },
          ];
        });

        // Continue reading the stream
        return reader.read().then(processText);
      };

      // Start reading the stream and handle potential errors
      reader
        .read()
        .then(processText)
        .catch((error) => {
          console.error("Error reading from the stream:", error);
        });
    } catch (error) {
      console.error("Error while sending the message:", error);
    }
  };

  const extractTickerJSON = (text) => {
    // Use a regular expression to extract the ticker JSON part, capturing everything inside the backticks
    const jsonStringMatch = text.match(
      /```json\s*("ticker":\s*\[\s*{[^}]*}\s*\])\s*```/s
    );

    // Check if jsonStringMatch is not null and has a valid match
    if (jsonStringMatch && jsonStringMatch[1]) {
      // Extracted JSON string
      const jsonString = `{ ${jsonStringMatch[1]} }`; // Properly wrap in {}

      // Parse the JSON object
      try {
        const jsonObject = JSON.parse(jsonString);

        // Use the JSON object
        const newSymbol = jsonObject.ticker[0].symbol; // Output: TSLA
        setStockSymbol(`NASDAQ:${newSymbol}`);
        if (newSymbol) {
          setSymbol(newSymbol);
        }
        // Perform additional actions with the extracted JSON object here
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("No ticker JSON object found in the response.");
    }
  };

  return (
    <Stack
      direction="column"
      width="80%"
      height="700px"
      p={2}
      spacing={3}
      sx={{
        backgroundColor: "#0A0A0A",
        borderTopRightRadius: "10px",
        borderBottomRightRadius: "10px",
        overflow: "hidden",
      }}
    >
      <Stack
        direction="column"
        flexGrow={1}
        overflow="auto"
        spacing={2}
        p={2}
        maxHeight="100%"
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
              p={2}
              borderRadius="10px"
              width="fit-content"
              maxWidth="80%"
              display="flex"
              alignItems="center"
              sx={{
                color: msg.role === "assistant" ? "#212529" : "#f8f9fa",
                fontFamily: "Roboto, sans-serif",
                fontWeight: "bold",
                backgroundColor:
                  msg.role === "assistant" ? "#f8f9fa" : "#212529",
              }}
            >
              {msg.content}
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
  );
}
