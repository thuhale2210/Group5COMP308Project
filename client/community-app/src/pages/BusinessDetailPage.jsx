import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

export default function BusinessDetailPage({ business, onBack }) {
    return (
        <div className="space-y-4">
            <button onClick={onBack} className="text-blue-600">← Back</button>
            <h1 className="text-2xl font-bold">{business.name}</h1>
            <p>{business.description}</p>
            <h3 className="font-semibold">Deals:</h3>
            <ul>{business.deals?.map((d, i) => <li key={i}>🎁 {d}</li>)}</ul>
            <h3 className="font-semibold mt-4">Leave a Review:</h3>
            <ReviewForm businessId={business.id} />
            <h3 className="font-semibold mt-4">Reviews:</h3>
            <ReviewList businessId={business.id} />
        </div>
    );
}