import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';

const GET_BUSINESS = gql`
  query($id: ID!) {
    getBusiness(id: $id) {
      id
      name
      description
      deals
    }
  }
`;

const GET_REVIEWS = gql`
  query($businessId: ID!) {
    getReviews(businessId: $businessId) {
      id
      rating
      comment
      sentiment
      businessResponse {
        text
        respondedAt
      }
    }
  }
`;

const RESPOND_REVIEW = gql`
  mutation($reviewId: ID!, $responseText: String!) {
    respondToReview(reviewId: $reviewId, responseText: $responseText) {
      id
      businessResponse {
        text
        respondedAt
      }
    }
  }
`;

const DELETE_RESPONSE = gql`
  mutation($reviewId: ID!) {
    respondToReview(reviewId: $reviewId, responseText: "") {
      id
      businessResponse {
        text
      }
    }
  }
`;

const ADD_DEAL = gql`
  mutation($businessId: ID!, $deal: String!) {
    addDealToBusiness(businessId: $businessId, deal: $deal) {
      id
      deals
    }
  }
`;

const REMOVE_DEAL = gql`
  mutation($businessId: ID!, $deal: String!) {
    removeDealFromBusiness(businessId: $businessId, deal: $deal) {
      id
      deals
    }
  }
`;

export default function BusinessManagePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useQuery(GET_BUSINESS, { variables: { id } });
  const { data: reviewData, refetch: refetchReviews } = useQuery(GET_REVIEWS, { variables: { businessId: id } });
  const [respondToReview] = useMutation(RESPOND_REVIEW, { onCompleted: () => refetchReviews() });
  const [deleteResponse] = useMutation(DELETE_RESPONSE, { onCompleted: () => refetchReviews() });
  const [deal, setDeal] = useState('');
  const [responseInputs, setResponseInputs] = useState({});
  const [editingResponseId, setEditingResponseId] = useState(null);
  const [addDeal] = useMutation(ADD_DEAL, { onCompleted: () => refetch() });
  const [removeDeal] = useMutation(REMOVE_DEAL, { onCompleted: () => refetch() });
  const [activeTab, setActiveTab] = useState('deals');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading business</p>;

  const business = data.getBusiness;

  const handleAddDeal = async () => {
    if (deal.trim()) {
      await addDeal({ variables: { businessId: id, deal } });
      setDeal('');
    }
  };

  const handleRespond = async (reviewId) => {
    const text = responseInputs[reviewId];
    if (text?.trim()) {
      await respondToReview({ variables: { reviewId, responseText: text } });
      setEditingResponseId(null);
      setResponseInputs((prev) => ({ ...prev, [reviewId]: '' }));
    }
  };

  const handleEditClick = (reviewId, existingText) => {
    setEditingResponseId(reviewId);
    setResponseInputs((prev) => ({ ...prev, [reviewId]: existingText }));
  };

  const handleDeleteResponse = async (reviewId) => {
    await deleteResponse({ variables: { reviewId } });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/business-dashboard')}
          className="text-sm bg-zinc-950 text-purple-300 hover:bg-zinc-950/10 mb-6 block"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-md text-center">
          {business.name}
        </h1>

        <p className="text-center text-white mb-6">{business.description}</p>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab('deals')}
            className={`px-5 py-2 rounded-full font-medium text-sm transition ${activeTab === 'deals'
              ? 'bg-purple-500/20 text-purple-300'
              : 'bg-white/10 text-white hover:bg-white/20'
              }`}
          >
            Deals
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-2 rounded-full font-medium text-sm transition ${activeTab === 'reviews'
              ? 'bg-purple-500/20 text-purple-300'
              : 'bg-white/10 text-white hover:bg-white/20'
              }`}
          >
            Reviews
          </button>
        </div>

        {/* DEALS SECTION */}
        {activeTab === 'deals' && (
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-xl space-y-6">
            <h2 className="text-xl font-semibold text-white-300">Deals</h2>

            <div className="flex gap-2 mt-3">
              <input
                className="bg-zinc-700/70 text-white placeholder-zinc-400 p-2 rounded-lg flex-1 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={deal}
                onChange={(e) => setDeal(e.target.value)}
                placeholder="Add new deal..."
              />
              <button
                onClick={handleAddDeal}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 transition text-white px-4 py-2 rounded-lg shadow-sm"
              >
                Add Deal
              </button>
            </div>
            {business.deals.map((d, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-3 bg-zinc-800 rounded-xl shadow"
              >
                <span className="text-sm">🎁 {d}</span>
                <button
                  onClick={() => removeDeal({ variables: { businessId: id, deal: d } })}
                  className="bg-rose-400/20 text-rose-400 hover:bg-rose-400/30 px-4 py-1.5 text-sm font-medium rounded-full transition shadow-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* REVIEWS SECTION */}
        {activeTab === 'reviews' && (
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-xl space-y-6 mt-6">
            <h2 className="text-xl font-semibold text-white-300">Customer Reviews</h2>

            {reviewData?.getReviews.length === 0 ? (
              <p className="text-zinc-400 italic">No reviews yet.</p>
            ) : (
              <div className="space-y-6">
                {reviewData.getReviews.map((review) => (
                  <div key={review.id} className="p-4 rounded-2xl bg-zinc-800 shadow-md space-y-3">
                    <div className="flex items-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const Icon = star <= Number(review.rating) ? StarIcon : StarOutline;
                        return (
                          <Icon key={star} className="w-5 h-5 text-yellow-400" />
                        );
                      })}
                    </div>
                    {review.sentiment && (
                      <span
                        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${review.sentiment.toUpperCase() === 'NEGATIVE'
                          ? 'bg-red-700/30 text-red-300'
                          : 'bg-green-700/30 text-green-300'
                          }`}
                      >
                        Sentiment: {review.sentiment}
                      </span>
                    )}
                    <p className="text-zinc-300">{review.comment}</p>

                    {/* Owner response */}
                    {editingResponseId === review.id ? (
                      <div className="space-y-2">
                        <input
                          className="w-full p-2 rounded bg-zinc-700 text-white"
                          placeholder="Edit your response..."
                          value={responseInputs[review.id] || ''}
                          onChange={(e) =>
                            setResponseInputs((prev) => ({ ...prev, [review.id]: e.target.value }))
                          }
                        />
                        <button
                          onClick={() => handleRespond(review.id)}
                          className="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white px-4 py-2 rounded-lg shadow-sm"
                        >
                          Save Response
                        </button>
                      </div>
                    ) : review.businessResponse?.text ? (
                      <div className="text-zinc-300 space-y-1">
                        <p>
                          <strong>Your Response:</strong> {review.businessResponse.text}
                        </p>
                        <div className="flex gap-4 mt-1">
                          <button
                            onClick={() => handleEditClick(review.id, review.businessResponse.text)}
                            className="bg-yellow-300/20 text-yellow-300 hover:bg-yellow-300/30 px-3 py-1 text-sm rounded-full transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteResponse(review.id)}
                            className="bg-rose-400/20 text-rose-400 hover:bg-rose-400/30 px-3 py-1 text-sm rounded-full transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 mt-3">
                        <input
                          className="bg-zinc-700/70 text-white placeholder-zinc-400 p-2 rounded-lg flex-1 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Write your response..."
                          value={responseInputs[review.id] || ''}
                          onChange={(e) =>
                            setResponseInputs((prev) => ({ ...prev, [review.id]: e.target.value }))
                          }
                        />
                        <button
                          onClick={() => handleRespond(review.id)}
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 transition text-white px-4 py-2 rounded-lg shadow-sm"
                        >
                          Respond
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

}