import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
from textblob import TextBlob
from collections import Counter
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.corpus import stopwords
import warnings
warnings.filterwarnings('ignore')

# Download required NLTK data
nltk.download('vader_lexicon')
nltk.download('stopwords')

class AmazonReviewAnalyzer:
    def __init__(self, file_paths):
        """
        Initialize the analyzer with paths to the TSV files
        """
        self.file_paths = file_paths
        self.products = {}
        self.stop_words = set(stopwords.words('english'))
        self.sia = SentimentIntensityAnalyzer()
        
    def load_data(self):
        """Load and preprocess the data"""
        for product_type, path in self.file_paths.items():
            try:
                df = pd.read_csv(path, sep='\t')
                # Convert review_date to datetime
                df['review_date'] = pd.to_datetime(df['review_date'])
                # Calculate helpfulness ratio
                df['helpfulness_ratio'] = df['helpful_votes'] / df['total_votes'].replace(0, np.nan)
                self.products[product_type] = df
                print(f"Loaded {len(df)} records for {product_type}")
            except Exception as e:
                print(f"Error loading {product_type} data: {str(e)}")
    
    def analyze_ratings_distribution(self):
        """Analyze the distribution of star ratings"""
        results = {}
        for product, df in self.products.items():
            rating_dist = df['star_rating'].value_counts().sort_index()
            results[product] = rating_dist
        return results
    
    def analyze_temporal_patterns(self):
        """Analyze patterns over time"""
        temporal_data = {}
        for product, df in self.products.items():
            # Resample by month and calculate average rating
            monthly_avg = df.set_index('review_date').resample('M')['star_rating'].mean()
            temporal_data[product] = monthly_avg
        return temporal_data
    
    def analyze_review_sentiment(self, text):
        """Analyze sentiment of review text"""
        return self.sia.polarity_scores(text)
    
    def extract_keywords(self, text, n=10):
        """Extract most common keywords from text"""
        if isinstance(text, str):
            words = [word.lower() for word in text.split() 
                    if word.lower() not in self.stop_words and word.isalpha()]
            return Counter(words).most_common(n)
        return []
    
    def analyze_review_helpfulness(self):
        """Analyze what makes reviews helpful"""
        helpfulness_analysis = {}
        for product, df in self.products.items():
            # Get top 10% most helpful reviews
            helpful = df.nlargest(int(len(df) * 0.1), 'helpful_votes')
            # Get bottom 10% least helpful reviews
            not_helpful = df.nsmallest(int(len(df) * 0.1), 'helpful_votes')
            
            helpfulness_analysis[product] = {
                'helpful': helpful,
                'not_helpful': not_helpful
            }
        return helpfulness_analysis

    def generate_report(self):
        """Generate analysis report"""
        report = {
            'ratings_distribution': self.analyze_ratings_distribution(),
            'temporal_patterns': self.analyze_temporal_patterns(),
            'helpfulness_analysis': self.analyze_review_helpfulness()
        }
        return report

def main():
    # Update these paths to your actual file locations
    file_paths = {
        'hair_dryer': 'path/to/hair_dryer.tsv',
        'microwave': 'path/to/microwave.tsv',
        'pacifier': 'path/to/pacifier.tsv'
    }
    
    analyzer = AmazonReviewAnalyzer(file_paths)
    analyzer.load_data()
    
    # Generate and save visualizations
    report = analyzer.generate_report()
    
    # Save analysis results
    with open('amazon_review_analysis_report.txt', 'w') as f:
        f.write("Amazon Review Analysis Report\n")
        f.write("="*50 + "\n\n")
        
        # Ratings distribution
        f.write("1. Ratings Distribution\n")
        for product, dist in report['ratings_distribution'].items():
            f.write(f"\n{product.upper()}:\n")
            f.write(str(dist) + "\n")
        
        # Temporal patterns
        f.write("\n2. Temporal Patterns\n")
        for product, pattern in report['temporal_patterns'].items():
            f.write(f"\n{product.upper()} Monthly Average Ratings:\n")
            f.write(str(pattern.describe()) + "\n")
    
    print("Analysis complete. Check 'amazon_review_analysis_report.txt' for results.")

if __name__ == "__main__":
    main()
