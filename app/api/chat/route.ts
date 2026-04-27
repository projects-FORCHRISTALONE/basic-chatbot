// BY GOD'S GRACE ALONE

import {streamText, convertToModelMessages, stepCountIs } from 'ai'
import { getWeather } from './tools'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request){
    try{
        const {messages} = await req.json()

        const result = streamText({
            model: 'mistral/devstral-small-2',
            messages: await convertToModelMessages(messages),
            system: `You are a helpful assistant`,
            tools: {getWeather},
            stopWhen: stepCountIs(5)

        })

        return result.toUIMessageStreamResponse()
    } catch (error){
        console.error("Chat API error:", error)

        // Returning a proper error response
        return new Response(
            JSON.stringify({
                error: "Failed to process chat request",
                details: error instanceof Error ? error.message : "Unknown error",
            }),
            {
                status: 500,
                headers: {"Content-Type": "application/json"}
            }
        )
    } 
}