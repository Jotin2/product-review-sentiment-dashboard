const Sentiment = require('sentiment');

class SentimentService {
    constructor() {
        this.sentiment = new Sentiment();
    }

    // Clean and normalize text
    cleanText(text) {
        if (!text || typeof text !== 'string') {
            return '';
        }

        return text
            .toLowerCase()
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
    }

    // Analyze sentiment for a single review
    analyzeReview(review) {
        const cleanedText = this.cleanText(review.review_text);
        
        if (!cleanedText) {
            return {
                id: review.review_id,
                text: review.review_text,
                cleaned_text: '',
                score: 0,
                label: 'neutral',
                confidence: 0
            };
        }

        const result = this.sentiment.analyze(cleanedText);
        
        // Map numeric score to label
        let label = 'neutral';
        if (result.score > 2) {
            label = 'positive';
        } else if (result.score < -2) {
            label = 'negative';
        }

        // Calculate confidence based on score magnitude
        const confidence = Math.min(Math.abs(result.score) / 10, 1);

        return {
            id: review.review_id,
            text: review.review_text,
            cleaned_text: cleanedText,
            score: result.score,
            label: label,
            confidence: confidence,
            // Include original review data
            product_id: review.product_id,
            product_name: review.product_name,
            rating: review.rating,
            date: review.date
        };
    }

    // Process multiple reviews and generate aggregate metrics
    processReviews(reviews) {
        console.log(`Processing ${reviews.length} reviews for sentiment analysis`);
        
        const processedReviews = reviews.map(review => this.analyzeReview(review));
        
        // Calculate aggregate metrics
        const metrics = this.calculateMetrics(processedReviews);
        
        return {
            reviews: processedReviews,
            summary: metrics
        };
    }

    // Calculate aggregate metrics
    calculateMetrics(reviews) {
        const total = reviews.length;
        const positive = reviews.filter(r => r.label === 'positive').length;
        const negative = reviews.filter(r => r.label === 'negative').length;
        const neutral = reviews.filter(r => r.label === 'neutral').length;

        const totalScore = reviews.reduce((sum, r) => sum + r.score, 0);
        const averageScore = total > 0 ? totalScore / total : 0;

        return {
            total_reviews: total,
            sentiment_distribution: {
                positive: {
                    count: positive,
                    percentage: total > 0 ? Math.round((positive / total) * 100) : 0
                },
                negative: {
                    count: negative,
                    percentage: total > 0 ? Math.round((negative / total) * 100) : 0
                },
                neutral: {
                    count: neutral,
                    percentage: total > 0 ? Math.round((neutral / total) * 100) : 0
                }
            },
            average_score: Math.round(averageScore * 100) / 100,
            score_range: {
                min: Math.min(...reviews.map(r => r.score)),
                max: Math.max(...reviews.map(r => r.score))
            }
        };
    }
}

module.exports = new SentimentService();
