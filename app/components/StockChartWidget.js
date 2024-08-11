import React, { useEffect } from "react";

const StockChartWidget = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "NASDAQ:AAPL",
      interval: "D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "5",
      locale: "en",
      allow_symbol_change: true,
      details: true,
      calendar: false,
      studies: ["STD;24h%Volume"],
      support_host: "https://www.tradingview.com",
    });
    document
      .getElementById("tradingview-widget-container__widget")
      .appendChild(script);
  }, []);

  return (
    <div
      className="tradingview-widget-container"
      style={{ height: "100%", width: "100%" }}
    >
      <div
        id="tradingview-widget-container__widget"
        style={{
          height: "calc(100% - 32px)",
          width: "100%",
          backgroundColor: "#ffff",
        }}
      ></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
};

export default StockChartWidget;
