"use client";
import { useState, useEffect } from "react";
import StockChartWidget from "./components/StockChartWidget";
import Assistant from "./components/Assistant";
import useStockStore from "./useUserstore";

import {
  Box,
  Button,
  ListItemButton,
  ListItemText,
  List,
  Drawer,
  Typography,
} from "@mui/material";
import { OpenIcon, CloseIcon, GraphIcon } from "./components/icons";

export default function Home() {
  const [chartOpen, setChartOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const symbol = useStockStore((state) => state.symbol);

  const toggleChart = () => {
    setChartOpen(!chartOpen);
  };

  useEffect(() => {
    if (symbol !== "") {
      setChartOpen(true);
    }
  }, [symbol]); // Dependency array ensures this runs only when `symbol` changes

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
          height: "60px", // Adjust as needed
          borderBottom: "1px solid #00FFFF",
          zIndex: 1201,
        }}
      >
        <Typography variant="h4">stockLink</Typography>
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        height="calc(100% - 60px)" // Adjust height to account for the title bar
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
          {/* Close button for the drawer */}
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
              <StockChartWidget sy={symbol} key={symbol} />
            </Box>
          )}
          <Assistant />
        </Box>
      </Box>

      {/* Toggle button for drawer */}
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
      <Button
        variant="contained"
        onClick={toggleChart}
        aria-label={chartOpen ? "Close chart" : "Open chart"}
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          background: "#00FFFF",
          color: "#000",
          zIndex: 1201,
          "&:hover": {
            backgroundColor: "#00CED1",
            boxShadow: "0 0 15px #00FFFF",
          },
        }}
      >
        <GraphIcon />
      </Button>
    </Box>
  );
}
