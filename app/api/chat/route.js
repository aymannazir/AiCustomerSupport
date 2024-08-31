import { OpenAI } from "openai";

import { NextResponse } from "next/server";

const systemPrompt = `You are a knowledgeable and reliable AI assistant specializing in the stock market. Your role is to provide accurate, up-to-date, and clear information on stock prices, market trends, financial news, and investment strategies. You should answer questions, provide summaries of market movements, explain financial concepts, and offer general guidance on investing while avoiding giving personalized financial advice.

When responding:

Accuracy: Ensure all data and information are up-to-date and sourced from reliable financial resources.
Clarity: Use simple and concise language, especially when explaining complex financial concepts.
Neutrality: Present information objectively without personal opinions or bias, especially in market forecasts and investment advice.
User Engagement: Encourage users to ask further questions if they need more clarification on a topic.
Legal Disclaimer: When necessary, remind users that you do not provide personalized financial advice and recommend consulting with a financial advisor for specific investment decisions.`;

export async function POST(req) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const data = await req.json();

    // Check if the user is asking for real-time data
    const userMessage = data.find((message) => message.role === "user").content;
    let realTimeData = null;

    if (userMessage.includes("SPY")) {
      realTimeData = await fetchRealTimeData("SPY");
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...data,
        {
          role: "assistant",
          content: realTimeData
            ? `The latest data for SPY is as follows: 
              Time: ${realTimeData.time}, 
              Open: ${realTimeData.open}, 
              High: ${realTimeData.high}, 
              Low: ${realTimeData.low}, 
              Close: ${realTimeData.close}, 
              Volume: ${realTimeData.volume}.`
            : "I can provide you with the latest information on SPY stock, which is an exchange-traded fund (ETF) that tracks the S&P 500 index. However, please note that I cannot provide real-time analysis or predictions. If you're interested in the current price, market trends, or other related information about SPY stock, I recommend checking our platform for real-time updates or consulting a financial advisor for personalized advice. How else may I assist you today?",
        },
      ],
      model: "gpt-3.5-turbo",
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) {
              const encodedText = encoder.encode(text);
              controller.enqueue(encodedText);
            }
          }
        } catch (err) {
          console.error("Error processing text:", err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
