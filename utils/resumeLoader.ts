const DOC_ID = '1rLNO-tLTGXTvR9_KiIeCA_Lhk7F1U0stWZFH_s4g6N8';
const DOC_URL = `https://docs.google.com/document/d/${DOC_ID}/export?format=txt`;

export async function loadResumeFromGoogleDocs() {
  try {
    const response = await fetch(DOC_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch resume');
    }
    const text = await response.text();
    return text;
  } catch (error) {
    console.error('Error loading resume:', error);
    throw error;
  }
} 