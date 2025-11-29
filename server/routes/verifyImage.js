const express = require('express');
const router = express.Router();
const upload = require('../services/imageService');
const { extractTextFromImage } = require('../services/ocrService');
const { analyzeImageAuthenticity } = require('../services/visionService');
const { verifyClaim } = require('../services/llmService');
const Verification = require('../models/Verification');

// POST /api/verify/image - Verify claim from image
router.post('/', upload.single('image'), async (req, res) => {
    try {
        console.log('=== IMAGE VERIFICATION REQUEST ===');

        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }

        const imagePath = req.file.path;
        const imageUrl = `/uploads/${req.file.filename}`;

        console.log('Image uploaded:', req.file.filename);

        // Step 1: Extract text from image using OCR
        console.log('Step 1: Extracting text from image...');
        const ocrResult = await extractTextFromImage(imagePath);

        if (!ocrResult.text || ocrResult.text.length < 10) {
            return res.status(400).json({
                error: 'No readable text found in image',
                extractedText: ocrResult.text,
                confidence: ocrResult.confidence
            });
        }

        console.log('Extracted text:', ocrResult.text.substring(0, 100) + '...');

        // Step 2: Analyze image authenticity
        console.log('Step 2: Analyzing image authenticity...');
        const imageAnalysis = await analyzeImageAuthenticity(imagePath);

        // Step 3: Verify the extracted text as a claim
        console.log('Step 3: Verifying extracted text...');
        const verification = await verifyClaim(ocrResult.text, []);

        // Step 4: Save to database
        console.log('Step 4: Saving verification...');
        const savedVerification = await Verification.create({
            claim: ocrResult.text,
            verdict: verification.verdict || 'Unclear',
            confidence: verification.confidence || 0.5,
            publicExplanation: verification.publicExplanation || 'Verification completed',
            analystExplanation: verification.analystExplanation || 'Detailed analysis unavailable',
            sources: verification.sources || [],
            isVerified: true,
            fromImage: true,
            imageUrl: imageUrl,
            ocrConfidence: ocrResult.confidence
        });

        console.log('Verification saved with ID:', savedVerification._id);

        // Return combined results
        res.json({
            success: true,
            _id: savedVerification._id,
            imageUrl: imageUrl,
            extractedText: ocrResult.text,
            ocrConfidence: ocrResult.confidence,
            claim: ocrResult.text,
            verdict: verification.verdict || 'Unclear',
            confidence: verification.confidence || 0.5,
            publicExplanation: verification.publicExplanation,
            analystExplanation: verification.analystExplanation,
            sources: verification.sources || [],
            fakeDetection: imageAnalysis
        });

    } catch (error) {
        console.error('=== IMAGE VERIFICATION ERROR ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('================================');

        res.status(500).json({
            error: 'Failed to process image',
            details: error.message
        });
    }
});

module.exports = router;
