# OpenRouter API Integration Guide

## What is OpenRouter?

OpenRouter is a unified API that provides access to multiple AI models including:
- **OpenAI**: GPT-4, GPT-4o
- **Anthropic**: Claude 3 (Opus, Sonnet, Haiku)
- **Meta**: Llama 2 70B Chat
- **Mistral**: Mistral models
- **Google**: Gemini models
- And many more!

Visit: https://openrouter.io

## Getting Started

### 1. Create OpenRouter Account

1. Go to https://openrouter.io
2. Sign up for a free account
3. Go to https://openrouter.io/keys
4. Create and copy your API key

### 2. Update .env File

```env
# Required
OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxxxxxxxxxxxxx

# Optional - Choose a model (defaults to Llama 2 70B)
OPENROUTER_MODEL=gpt-4o

# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/portfolio
```

### 3. Available Models

#### Free/Credit-Based Models:
- `meta-llama/llama-2-70b-chat` - Fast, good quality
- `mistral/mistral-7b-instruct` - Lightweight
- `microsoft/phi-3-mini` - Fast, efficient

#### Premium Models:
- `gpt-4o` - Latest GPT-4 Omni
- `gpt-4-turbo` - Previous GPT-4
- `claude-3-opus` - Anthropic's most capable
- `claude-3-sonnet` - Balanced performance
- `google/gemini-2.0-flash-001` - Google's fast model

### 4. Start Application

```bash
npm start
```

The app will use OpenRouter for:
- **Resume Parsing**: Parse resumes into structured portfolio data
- **AI Chat Agent**: Answer questions about the profile based on portfolio data

## API Endpoints

### Resume Generation

```bash
curl -X POST http://localhost:3000/api/portfolio/generate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your resume text here...",
    "defaultName": "Your Name"
  }'
```

### Chat Agent

```bash
curl -X POST http://localhost:3000/api/portfolio/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "What are your skills?"}],
    "portfolioData": { ... }
  }'
```

## Pricing

OpenRouter offers flexible pricing:
- Free trial credits for testing
- Pay-as-you-go model pricing
- Different models have different costs
- View pricing: https://openrouter.io/models

## Features

- **Model Flexibility**: Switch between models by changing `OPENROUTER_MODEL` in .env
- **Cost Optimization**: Use cheaper models for simple tasks
- **Fallback Support**: Can switch models if one fails
- **API Monitoring**: Track usage at https://openrouter.io/activity

## Troubleshooting

### "API Key Not Configured"
- Ensure `OPENROUTER_API_KEY` is set in `.env`
- Restart the application after updating `.env`
- Check your API key is valid at https://openrouter.io/keys

### "Model Not Available"
- Some models may have rate limits
- Try switching to a different model in `.env`
- Check https://openrouter.io/models for availability

### "API Error"
- Check your OpenRouter account credits
- Verify internet connection
- Check server logs for detailed error messages

## Model Comparison

| Model | Speed | Cost | Quality | Use Case |
|-------|-------|------|---------|----------|
| Llama 2 70B | Fast | Free | Good | General purpose |
| Mistral Medium | Fast | Low | Good | Budget-friendly |
| GPT-4o | Medium | Medium | Excellent | Complex tasks |
| Claude 3 Opus | Medium | High | Best | High accuracy needed |

## Environment Variables

```env
# Required
OPENROUTER_API_KEY=sk-or-YOUR_KEY

# Optional
OPENROUTER_MODEL=meta-llama/llama-2-70b-chat  # Defaults if not set
MONGODB_URI=mongodb://localhost:27017/portfolio
NODE_ENV=development
```

## Tips & Best Practices

1. **Testing**: Start with Llama 2 (free) for testing
2. **Production**: Use GPT-4o or Claude 3 for better results
3. **Cost Monitoring**: Keep track of API usage at https://openrouter.io/activity
4. **Error Handling**: The app handles failures gracefully
5. **Rate Limits**: OpenRouter respects rate limits - should not be an issue for typical usage

## Support

For OpenRouter help: https://openrouter.io/docs
For this application: Check logs and error messages in terminal
