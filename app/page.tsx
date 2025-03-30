import React from 'react';

export default function Home() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Resume AI API</h1>
      <p>This is an API-only service. Available endpoints:</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>POST /api/analyze-resume - Analyze resume content</li>
        <li>POST /api/generate-expression-sequence - Generate expression variations</li>
      </ul>
    </div>
  );
} 