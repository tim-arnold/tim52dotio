# AI Portfolio Interface Feature Plan

## Overview

This document outlines the plan to integrate an AI-powered interactive interface into the portfolio site, inspired by [Nate's Substack article](https://natesnewsletter.substack.com/p/grab-the-fit-assessment-prompt-that) on escaping the application pile.

**Core Concept**: Instead of presenting static credentials that get filtered in 6 seconds, create an interactive AI interface that lets visitors query your background, discover depth through conversation, and assess mutual fit.

## Source Material

- Article: "Why it's time to escape the application pile + the exact site I shipped"
- Demo site mentioned: Marcus Chen (fictional staff platform engineer)
- Original built with: Lovable (AI app builder) + Supabase
- Reference files: `docs/planning/newAItool.html`, `docs/planning/newAItool.txt`

## Core Features

### 1. AI Chat Interface ("Ask AI About Me")
- Visitors can ask questions about background, experience, projects
- AI responds with specific, detailed answers grounded in actual work
- Demonstrates depth that can't be faked with polished bullet points

### 2. Fit Assessment Tool
- Paste a job description
- AI analyzes it against actual experience
- Returns honest assessment: "Strong fit", "Worth conversation", or "Probably not"
- **Key differentiator**: Willing to tell employers when NOT a good match
- Signals confidence and self-awareness

### 3. Expanded Context Behind Achievements
- Resume bullet points with "View AI Context" buttons
- Click to reveal the real story (stakeholder challenges, actual approach, lessons learned)
- Shows depth beyond "Reduced costs by $X"

### 4. Honest Skills Matrix
- Three columns: Strong, Moderate, Gaps I'll Tell You About
- Openly listing gaps signals confidence and self-awareness
- Refreshing for hiring managers drowning in candidates claiming expertise in everything

## Technical Considerations

### Current Architecture
- Next.js 15.3 static export (`output: 'export'`)
- Deployed to Cloudflare Pages
- Sanity CMS for content (in progress on `professional-sanity` branch)
- No server-side API routes in static export

### Implementation Options

#### Option A: Client-Side API Calls
- Call AI API (OpenAI/Anthropic) directly from browser
- **Pros**: Simple, works with static export
- **Cons**: Exposes API key (need proxy), no server-side context injection

#### Option B: Cloudflare Functions
- Use Cloudflare Pages Functions for AI API calls
- **Pros**: Secure API keys, can inject context server-side
- **Cons**: Requires moving away from pure static export or adding functions directory

#### Option C: External Backend
- Separate API (Supabase Edge Functions, Vercel, etc.)
- **Pros**: Full control, matches original Lovable implementation
- **Cons**: Additional infrastructure to manage

#### Option D: Hybrid with Sanity
- Store AI context/prompts in Sanity CMS
- Use Cloudflare Functions for API calls
- **Pros**: Content management for AI context, integrates with existing CMS work
- **Cons**: More complex setup

### Recommended Approach
**Option B or D** - Cloudflare Functions provide the right balance of security and integration with the existing Cloudflare Pages deployment. If Sanity integration is valuable for managing AI context (system prompts, experience details), Option D makes sense.

## Content Requirements

### AI Context Document
Need to create comprehensive context for the AI including:
- Career narrative and philosophy
- Detailed project descriptions (not just bullet points)
- Technical skills with honest depth assessment
- Working style and preferences
- What I'm looking for vs. what I'm not
- Gaps and areas I'm actively developing

### System Prompts
- Main chat prompt: How to represent background, cite specific work, acknowledge limitations
- Fit assessment prompt: Structured analysis, anti-sycophancy instructions, permission to reject
- Calibration examples showing what honest assessment looks like

## User Experience

### Entry Points
- "Ask AI About Me" button on main page or dedicated section
- Fit assessment tool in a separate view or modal
- "View AI Context" buttons on experience items

### Conversation Design
- Welcome message explaining what visitors can ask
- Suggested starter questions
- Clear indication this is AI representing the site owner
- Graceful handling of off-topic questions

## Questions to Resolve

1. **Which AI provider?** OpenAI (GPT-4), Anthropic (Claude), or both?
2. **Rate limiting?** How to prevent abuse without friction for legitimate visitors
3. **Analytics?** Track what questions are asked to improve context over time
4. **Privacy?** What's stored, what's logged, what's disclosed to visitors
5. **Fallback?** What happens when API is down or rate limited
6. **Mobile UX?** Chat interface design for smaller screens
7. **Integration depth?** Standalone feature or deeply integrated with existing sections

## Phased Implementation

### Phase 1: Foundation
- Set up Cloudflare Functions
- Create AI context document
- Build basic chat interface component
- Implement single AI provider integration

### Phase 2: Core Features
- Fit assessment tool
- Expanded context on experience items
- Skills matrix with honest gaps
- Basic analytics

### Phase 3: Polish
- Conversation history within session
- Suggested questions based on visitor context
- Mobile optimization
- Rate limiting and abuse prevention

### Phase 4: Iteration
- Analyze questions asked
- Refine prompts based on usage
- A/B test different approaches
- Expand context based on gaps

## Success Metrics

- **Engagement**: Do visitors actually use the AI interface?
- **Depth**: Are conversations multi-turn or single question?
- **Conversion**: Does AI interaction lead to more contact/outreach?
- **Quality**: Are AI responses accurate and appropriately detailed?
- **Differentiation**: Does this make the portfolio memorable?

## Open Questions for Discussion

1. Is this the right priority given other site work (Sanity integration, etc.)?
2. What's the minimum viable version to ship and learn from?
3. Should this replace traditional experience section or complement it?
4. How much personal context am I comfortable sharing with an AI that anyone can query?

## References

- [Original article](https://natesnewsletter.substack.com/p/grab-the-fit-assessment-prompt-that)
- [GitHub repo: sample-ai-resume](https://github.com/komodo170845/sample-ai-resume) - source code for the demo
- Lovable: AI-powered app builder used for original demo
- Supabase: Used for database/edge functions in original
