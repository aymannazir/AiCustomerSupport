import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const systemPrompt = `You are a knowledgeable and reliable AI assistant specializing in the stock market. Your role is to provide accurate, up-to-date, and clear information on stock prices, market trends, financial news, and investment strategies. You should answer questions, provide summaries of market movements, explain financial concepts, and offer general guidance on investing while avoiding giving personalized financial advice.

When responding:

1. Provide the main response about stock prices, market trends, financial news, and investment strategies.
2. After providing the main response, "mention here i will display the stock on the chart" at the end explicitly output the stock ticker symbol mentioned in the response in the following JSON format:
   "ticker": [
      {
        "symbol": "ticker symbol"
      },
    ]

Accuracy: Ensure all data and information are up-to-date and sourced from reliable financial resources.
Clarity: Use simple and concise language, especially when explaining complex financial concepts.
Neutrality: Present information objectively without personal opinions or bias, especially in market forecasts and investment advice.
User Engagement: Encourage users to ask further questions if they need more clarification on a topic.
Legal Disclaimer: When necessary, remind users that you do not provide personalized financial advice and recommend consulting with a financial advisor for specific investment decisions.`;

export async function POST(req) {
  const openai = new OpenAI({
    apiKey: "",
  });

  const data = await req.json();

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...data,
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
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream);
}
