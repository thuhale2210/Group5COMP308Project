import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

export default function BusinessDetailPage({ business, onBack }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6 bg-white/5 p-8 rounded-2xl shadow-xl backdrop-blur-md">

        {/* Back Button */}
        <button
          onClick={onBack}
          className="text-sm bg-zinc-950 text-purple-300 hover:bg-zinc-950/10 mb-6 block">
          ← Back to Listings
        </button>

        {/* Business Info */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-purple-400">{business.name}</h1>
          <p className="text-zinc-300">{business.description}</p>
        </div>

        {/* Deals Section */}
        {business.deals?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">Don't miss these deals!</h3>
            <div className="list-disc pl-5 text-zinc-300 space-y-1">
              {business.deals.map((d, i) => (
                <div key={i} className="leading-relaxed">
                  <span
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300"
                  >
                    🎁 {d}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Review Form */}
        <div>
          <h3 className="text-lg font-semibold text-zinc-100 mb-2">Leave a Review:</h3>
          <ReviewForm businessId={business.id} />
        </div>

        {/* Review List */}
        <div>
          <h3 className="text-lg font-semibold text-zinc-100 mb-2">Reviews:</h3>
          <ReviewList businessId={business.id} />
        </div>

      </div>
    </div>
  );
}
