// Cloudflare Pages Function for AI chat
import { SYSTEM_PROMPT, TIM_CONTEXT } from '../lib/ai-context';
import { checkRateLimit, getClientIP } from '../lib/rate-limit';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: Message[];
}

// Rate limit: 10 requests per minute per IP
const RATE_LIMIT_CONFIG = {
  maxRequests: 10,
  windowSeconds: 60,
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function onRequestPost(context: any) {
  try {
    const { request, env } = context;

    // Check rate limit
    const clientIP = getClientIP(request);
    const rateLimitResult = await checkRateLimit(
      env.RATE_LIMIT_KV,
      `chat:${clientIP}`,
      RATE_LIMIT_CONFIG
    );

    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({
          error: `Looks like you're really interested! I've hit my limit for now, but Tim would love to chat directly. Use the contact form below or connect on LinkedIn.`,
        }),
        {
          status: 429,
          headers: {
            ...CORS_HEADERS,
            'Retry-After': String(rateLimitResult.resetIn),
          },
        }
      );
    }

    // Check for API key
    if (!env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Chat service not configured' }),
        { status: 500, headers: CORS_HEADERS }
      );
    }

    const body: ChatRequest = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Limit conversation length to prevent abuse
    const MAX_MESSAGES = 20;
    const trimmedMessages = messages.slice(-MAX_MESSAGES);

    // Build the full system prompt with context
    const fullSystemPrompt = `${SYSTEM_PROMPT}\n\n## Detailed Context\n\n${TIM_CONTEXT}`;

    // Call Anthropic API
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: fullSystemPrompt,
        messages: trimmedMessages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
      }),
    });

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      console.error('Anthropic API error:', anthropicResponse.status, errorText);

      if (anthropicResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Too many requests. Please try again in a moment.' }),
          { status: 429, headers: CORS_HEADERS }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to get response from AI' }),
        { status: 500, headers: CORS_HEADERS }
      );
    }

    const anthropicData = await anthropicResponse.json();

    // Extract the assistant's message
    const assistantMessage = anthropicData.content?.[0]?.text || 'I apologize, but I was unable to generate a response.';

    return new Response(
      JSON.stringify({
        message: assistantMessage,
        usage: anthropicData.usage,
      }),
      { status: 200, headers: CORS_HEADERS }
    );

  } catch (error) {
    console.error('Chat endpoint error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function onRequestGet() {
  return new Response(
    JSON.stringify({ error: 'Method not allowed. Use POST.' }),
    { status: 405, headers: CORS_HEADERS }
  );
}
