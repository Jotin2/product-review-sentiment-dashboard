class KeywordService {
    constructor() {
        // Common English stopwords
        this.stopwords = new Set([
            'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
            'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
            'to', 'was', 'will', 'with', 'i', 'you', 'we', 'they', 'this',
            'these', 'those', 'my', 'your', 'our', 'their', 'me', 'him',
            'her', 'us', 'them', 'am', 'is', 'are', 'was', 'were', 'been',
            'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did',
            'doing', 'can', 'could', 'should', 'would', 'may', 'might',
            'must', 'shall', 'will', 'very', 'really', 'quite', 'just',
            'only', 'also', 'even', 'still', 'already', 'yet', 'not',
            'no', 'yes', 'but', 'however', 'although', 'though', 'because',
            'since', 'if', 'when', 'where', 'why', 'how', 'what', 'which',
            'who', 'whom', 'whose', 'all', 'any', 'both', 'each', 'few',
            'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
            'too', 'so', 'up', 'down', 'out', 'off', 'over', 'under',
            'again', 'further', 'then', 'once', 'here', 'there', 'when',
            'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few',
            'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
            'too', 'so', 'up', 'down', 'out', 'off', 'over', 'under',
            'again', 'further', 'then', 'once', 'here', 'there'
        ]);
    }

    // Extract keywords from review text
    extractKeywords(text) {
        if (!text || typeof text !== 'string') {
            return [];
        }

        // Clean and tokenize text
        const words = text
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ') // Remove punctuation
            .split(/\s+/)
            .filter(word => word.length > 2) // Filter out short words
            .filter(word => !this.stopwords.has(word)) // Remove stopwords
            .filter(word => !/^\d+$/.test(word)); // Remove pure numbers

        return words;
    }

    // Get top keywords from all reviews
    getTopKeywords(reviews, limit = 10) {
        const wordCount = new Map();

        reviews.forEach(review => {
            const keywords = this.extractKeywords(review.text);
            keywords.forEach(word => {
                wordCount.set(word, (wordCount.get(word) || 0) + 1);
            });
        });

        // Convert to array and sort by frequency
        const sortedWords = Array.from(wordCount.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([term, count]) => ({ term, count }));

        return sortedWords;
    }

    // Get keywords by sentiment
    getKeywordsBySentiment(reviews, sentiment) {
        const filteredReviews = reviews.filter(review => review.label === sentiment);
        return this.getTopKeywords(filteredReviews, 5);
    }

    // Get comprehensive keyword analysis
    analyzeKeywords(reviews) {
        const allKeywords = this.getTopKeywords(reviews, 15);
        const positiveKeywords = this.getKeywordsBySentiment(reviews, 'positive');
        const negativeKeywords = this.getKeywordsBySentiment(reviews, 'negative');
        const neutralKeywords = this.getKeywordsBySentiment(reviews, 'neutral');

        return {
            overall: allKeywords,
            by_sentiment: {
                positive: positiveKeywords,
                negative: negativeKeywords,
                neutral: neutralKeywords
            }
        };
    }
}

module.exports = new KeywordService();
