import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

export default function BusinessDetailPage({ business, onBack }) {
    return (
<div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 text-white">
  {!selectedBiz ? (
<div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 text-white">
  <button
    onClick={() => navigate('/business-dashboard')}
    className="text-cyan-400 hover:text-cyan-300 mb-6 transition"
  >
    ← Back
  </button>

  <div className="max-w-5xl mx-auto space-y-8">
    <div className="bg-zinc-900 p-6 rounded-xl shadow-xl border border-zinc-800">
      <h1 className="text-3xl font-bold mb-4 text-fuchsia-400">Manage: {business.name}</h1>
      <h2 className="text-xl font-semibold mb-2 text-cyan-300">Business Description</h2>
      <p className="text-zinc-300 mb-4">{business.description}</p>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('deals')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            activeTab === 'deals'
              ? 'bg-cyan-600 text-white shadow'
              : 'bg-zinc-800 text-zinc-300 hover:text-white'
          }`}
        >
          Deals
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            activeTab === 'reviews'
              ? 'bg-cyan-600 text-white shadow'
              : 'bg-zinc-800 text-zinc-300 hover:text-white'
          }`}
        >
          Reviews
        </button>
      </div>

      {activeTab === 'deals' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-emerald-400">Deals</h2>
          <div className="flex gap-2">
            <input
              className="flex-1 p-3 rounded-md bg-zinc-800 text-white border border-zinc-700 placeholder-zinc-500"
              value={deal}
              onChange={(e) => setDeal(e.target.value)}
              placeholder="Add new deal..."
            />
            <button
              onClick={handleAddDeal}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              Add Deal
            </button>
          </div>
          <ul className="space-y-2">
            {business.deals.map((d, idx) => (
              <li key={idx} className="flex justify-between items-center bg-zinc-800 p-3 rounded-lg">
                <span className="text-white">🎁 {d}</span>
                <button
                  onClick={() => removeDeal({ variables: { businessId: id, deal: d } })}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-emerald-400">Customer Reviews</h2>
          {reviewData?.getReviews.length === 0 ? (
            <p className="text-zinc-400">No reviews yet.</p>
          ) : (
            <ul className="space-y-4">
              {reviewData.getReviews.map((review) => (
                <li key={review.id} className="bg-zinc-800 p-4 rounded-xl border border-zinc-700">
                  <p className="font-semibold text-yellow-400">⭐ {review.rating}</p>
                  <p className="text-zinc-300 mb-2">{review.comment}</p>

                  {review.sentiment && (
                    <span className={`inline-block text-xs font-semibold mb-2 px-2 py-1 rounded-full ${
                      review.sentiment.toUpperCase() === 'NEGATIVE'
                        ? 'bg-red-600 text-white'
                        : 'bg-green-600 text-white'
                    }`}>
                      Sentiment: {review.sentiment}
                    </span>
                  )}

                  {editingResponseId === review.id ? (
                    <div className="space-y-2">
                      <input
                        className="p-3 w-full rounded-md bg-zinc-800 text-white border border-zinc-700"
                        placeholder="Edit your response..."
                        value={responseInputs[review.id] || ''}
                        onChange={(e) => setResponseInputs((prev) => ({ ...prev, [review.id]: e.target.value }))}
                      />
                      <button
                        onClick={() => handleRespond(review.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Save Response
                      </button>
                    </div>
                  ) : review.businessResponse?.text ? (
                    <div className="text-sm text-zinc-400 space-y-1">
                      <p><strong>Response:</strong> {review.businessResponse.text}</p>
                      <div className="space-x-2">
                        <button onClick={() => handleEditClick(review.id, review.businessResponse.text)} className="text-yellow-400 hover:underline">Edit</button>
                        <button onClick={() => handleDeleteResponse(review.id)} className="text-red-500 hover:underline">Delete</button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        className="p-3 w-full rounded-md bg-zinc-800 text-white border border-zinc-700"
                        placeholder="Write your response..."
                        value={responseInputs[review.id] || ''}
                        onChange={(e) => setResponseInputs((prev) => ({ ...prev, [review.id]: e.target.value }))}
                      />
                      <button
                        onClick={() => handleRespond(review.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Respond
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  </div>
</div>

  ) : (
    <BusinessDetailPage business={selectedBiz} onBack={() => setSelectedBiz(null)} />
  )}
</div>

    );
}