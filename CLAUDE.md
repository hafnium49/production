# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the **AI in Production** course repository - a comprehensive educational course on deploying Gen AI and Agentic AI at scale. The repository contains hands-on projects that progress from simple deployment to complex multi-agent systems on AWS.

## Repository Structure

The repository is organized into weekly modules with companion guides:

- **week1/**: FastAPI deployment basics with Vercel (instant deployment example)
- **week2/**: Building and deploying an AI Digital Twin with Next.js App Router, FastAPI, and OpenAI
- **week3/**: Points to external `cyber` repository (AWS Bedrock agents)
- **week4/**: Points to external `alex` repository (multi-agent systems)
- **finale/**: AWS Bedrock AgentCore with Strands framework - agentic deployment
- **guides/**: Technical foundation materials covering Python, command line, git, debugging, Docker, Terraform, etc.
- **community_contributions/**: Student-contributed resources and fixes

### Important External Repositories

- Week 3 requires cloning: `https://github.com/ed-donner/cyber.git`
- Week 4 requires cloning: `https://github.com/ed-donner/alex.git`

## Project Architecture Patterns

### Week 1: Simple FastAPI + Vercel
- **Backend**: FastAPI with basic routing
- **Deployment**: Vercel serverless with `vercel.json` configuration
- **Stack**: Python (FastAPI, uvicorn), Node.js (Vercel CLI)

### Week 2: Full-Stack AI Twin
- **Frontend**: Next.js 15+ with **App Router** (not Pages Router)
  - Structure: `app/page.tsx` for routes (not `pages/` directory)
  - Client components marked with `'use client'` directive
  - Tailwind CSS v4 (uses `@import 'tailwindcss'` in globals.css)
- **Backend**: FastAPI with OpenAI integration
  - Stateless API design with file-based session memory
  - CORS middleware for frontend communication
  - Environment variables via `.env` file
- **Memory System**: JSON files stored in `memory/` directory for conversation persistence
- **Architecture Pattern**:
  ```
  Browser → Next.js (port 3000) → FastAPI (port 8000) → OpenAI API
                ↑                        ↓
                └──── Memory Files ←────┘
  ```

### Finale: AWS Bedrock AgentCore
- **Framework**: Bedrock AgentCore with Strands agents
- **Architecture**: Containerized agent deployment with AWS infrastructure automation
- **Tools**: Code interpreter, custom Python tools with `@tool` decorator
- **Deployment**: Automated via `agentcore` CLI (container build, ECR push, IAM setup, App Runner)

## Development Setup

### Python Package Management
**Always use `uv` for Python projects** - it's faster than pip and handles environments automatically.

Installation:
- **Mac/Linux**: `curl -LsSf https://astral.sh/uv/install.sh | sh`
- **Windows (PowerShell)**: `powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"`

Common commands:
- `uv init --bare` - Initialize a new project
- `uv python pin 3.12` - Pin Python version
- `uv add -r requirements.txt` - Install from requirements file
- `uv sync` - Sync dependencies from pyproject.toml
- `uv run <script.py>` - Run Python script in managed environment
- `uv run uvicorn server:app --reload` - Run FastAPI server

### Node.js / Frontend Development
- Next.js projects use npm for package management
- Key commands:
  - `npx create-next-app@latest` - Create new Next.js app
  - `npm install <package>` - Install dependencies
  - `npm run dev` - Start development server (typically port 3000)

### Running Development Servers
Multiple terminal windows typically needed:
1. Backend: `cd backend && uv run uvicorn server:app --reload` (port 8000)
2. Frontend: `cd frontend && npm run dev` (port 3000)

## Deployment Patterns

### Vercel (Week 1)
```bash
npm install -g vercel
vercel login
vercel .  # Deploy current directory
```
Configuration via `vercel.json` for Python FastAPI apps.

### AWS Bedrock AgentCore (Finale)
```bash
cd finale
uv sync
uv run agentcore configure -e <script.py> --region us-west-2
uv run agentcore launch
uv run agentcore invoke '{"prompt": "..."}'
```

**Important**: Model availability is region-specific. Claude Sonnet 4 is available in us-west-2. Use `--region us-west-2` flag if your default region differs.

## Common Configuration Files

### Backend (.env files)
**Never commit .env files to git** - they contain API keys.

Typical structure:
```
OPENAI_API_KEY=sk-...
CORS_ORIGINS=http://localhost:3000
```

The root `.gitignore` already excludes `.env` files.

### Next.js with Tailwind v4
Next.js 15.5+ uses Tailwind CSS v4 with different configuration:

**postcss.config.mjs**:
```javascript
export default {
    plugins: {
        '@tailwindcss/postcss': {},
    },
}
```

**globals.css**:
```css
@import 'tailwindcss';
```

## IAM and AWS Setup

For AWS projects (Week 3, 4, Finale):
- Sign in as IAM user `aiengineer` (not root user for day-to-day work)
- Required policies: `AmazonBedrockFullAccess`, `AWSCodeBuildAdminAccess`, `BedrockAgentCoreFullAccess`
- Enable Bedrock model access in appropriate regions (e.g., Claude Sonnet 4 in us-west-2)
- Enable Bedrock AgentCore Observability for debugging

## Troubleshooting Common Issues

### "Connection refused" errors
- Verify all required servers are running
- Check ports: backend typically 8000, frontend typically 3000
- Ensure CORS_ORIGINS in backend .env matches frontend URL

### OpenAI API errors
- Verify API key in `.env` file
- Check account credits at platform.openai.com
- Ensure `.env` file is in the correct directory

### Next.js Tailwind issues
- Ensure using Tailwind v4 syntax (`@import 'tailwindcss'`)
- Check `postcss.config.mjs` uses `@tailwindcss/postcss`
- Clear `.next` directory and restart: `rm -rf .next && npm run dev`

### uv command not found
- Close and reopen terminal after installation
- Verify installation: `uv --version`
- Check PATH includes uv binary location

### Vercel deployment failures
- Ensure all required files present (e.g., `vercel.json`, `requirements.txt`)
- Verify correct directory when running `vercel`
- Check Python version compatibility (3.9-3.12 supported)

### AWS Bedrock region errors
- Claude models may not be available in all regions
- Use `--region us-west-2` for Claude Sonnet 4 availability
- Check model access in Bedrock console for your region

## Key Technical Concepts

### Next.js App Router vs Pages Router
- **App Router** (used in Week 2): `app/page.tsx` for routes, Server Components by default
- **Pages Router** (older): `pages/index.tsx` for routes, `getServerSideProps` for data

### AI Memory Patterns
- **Stateless**: Each request independent (no context)
- **File-based**: JSON files store conversation history by session_id
- Sessions tracked via UUID, passed between frontend and backend

### Strands Agent Framework
- `@tool` decorator: Define tools for agents to use
- `Agent()`: Initialize with system_prompt and tools
- `agent(message)` or `agent.stream_async(message)`: Execute agent

## Getting Help

- Course forum and Q&A on Udemy
- Instructor email: ed@edwarddonner.com
- LinkedIn: https://www.linkedin.com/in/eddonner/
- Course resources: https://edwarddonner.com/2025/09/15/ai-in-production-gen-ai-and-agentic-ai-on-aws-at-scale/

## Important Notes

- **Pull frequently**: Run `git pull` regularly to get latest updates
- **Patience required**: Infrastructure issues are learning opportunities
- **JWT token expiration**: If using AWS Cognito, tokens expire after 60 seconds by default (see community_contributions/jwt_token_60s_fix.md)
- **NextJS version**: Pinned to 15.5.6 (see latest commit)
- **No package.json in root**: This is primarily a learning repository with projects in subdirectories
