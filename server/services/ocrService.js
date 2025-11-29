const { createWorker } = require('tesseract.js');

let worker = null;

// Initialize Tesseract worker
async function initWorker() {
    if (!worker) {
        console.log('Initializing OCR worker...');
        worker = await createWorker('eng+hin'); // English + Hindi support
        console.log('OCR worker ready');
    }
    return worker;
}

// Extract text from image
async function extractTextFromImage(imagePath) {
    try {
        const ocrWorker = await initWorker();

        console.log('Extracting text from image:', imagePath);
        const { data: { text, confidence } } = await ocrWorker.recognize(imagePath);

        // Clean up the extracted text
        const cleanedText = text
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join(' ')
            .trim();

        console.log('Extraction complete. Confidence:', confidence);
        console.log('Extracted text length:', cleanedText.length);

        return {
            text: cleanedText,
            confidence: confidence,
            rawText: text
        };
    } catch (error) {
        console.error('OCR Error:', error);
        throw new Error(`Failed to extract text: ${error.message}`);
    }
}

// Terminate worker (for cleanup)
async function terminateWorker() {
    if (worker) {
        await worker.terminate();
        worker = null;
    }
}

module.exports = {
    extractTextFromImage,
    terminateWorker
};
