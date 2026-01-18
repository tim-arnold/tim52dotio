// Cloudflare Pages Function for fit assessment
import { TIM_CONTEXT } from '../lib/ai-context';
import { checkRateLimit, getClientIP } from '../lib/rate-limit';

interface FitRequest {
  jobDescription: string;
}

interface FitVerdict {
  verdict: 'strong_fit' | 'worth_conversation' | 'probably_not';
  summary: string;
  strengths: string[];
  gaps: string[];
  recommendation: string;
}

// Rate limit: 5 requests per minute per IP (more restrictive since this is heavier)
const RATE_LIMIT_CONFIG = {
  maxRequests: 5,
  windowSeconds: 60,
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

const FIT_ASSESSMENT_PROMPT = `You are a fit assessment tool for Tim Arnold's portfolio. Your job is to honestly evaluate whether Tim is a good match for a given job description.

## Critical Instructions

1. **Be brutally honest**: Do not try to make Tim sound like a fit for every role. If the role needs skills Tim doesn't have, say so clearly.

2. **Anti-sycophancy**: You are explicitly permitted and ENCOURAGED to say "Tim is probably not the right person for this role." This is valuable - it saves everyone's time.

3. **No hedging**: Don't say things like "while Tim hasn't done X specifically, his transferable skills could..." If he hasn't done it, acknowledge that gap directly.

4. **Specificity over generality**: Cite specific projects, technologies, and experiences. Don't make vague claims.

## Your Response Format

You must respond with valid JSON matching this structure:
{
  "verdict": "strong_fit" | "worth_conversation" | "probably_not",
  "summary": "2-3 sentence honest assessment",
  "strengths": ["specific strength 1", "specific strength 2"],
  "gaps": ["specific gap 1", "specific gap 2"],
  "recommendation": "Clear next step or honest advice"
}

## Verdict Guidelines

**strong_fit**: Tim has direct, relevant experience in 70%+ of the core requirements. He's done this type of work before and can point to specific examples.

**worth_conversation**: Tim has relevant experience in some areas but gaps in others. There's enough overlap that a conversation could reveal whether it's a match.

**probably_not**: The role requires core skills Tim doesn't have, or is in a domain where his experience doesn't transfer well. Be direct about this - it's the most valuable signal you can give.

## Tim's Background

${TIM_CONTEXT}

## Analysis Approach

1. Identify the 3-5 core requirements of the role
2. For each, assess Tim's actual experience (not theoretical ability to learn)
3. Be specific about what transfers and what doesn't
4. Give a clear verdict with reasoning
`;

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
      `fit:${clientIP}`,
      RATE_LIMIT_CONFIG
    );

    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({
          error: `You've been exploring a lot of roles! If you'd like to discuss fit in more detail, use the contact form below or connect with Tim on LinkedIn.`,
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

    if (!env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Assessment service not configured' }),
        { status: 500, headers: CORS_HEADERS }
      );
    }

    const body: FitRequest = await request.json();
    const { jobDescription } = body;

    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 50) {
      return new Response(
        JSON.stringify({ error: 'Please provide a complete job description (at least 50 characters)' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Limit job description length
    const trimmedJD = jobDescription.slice(0, 8000);

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: FIT_ASSESSMENT_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Please analyze this job description and assess fit:\n\n${trimmedJD}`,
          },
        ],
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
        JSON.stringify({ error: 'Failed to analyze job description' }),
        { status: 500, headers: CORS_HEADERS }
      );
    }

    const anthropicData = await anthropicResponse.json();
    const responseText = anthropicData.content?.[0]?.text || '';

    // Try to parse the JSON response
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const assessment: FitVerdict = JSON.parse(jsonMatch[0]);

      // Validate the verdict
      if (!['strong_fit', 'worth_conversation', 'probably_not'].includes(assessment.verdict)) {
        assessment.verdict = 'worth_conversation';
      }

      return new Response(
        JSON.stringify({
          assessment,
          usage: anthropicData.usage,
        }),
        { status: 200, headers: CORS_HEADERS }
      );

    } catch (parseError) {
      console.error('Failed to parse assessment response:', parseError, responseText);

      // Return a fallback response
      return new Response(
        JSON.stringify({
          assessment: {
            verdict: 'worth_conversation',
            summary: responseText.slice(0, 500),
            strengths: [],
            gaps: [],
            recommendation: 'Unable to parse structured assessment. Please review the summary above.',
          },
        }),
        { status: 200, headers: CORS_HEADERS }
      );
    }

  } catch (error) {
    console.error('Fit assessment error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function onRequestGet() {
  return new Response(
    JSON.stringify({ error: 'Method not allowed. Use POST with a job description.' }),
    { status: 405, headers: CORS_HEADERS }
  );
}
