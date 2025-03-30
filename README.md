# Resume AI - Vercel Function with Leonardo AI and OpenAI Integration

This project demonstrates how to create a Vercel function that integrates both Leonardo AI for image generation and OpenAI for text generation.

## Prerequisites

- A Vercel account
- An OpenAI API key
- A Leonardo AI API key
- Terraform installed on your machine

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   - Create a `.env.local` file with your API keys:
     ```
     OPENAI_API_KEY=your_openai_api_key
     LEONARDO_API_KEY=your_leonardo_api_key
     VERCEL_TOKEN=your_vercel_token
     ```

4. Initialize Terraform:
   ```bash
   terraform init
   ```

5. Deploy the infrastructure:
   ```bash
   terraform apply
   ```

## API Usage

The API endpoint is available at `/api/generate`. Send a POST request with the following body:

```json
{
  "prompt": "Your prompt here",
  "model": "gpt-3.5-turbo" // optional, defaults to gpt-3.5-turbo
}
```

The response will include both the generated text and image URL:

```json
{
  "text": "Generated text from OpenAI",
  "image": "URL of the generated image from Leonardo AI"
}
```

## Development

To run the project locally:

```bash
npm run dev
```

The development server will start at `http://localhost:3000`. 