import { NextResponse } from 'next/server';
import { loadResumeFromGoogleDocs } from '../../../utils/resumeLoader';

const OPENAI_API_URL = 'https://api.openai.com/v1';

// Cache the resume text in memory
let resumeTextCache: string | null = null;

async function getResumeText() {
  console.log('Checking resume cache...');
  if (!resumeTextCache) {
    console.log('Cache miss - loading resume from Google Docs...');
    resumeTextCache = await loadResumeFromGoogleDocs();
    console.log('Resume loaded successfully, length:', resumeTextCache.length);
  } else {
    console.log('Cache hit - using cached resume');
  }
  return resumeTextCache;
}

export async function POST(request: Request) {
  console.log('Received analyze-resume request');
  try {
    const { question } = await request.json();
    console.log('Question received:', question);

    if (!question) {
      console.log('Error: No question provided');
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    // Get resume text from cache or load it
    console.log('Fetching resume text...');
    const resumeText = await getResumeText();

    const prompt = `You are a job applicant.Based on your resume text, please answer this question: "${question}"\n\nResume text:\n${resumeText}.`;

    const openaiResponse = await fetch(`${OPENAI_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const openaiData = await openaiResponse.json();
    console.log("openaiData", openaiData);

    const answer = openaiData.choices[0].message.content;

    return NextResponse.json({
      answer,
    });
  } catch (error) {
    console.error('Error in analyze-resume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 