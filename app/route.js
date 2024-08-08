import { NextResponse } from "next/server";
import { OpenAI } from "openai";  // Adjust import as necessary

const systemPrompt = `You are an AI-powered customer support assistant for BanglaBulls, a platform that provides stock trading services for individual investors.

1. BanglaBulls offers a secure and user-friendly platform for stock trading, market analysis, and portfolio management.
2. Our platform helps users with real-time stock data, trading strategies, and investment insights.
3. We cover a wide range of topics including stock trading basics, advanced trading strategies, market trends, and technical analysis.
4. Users can access our services through our website or mobile app.
5. If asked about technical issues, guide users to our troubleshooting page or suggest contacting our technical support team.
6. Always maintain user privacy and do not share personal information.
7. If you're unsure about any information, it's okay to say you don't know and offer to connect the user with a human representative.

Your goal is to provide accurate information, assist with common inquiries, and ensure a positive experience for all BanglaBulls users.`;

export async function POST(req) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const data = await req.json();

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: systemPrompt,
            },
            {
                ...data,
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
                controller.error(err);
            } finally {
                controller.close();
            }
        },
    });

    return new NextResponse(stream);
}
