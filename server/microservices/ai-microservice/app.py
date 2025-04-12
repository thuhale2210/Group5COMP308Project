from flask import Flask, request, jsonify
from flask_cors import CORS
from sentiment_model import analyze_sentiment

app = Flask(__name__)
CORS(app)  # Allow requests from frontend

@app.route('/')
def home():
    return "AI Sentiment Microservice is running."

@app.route('/sentiment', methods=['POST'])
def sentiment():
    data = request.json
    if 'text' not in data:
        return jsonify({'error': 'Missing "text" in request body'}), 400

    text = data['text']
    result = analyze_sentiment(text)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5002)