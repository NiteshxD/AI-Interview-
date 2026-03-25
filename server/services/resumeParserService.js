import fs from 'fs';
import pdf from 'pdf-parse';

export const parseResume = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    
    // Clean up the temp file
    fs.unlinkSync(filePath);
    
    return data.text.trim();
  } catch (error) {
    // Clean up on error too
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error(`Failed to parse resume: ${error.message}`);
  }
};
