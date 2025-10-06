const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const sentimentService = require('../services/sentimentService');
const keywordService = require('../services/keywordService');
const router = express.Router();

// In-memory storage for latest analysis result
let latestAnalysis = null;

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.csv', '.json'];
        const fileExt = path.extname(file.originalname).toLowerCase();
        
        if (allowedTypes.includes(fileExt)) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV and JSON files are allowed'), false);
        }
    }
});

// POST /api/analyze - File upload and analysis endpoint
router.post('/', upload.single('file'), async (req, res) => {
    try {
        console.log('File upload received:', req.file?.originalname);
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        const filePath = req.file.path;
        const fileExt = path.extname(req.file.originalname).toLowerCase();
        
        let reviews = [];
        
        if (fileExt === '.csv') {
            reviews = await parseCSV(filePath);
        } else if (fileExt === '.json') {
            reviews = await parseJSON(filePath);
        }

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        // Process reviews with sentiment analysis
        const analysisResult = sentimentService.processReviews(reviews);
        
        // Extract keywords
        const keywordAnalysis = keywordService.analyzeKeywords(analysisResult.reviews);

        const response = {
            success: true,
            message: 'File uploaded and analyzed successfully',
            data: {
                file_info: {
                    original_name: req.file.originalname,
                    size: req.file.size,
                    type: fileExt
                },
                summary: analysisResult.summary,
                reviews: analysisResult.reviews,
                keywords: keywordAnalysis
            }
        };

        // Store the latest analysis result
        latestAnalysis = response.data;

        console.log(`Successfully processed ${reviews.length} reviews`);
        res.json(response);

    } catch (error) {
        console.error('Upload error:', error.message);
        
        // Clean up file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/analyze/latest - Retrieve the latest analysis result
router.get('/latest', (req, res) => {
    if (!latestAnalysis) {
        return res.status(404).json({
            success: false,
            error: 'No analysis data available. Please upload a file first.'
        });
    }

    res.json({
        success: true,
        data: latestAnalysis
    });
});

// Helper function to parse CSV files
async function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                // Validate required columns
                if (!data.review_text || !data.review_id) {
                    reject(new Error('Missing required columns: review_text and review_id are required'));
                    return;
                }
                results.push(data);
            })
            .on('end', () => {
                if (results.length === 0) {
                    reject(new Error('No valid data found in CSV file'));
                    return;
                }
                resolve(results);
            })
            .on('error', (error) => {
                reject(new Error(`CSV parsing error: ${error.message}`));
            });
    });
}

// Helper function to parse JSON files
async function parseJSON(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        
        // Handle both array and object formats
        let reviews = Array.isArray(jsonData) ? jsonData : jsonData.reviews || [];
        
        if (!Array.isArray(reviews)) {
            throw new Error('JSON must contain an array of reviews');
        }
        
        // Validate required fields
        const validReviews = reviews.filter(review => {
            return review.review_text && review.review_id;
        });
        
        if (validReviews.length === 0) {
            throw new Error('No valid reviews found with required fields: review_text and review_id');
        }
        
        return validReviews;
    } catch (error) {
        throw new Error(`JSON parsing error: ${error.message}`);
    }
}

module.exports = router;
