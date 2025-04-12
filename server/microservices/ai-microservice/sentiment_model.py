from transformers import pipeline

# Load the Hugging Face pipeline (loads model once)
classifier = pipeline("sentiment-analysis")

def analyze_sentiment(text):
    """
    Accepts: text string
    Returns: [{label: POSITIVE/NEGATIVE, score: 0.xx}]
    """
    return classifier(text)