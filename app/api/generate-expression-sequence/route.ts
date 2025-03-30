import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const LEONARDO_API_URL = 'https://cloud.leonardo.ai/api/rest/v1';

interface ExpressionResult {
  expression: string;
  imageUrl: string;
}

const EXPRESSION = {
  name: 'avatar',
  prompt: 'The background is clean and minimalistic, either plain white or a soft gradient, eyes are green-colored, european slavic phenotype, wide smile. The avatar should look polished yet natural, suitable for a resume website'
};

async function uploadImage(imageBuffer: Buffer): Promise<string> {
  const initResponse = await fetch(`${LEONARDO_API_URL}/init-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.LEONARDO_API_KEY}`,
    },
    body: JSON.stringify({
      extension: 'jpg'
    }),
  });

  const initData = await initResponse.json();
  const fieldsObj = JSON.parse(initData.uploadInitImage.fields);
  const { url, id } = initData.uploadInitImage;

  const formData = new FormData();
  Object.entries(fieldsObj).forEach(([key, value]) => {
    formData.append(key, value as string);
  });
  formData.append('file', new Blob([imageBuffer]));

  const uploadResponse = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  
  if (!uploadResponse.ok) {
    throw new Error('Image upload failed');
  }

  return id;
}

export async function POST(request: Request) {
  try {
    const imagePath = path.join(process.cwd(), 'public', 'ava-n3.jpg');
    const imageBuffer = fs.readFileSync(imagePath);
    
    const imageId = await uploadImage(imageBuffer);
    
    const leonardoResponse = await fetch(`${LEONARDO_API_URL}/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TF_VAR_leonardo_api_key}`,
      },
      body: JSON.stringify({
        prompt: EXPRESSION.prompt,
        num_images: 1,
        photoRealVersion: "v1",
        width: 1024,
        height: 1024,
        init_image_id: imageId,
        init_strength: 0.8,
        presetStyle: "CINEMATIC",
        alchemy: true,
        photoReal: true,
      }),
    });

    const leonardoData = await leonardoResponse.json();
    const generationId = leonardoData.sdGenerationJob.generationId;
    let generatedImageUrl;

    await new Promise(resolve => setTimeout(resolve, 10000));
    
    while (true) {
      const statusResponse = await fetch(`${LEONARDO_API_URL}/generations/${generationId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.TF_VAR_leonardo_api_key}`,
        },
      });
      
      const statusData = await statusResponse.json();
      const status = statusData.generations_by_pk.status;
      
      if (status === 'COMPLETE') {
        generatedImageUrl = statusData.generations_by_pk.generated_images[0].url;
        break;
      } else if (status === 'FAILED') {
        throw new Error('Image generation failed');
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return NextResponse.json({
      expression: EXPRESSION.name,
      imageUrl: generatedImageUrl,
    });
  } catch (error) {
    console.error('Error in expression generation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 