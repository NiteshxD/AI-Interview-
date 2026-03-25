const JUDGE0_LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  c: 50
};

export const executeCode = async (code, language, stdin = '') => {
  const apiKey = process.env.JUDGE0_API_KEY;
  const apiUrl = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';

  if (!apiKey || apiKey === 'your_judge0_rapidapi_key_here') {
    return {
      stdout: '',
      stderr: 'Judge0 API not configured. Please set JUDGE0_API_KEY in .env',
      status: { description: 'Configuration Error' },
      time: '0',
      memory: 0
    };
  }

  const languageId = JUDGE0_LANGUAGE_IDS[language];
  if (!languageId) {
    throw new Error(`Unsupported language: ${language}`);
  }

  try {
    const submitRes = await fetch(`${apiUrl}/submissions?base64_encoded=true&wait=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      body: JSON.stringify({
        source_code: Buffer.from(code).toString('base64'),
        language_id: languageId,
        stdin: Buffer.from(stdin).toString('base64')
      })
    });

    const result = await submitRes.json();

    return {
      stdout: result.stdout ? Buffer.from(result.stdout, 'base64').toString() : '',
      stderr: result.stderr ? Buffer.from(result.stderr, 'base64').toString() : '',
      compile_output: result.compile_output ? Buffer.from(result.compile_output, 'base64').toString() : '',
      status: result.status,
      time: result.time,
      memory: result.memory
    };
  } catch (error) {
    throw new Error(`Code execution failed: ${error.message}`);
  }
};

export const getSupportedLanguages = () => {
  return Object.keys(JUDGE0_LANGUAGE_IDS).map(lang => ({
    name: lang,
    id: JUDGE0_LANGUAGE_IDS[lang]
  }));
};
